import { getPayload } from "payload";
import configPromise from "@payload-config";

// Single cached Payload instance per process — safe for Next.js App Router.
export async function getPayloadClient() {
  return getPayload({ config: configPromise });
}
