import type { GlobalConfig } from "payload";

export const Settings: GlobalConfig = {
  slug: "settings",
  admin: {
    group: "Site",
    description: "Global site identity, default SEO, and Organization data for JSON-LD.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "siteName",
      type: "text",
      defaultValue: "Acme Agency",
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
    },
    {
      type: "group",
      name: "seo",
      label: "Default SEO",
      fields: [
        {
          name: "titleTemplate",
          type: "text",
          defaultValue: "%s | Acme Agency",
          admin: {
            description:
              "Use %s as placeholder for the page title, e.g. '%s | Acme Agency'.",
          },
        },
        {
          name: "defaultDescription",
          type: "textarea",
          defaultValue: "Acme Agency — world-class digital services.",
        },
        {
          name: "defaultOgImage",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
    {
      type: "group",
      name: "organization",
      label: "Organization (JSON-LD)",
      fields: [
        { name: "name", type: "text" },
        { name: "url", type: "text" },
        { name: "email", type: "email" },
        { name: "phone", type: "text" },
        {
          name: "address",
          type: "group",
          fields: [
            { name: "streetAddress", type: "text" },
            { name: "city", type: "text" },
            { name: "region", type: "text" },
            { name: "postalCode", type: "text" },
            { name: "country", type: "text", defaultValue: "US" },
          ],
        },
        {
          name: "socialProfiles",
          type: "array",
          fields: [{ name: "url", type: "text" }],
        },
      ],
    },
  ],
};
