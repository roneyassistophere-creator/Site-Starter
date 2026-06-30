import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
    group: "Portfolio",
    defaultColumns: ["title", "client", "featured", "order"],
    preview: (doc) =>
      `${process.env.NEXT_PUBLIC_SERVER_URL}/portfolio/${doc.slug}`,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { position: "sidebar" },
      hooks: {
        beforeValidate: [
          ({ data, value }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
            }
            return value;
          },
        ],
      },
    },
    {
      name: "summary",
      type: "textarea",
      admin: { description: "Shown on portfolio grid card." },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "gallery",
      type: "array",
      fields: [
        { name: "image", type: "upload", relationTo: "media" },
        { name: "caption", type: "text" },
      ],
    },
    {
      name: "content",
      type: "richText",
      editor: lexicalEditor({}),
    },
    {
      name: "category",
      type: "text",
      admin: { position: "sidebar" },
    },
    {
      name: "tags",
      type: "array",
      fields: [{ name: "tag", type: "text" }],
      admin: { position: "sidebar" },
    },
    {
      name: "client",
      type: "text",
      admin: { position: "sidebar" },
    },
    {
      name: "date",
      type: "date",
      admin: { position: "sidebar" },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Lower numbers appear first.",
      },
    },
    // SEO fields added by plugin-seo in payload.config.ts
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        try {
          const { revalidatePath } = await import("next/cache");
          revalidatePath("/portfolio");
          revalidatePath(`/portfolio/${doc.slug}`);
        } catch (_) {}
      },
    ],
  },
};
