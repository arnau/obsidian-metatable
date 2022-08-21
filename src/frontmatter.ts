import { parseYaml } from "obsidian";
import type { MaybeValue } from "./value";

export const FRONTMATTER_REGEX = /^\n*---[^\n]*\n+(?<fm>.+?)\n+---.*/s;

export type Frontmatter = string | null | undefined

export function readFrontmatter(md: string) {
  const result = md.match(FRONTMATTER_REGEX)

  return result?.groups?.fm
}

// throws: MetadataError
export function parseFrontmatter(input: Frontmatter): MaybeValue {
  if (input === undefined || input === null) { return }

  return parseYaml(input)
}
