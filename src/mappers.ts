import { Rule } from './rule'

export type Tag = string

/**
 * Tags can be expressed in multiple ways in frontmatter. Some are not correct
 * in YAML but still convenient for users.
 *
 * ## Example
 *
 * 'clean' usage:
 *
 * ```yaml
 * tags: [example, valid-yaml]
 * ```
 *
 *
 * ```yaml
 * tags:
 *   - example
 *   - valid-yaml
 * ```
 *
 * 'dirty' comma-separated string:
 *
 * ```yaml
 * tags: example, valid-yaml
 * ```
 *
 * 'dirty' invalid string (the YAML parser nullifies it):
 *
 * ```yaml
 * tags: #example, #valid-yaml
 * ```
 *
 * The above will result in `null`.
 */
export type DirtyTags = string | string[] | null

/**
 * Transforms a list of dirty tags into HTML.
 */
export function taglist(data: DirtyTags, rule: Rule): HTMLElement | null {
  const list = normaliseTags(data)

  // No valid tags found.
  if (list.length == 0) return null

  const root = document.createElement('ul')
  root.classList.add('tag-list')

  list.forEach((item: string) => {
    const li = document.createElement('li')
    const value = tag(item)

    li.append(value)
    root.append(li)
  })

  return root
}

/**
 * Normalises a list of tags as an array of strings.
 */
function normaliseTags(data: DirtyTags): Tag[] {
  if (data == null) { return [] }

  if (typeof data == 'string') {
    return data.split(',').map(x => x.trim()).filter(x => x && x.length != 0)
  }

  return (data as Tag[]).filter(x => x && x.length != 0)
}

function tag(value: string): HTMLElement {
  const a = document.createElement('a')
  a.classList.add('tag')

  // XXX: Note that `part` is an `Element` extension in draft. Checking for
  // undefined lets us get away with plain jest dom testing.
  // @ts-ignore
  a.part?.add('tag')
  // @ts-ignore
  a.part?.add(encodeURI(value))

  a.setAttribute('target', '_blank')
  a.setAttribute('rel', 'noopener')
  a.setAttribute('href', `#${value}`)
  a.append(`${value}`)

  return a
}
