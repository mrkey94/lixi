import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    display: "standalone",
    name: "Lì Xì Tuì Mù",
    short_name: "LixiTuimu",
    description: "Lì xì tuì mù, Mở ngay nhận lì xì",
    start_url: "/",
    scope: "/",
    theme_color: "#FFFFFF",
    background_color: "#FFFFFF",
    icons: [
      {
        sizes: "512x512",
        src: "favicon.png",
        type: "image/png",
      },
    ],
  };
}
