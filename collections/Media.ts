import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "alt",
    group: "Content",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Alt text",
      required: true,
      admin: {
        description: "Describe the image for screen readers and SEO.",
      },
    },
  ],
  upload: {
    staticDir: "media",
    // NOTE: for large/high-res image libraries, move to a storage bucket
    // (e.g. Vercel Blob or S3) to keep the repo and container image lean.
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 768, height: 512, position: "centre" },
      { name: "hero", width: 1920, height: 1080, position: "centre" },
      { name: "og", width: 1200, height: 630, position: "centre" },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*"],
  },
};
