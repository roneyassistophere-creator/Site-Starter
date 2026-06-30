import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { seoPlugin } from "@payloadcms/plugin-seo";
import sharp from "sharp";

import { Media } from "./collections/Media";
import { PageMeta } from "./collections/PageMeta";
import { Posts } from "./collections/Posts";
import { Projects } from "./collections/Projects";
import { Settings } from "./globals/Settings";
import { Integrations } from "./globals/Integrations";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: "users",
    meta: {
      titleSuffix: "— Payload Starter Admin",
    },
  },
  collections: [
    // Users collection (built-in auth)
    {
      slug: "users",
      auth: true,
      admin: { group: "Admin" },
      fields: [
        { name: "name", type: "text" },
      ],
    },
    Media,
    PageMeta,
    Posts,
    Projects,
  ],
  globals: [Settings, Integrations],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET ?? "fallback-secret-change-me",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? "",
    },
  }),
  plugins: [
    seoPlugin({
      collections: ["posts", "projects"],
      uploadsCollection: "media",
      generateTitle: ({ doc }) => `${doc.title} | Acme Agency`,
      generateDescription: ({ doc }) =>
        doc.excerpt ?? doc.summary ?? "",
    }),
  ],
  upload: {
    limits: {
      fileSize: 10_000_000, // 10 MB
    },
  },
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000",
  sharp,
});
