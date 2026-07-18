import { randomBytes } from "crypto";

export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // special characters hatao
    .replace(/\s+/g, "-") // spaces ko dash se replace karo
    .replace(/-+/g, "-") // multiple dashes ko ek mein todo
    .slice(0, 60); // bahut lamba na ho

  const randomSuffix = randomBytes(3).toString("hex"); // 6-char random string

  return `${base || "form"}-${randomSuffix}`;
}