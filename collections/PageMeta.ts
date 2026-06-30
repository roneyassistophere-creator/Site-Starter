import type { CollectionConfig } from "payload";

export const PageMeta: CollectionConfig = {
  slug: "page-meta",
  admin: {
    useAsTitle: "path",
    group: "SEO",
    description:
      "Override per-page SEO values for static code pages. The path must match the page route (e.g. /, /about).",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "path",
      type: "text",
      label: "Page path",
      required: true,
      unique: true,
      admin: {
        description:
          "Exact URL path, e.g. / or /about. Must start with /.",
        placeholder: "/about",
      },
    },
    {
      name: "title",
      type: "text",
      label: "Meta title",
      admin: { description: "Overrides the hardcoded page title." },
    },
    {
      name: "description",
      type: "textarea",
      label: "Meta description",
      admin: { description: "Target 140–160 characters." },
    },
    {
      name: "canonical",
      type: "text",
      label: "Canonical URL",
      admin: {
        description:
          "Full canonical URL. Leave blank to auto-derive from path.",
      },
    },
    {
      name: "ogImage",
      type: "upload",
      relationTo: "media",
      label: "OG image",
    },
    {
      name: "noindex",
      type: "checkbox",
      label: "No-index (hide from search engines)",
      defaultValue: false,
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        try {
          const { revalidatePath } =
            await import("next/cache");
          revalidatePath(doc.path);
        } catch (_) {
          // not in Next.js context (e.g. seed scripts)
        }
      },
    ],
  },
};
