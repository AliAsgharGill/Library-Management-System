const nextConfig = {
  images: {
    domains: [
      "i.pinimg.com",
      "encrypted-tbn0.gstatic.com",
      "books.google.com.pk",
      "upload.wikimedia.org",
      "res.cloudinary.com",
      "i0.wp.com",
      "encrypted-tbn0.gstatic.com",
      "cdn.britannica.com",
      "books.google.com.pk",
      "assets-eu-01.kc-usercontent.com",
      "gufhtugu.com",
      "upload.wikimedia.org",
      "cdn.thinglink.me",
    ],
  },
  async middleware() {
    const { middleware } = await import("./middleware.ts");
    return middleware;
  },
};

export default nextConfig;
