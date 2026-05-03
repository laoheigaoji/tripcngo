export default {
  fetch(request) {
    return fetch(new URL(request.url, "https://pages.cloudflare.com")).then(
      (res) =>
        new Response(res.body, {
          status: res.status,
          headers: {
            ...res.headers,
            "x-robots-tag": "noindex",
          },
        })
    );
  },
};
