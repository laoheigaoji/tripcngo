export default {
  async fetch(request, env) {
    const { country } = request.cf || { country: null };
    const isCN = country === 'CN';
    
    const url = new URL(request.url);
    const path = url.pathname;
    
    if (path.startsWith('/firestore/')) {
      const target = `https://firestore.googleapis.com/v1/projects/gen-lang-client-0089215609/databases/ai-studio-dad26224-3220-45c5-ba53-45703bbc9d18/documents${path.replace('/firestore', '')}${url.search}`;
      return fetch(target, { headers: new Headers(request.headers), cf: isCN ? { cacheTtl: 0 } : {} });
    }
    
    if (path.startsWith('/storage/')) {
      const target = `https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0089215609.appspot.com/o/${encodeURIComponent(path.replace('/storage/', ''))}${url.search}`;
      return fetch(target, { headers: new Headers(request.headers), cf: isCN ? { cacheTtl: 0 } : {} });
    }
    
    return new Response(JSON.stringify({ country, isCN }), { headers: { 'Content-Type': 'application/json' } });
  }
};
