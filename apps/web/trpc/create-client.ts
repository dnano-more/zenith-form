import { httpBatchLink, httpLink } from "@repo/trpc/client";
import { env } from "~/env.js";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

function getUrl() {
  const baseUrl = env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  if (baseUrl.endsWith("/trpc")) {
    return baseUrl;
  }
  return `${baseUrl.replace(/\/$/, "")}/trpc`;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  return httpBatchLink({
    url: getUrl(),
    fetch(url, options) {
      return fetch(url, {
        ...options,
        credentials: "include",
      });
    },
  });
};
