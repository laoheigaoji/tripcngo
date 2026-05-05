import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const isChina = () => {
  if (typeof window === 'undefined') return false;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz.startsWith('Asia/Shanghai') || tz.startsWith('Asia/Beijing');
  } catch {
    return false;
  }
};

export const proxyUrl = import.meta.env.VITE_CLOUDFLARE_PROXY_URL;

export const useProxy = () => proxyUrl && isChina();

export const getFirebaseUrl = (path: string) => {
  if (useProxy()) {
    return `${proxyUrl}/firestore/${path}`;
  }
  return `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/${path}`;
};

export const getStorageUrl = (path: string) => {
  if (useProxy()) {
    return `${proxyUrl}/storage/${path}`;
  }
  return `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${encodeURIComponent(path)}`;
};
