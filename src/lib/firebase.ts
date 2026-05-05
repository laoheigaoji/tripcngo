import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, setDoc, updateDoc, deleteDoc, query, orderBy, where, limit, increment, serverTimestamp, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

export const isChina = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz.startsWith('Asia/Shanghai') || tz.startsWith('Asia/Beijing') || tz.startsWith('Asia/Hong_Kong');
  } catch {
    return false;
  }
};

const proxyUrl = import.meta.env.VITE_CLOUDFLARE_PROXY_URL;
const useProxyMode = proxyUrl && isChina();

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
const auth = getAuth(app);
const storage = getStorage(app);

class FirestoreProxy {
  private proxyUrl: string;
  private projectId: string;
  private databaseId: string;

  constructor(proxyUrl: string, projectId: string, databaseId: string) {
    this.proxyUrl = proxyUrl;
    this.projectId = projectId;
    this.databaseId = databaseId;
  }

  async getDocument(collectionName: string, docId: string): Promise<DocumentData | null> {
    const url = `${this.proxyUrl}/firestore/${collectionName}/${docId}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data.fields ? this.convertFirestoreFields(data.fields) : data;
  }

  async getCollection(collectionName: string, q?: { field?: string; op?: string; value?: any; orderBy?: string; limit?: number }): Promise<{ id: string; data: DocumentData }[]> {
    let url = `${this.proxyUrl}/firestore/${collectionName}`;
    const params: string[] = [];
    
    if (q?.orderBy) params.push(`orderBy=${q.orderBy}`);
    if (q?.limit) params.push(`limit=${q.limit}`);
    if (q?.field && q?.op && q?.value !== undefined) {
      params.push(`where=${q.field}${q.op}${encodeURIComponent(String(q.value))}`);
    }
    
    if (params.length) url += `?${params.join('&')}`;
    
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return data.documents?.map((doc: any) => ({
      id: doc.name.split('/').pop(),
      data: doc.fields ? this.convertFirestoreFields(doc.fields) : {}
    })) || [];
  }

  async addDocument(collectionName: string, data: DocumentData): Promise<string | null> {
    const url = `${this.proxyUrl}/firestore/${collectionName}`;
    const firestoreData = this.convertToFirestoreFields(data);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: firestoreData })
    });
    if (!response.ok) return null;
    const result = await response.json();
    return result.name?.split('/').pop() || null;
  }

  async setDocument(collectionName: string, docId: string, data: DocumentData, merge = false): Promise<boolean> {
    const url = `${this.proxyUrl}/firestore/${collectionName}/${docId}`;
    const firestoreData = this.convertToFirestoreFields(data);
    const response = await fetch(url, {
      method: merge ? 'PATCH' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: firestoreData })
    });
    return response.ok;
  }

  async updateDocument(collectionName: string, docId: string, data: DocumentData): Promise<boolean> {
    return this.setDocument(collectionName, docId, data, true);
  }

  async deleteDocument(collectionName: string, docId: string): Promise<boolean> {
    const url = `${this.proxyUrl}/firestore/${collectionName}/${docId}`;
    const response = await fetch(url, { method: 'DELETE' });
    return response.ok;
  }

  private convertFirestoreFields(fields: any): DocumentData {
    const result: DocumentData = {};
    for (const key in fields) {
      const value = fields[key];
      if (value.stringValue !== undefined) result[key] = value.stringValue;
      else if (value.integerValue !== undefined) result[key] = parseInt(value.integerValue);
      else if (value.doubleValue !== undefined) result[key] = parseFloat(value.doubleValue);
      else if (value.booleanValue !== undefined) result[key] = value.booleanValue;
      else if (value.timestampValue !== undefined) result[key] = new Date(value.timestampValue);
      else if (value.mapValue !== undefined) result[key] = this.convertFirestoreFields(value.mapValue.fields);
      else if (value.arrayValue !== undefined) result[key] = value.arrayValue.values?.map((v: any) => this.extractValue(v)) || [];
      else result[key] = value;
    }
    return result;
  }

  private extractValue(value: any): any {
    if (value.stringValue !== undefined) return value.stringValue;
    if (value.integerValue !== undefined) return parseInt(value.integerValue);
    if (value.doubleValue !== undefined) return parseFloat(value.doubleValue);
    if (value.booleanValue !== undefined) return value.booleanValue;
    if (value.timestampValue !== undefined) return new Date(value.timestampValue);
    return value;
  }

  private convertToFirestoreFields(data: DocumentData): any {
    const result: any = {};
    for (const key in data) {
      const value = data[key];
      if (typeof value === 'string') result[key] = { stringValue: value };
      else if (typeof value === 'number') result[key] = Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: String(value) };
      else if (typeof value === 'boolean') result[key] = { booleanValue: value };
      else if (value instanceof Date) result[key] = { timestampValue: value.toISOString() };
      else if (value === null || value === undefined) continue;
      else result[key] = { stringValue: JSON.stringify(value) };
    }
    return result;
  }
}

const proxy = useProxyMode ? new FirestoreProxy(
  proxyUrl!,
  firebaseConfig.projectId,
  firebaseConfig.firestoreDatabaseId
) : null;

export const useProxy = () => !!proxy;

export const getDocProxy = async (docRef: any): Promise<{ data: () => DocumentData | undefined } | null> => {
  if (!proxy) {
    const snap = await getDoc(docRef);
    return snap.exists() ? { data: () => snap.data() } : null;
  }
  const path = docRef.path.split('/');
  const data = await proxy.getDocument(path[0], path[1]);
  return data ? { data: () => data } : null;
};

export const getDocsProxy = async (queryRef: any): Promise<{ docs: { id: string; data: () => DocumentData }[] }> => {
  if (!proxy) {
    const snap = await getDocs(queryRef);
    return { docs: snap.docs.map((d: QueryDocumentSnapshot) => ({ id: d.id, data: () => d.data() })) };
  }
  
  const collectionName = queryRef._queryOptions.collectionId;
  const q: { orderBy?: string; limit?: number } = {};
  
  if (queryRef._queryOptions.fieldOrders?.length) {
    q.orderBy = queryRef._queryOptions.fieldOrders[0].field;
  }
  if (queryRef._queryOptions.limit) {
    q.limit = queryRef._queryOptions.limit;
  }
  
  const docs = await proxy.getCollection(collectionName, q);
  return { docs: docs.map(d => ({ id: d.id, data: () => d.data })) };
};

export const addDocProxy = async (colRef: any, data: DocumentData): Promise<{ id: string }> => {
  if (!proxy) {
    const ref = await addDoc(colRef, data);
    return { id: ref.id };
  }
  const collectionName = colRef._collectionId;
  const id = await proxy.addDocument(collectionName, data);
  return { id: id || '' };
};

export const setDocProxy = async (docRef: any, data: DocumentData, options?: { merge?: boolean }): Promise<void> => {
  if (!proxy) {
    await setDoc(docRef, data, options);
    return;
  }
  const path = docRef.path.split('/');
  await proxy.setDocument(path[0], path[1], data, options?.merge);
};

export const updateDocProxy = async (docRef: any, data: DocumentData): Promise<void> => {
  if (!proxy) {
    await updateDoc(docRef, data);
    return;
  }
  const path = docRef.path.split('/');
  await proxy.updateDocument(path[0], path[1], data);
};

export const deleteDocProxy = async (docRef: any): Promise<void> => {
  if (!proxy) {
    await deleteDoc(docRef);
    return;
  }
  const path = docRef.path.split('/');
  await proxy.deleteDocument(path[0], path[1]);
};

export const getStorageUrlProxy = async (storageRef: any): Promise<string> => {
  if (!proxy) {
    return getDownloadURL(storageRef);
  }
  const fullPath = storageRef._location.path;
  return `${proxyUrl}/storage/${fullPath}`;
};

export { 
  db, 
  auth, 
  storage, 
  collection, 
  doc, 
  query, 
  orderBy, 
  where, 
  limit, 
  increment, 
  serverTimestamp,
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  ref as storageRef,
  uploadBytes,
  User
};
