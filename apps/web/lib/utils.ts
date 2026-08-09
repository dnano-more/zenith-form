import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getApiBaseUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  return apiUrl.replace(/\/trpc\/?$/, "").replace(/\/$/, "");
}

export function getApiDocsUrl() {
  return `${getApiBaseUrl()}/docs`;
}

export function getOpenApiSpecUrl() {
  return `${getApiBaseUrl()}/openapi.json`;
}