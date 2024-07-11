const nextConfig = {
    images: {
      domains: ["i.pinimg.com", "encrypted-tbn0.gstatic.com"],
    },
    async middleware() {
      const { middleware } = await import('./middleware.ts');  
      return middleware;
    },
  };
  
  export default nextConfig;
  