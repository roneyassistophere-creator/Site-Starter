import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { seoPlugin } from "@payloadcms/plugin-seo";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    group: "Blog",
    defaultColumns: ["title", "status", "publishedAt", "author"],
    preview: (doc) =>
      `${process.env.NEXT_PUBLIC_SERVER_URL}/blog/${doc.slug}`,
  },
  access: {
    read: ({ req }) => {
      if (req.user) return true;
      return { status: { equals: "published" } };
    },
  },
  versions: {
    drafts: { autosave: { interval: 375 } },
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
      admin: {
        description: "Auto-generated from title. Edit for custom URL.",
        position: "sidebar",
      },
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
      name: "excerpt",
      type: "textarea",
      admin: {
        description: "Short summary shown in blog list and search results.",
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "content",
      type: "richText",
      editor: lexicalEditor({}),
    },
    {
      name: "categories",
      type: "array",
      fields: [{ name: "category", type: "text" }],
      admin: { position: "sidebar" },
    },
    {
      name: "tags",
      type: "array",
      fields: [{ name: "tag", type: "text" }],
      admin: { position: "sidebar" },
    },
    {
      name: "author",
      type: "text",
      admin: { position: "sidebar" },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      defaultValue: "draft",
      required: true,
      admin: { position: "sidebar" },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        try {
          const { revalidatePath } = await import("next/cache");
          revalidatePath("/blog");
          revalidatePath(`/blog/${doc.slug}`);
        } catch (_) {}
      },
    ],
  },
};
