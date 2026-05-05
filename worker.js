export default {
  async fetch(request, env) {
    const { country } = request.cf || { country: null };
    const isCN = country === 'CN';
    const url = new URL(request.url);
    const path = url.pathname;
    
    if (path.startsWith('/firestore/')) {
      return this.proxyFirestore(request, url, isCN);
    }
    
    if (path.startsWith('/storage/')) {
      return this.proxyStorage(request, url, isCN);
    }
    
    return new Response(JSON.stringify({ country, isCN }), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  },
  
  async proxyFirestore(request, url, isCN) {
    const firestorePath = url.pathname.replace('/firestore/', '');
    const target = `https://firestore.googleapis.com/v1/projects/gen-lang-client-0089215609/databases/ai-studio-dad26224-3220-45c5-ba53-45703bbc9d18/documents/${firestorePath}${url.search}`;
    
    const headers = new Headers(request.headers);
    headers.set('Host', 'firestore.googleapis.com');
    
    const response = await fetch(target, {
      method: request.method,
      headers: headers,
      body: request.body,
      cf: isCN ? { cacheTtl: 0 } : {}
    });
    
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders
    });
  },
  
  async proxyStorage(request, url, isCN) {
    const storagePath = url.pathname.replace('/storage/', '');
    const target = `https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0089215609.appspot.com/o/${encodeURIComponent(storagePath)}${url.search}`;
    
    const headers = new Headers(request.headers);
    headers.set('Host', 'firebasestorage.googleapis.com');
    
    const response = await fetch(target, {
      method: request.method,
      headers: headers,
      body: request.body,
      cf: isCN ? { cacheTtl: 0 } : {}
    });
    
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders
    });
  }
};
