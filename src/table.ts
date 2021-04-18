/**
 * Composes a link for tags as defined by Obsidian's default metadata block.
 */
function metatag(value: string[]): string {
  return `
    <a class="tag" target="_blank" rel="noopener" href="#${value}">${value}</a>
  `
}

/**
 * Dispatches the transformation to HTML for each type of data value.
 */
function metanode(data: any, label?: string, hideLeaf: boolean): string {
  let value

  if (Array.isArray(data)) {
    value = label == 'tags'
      ? data.map(metatag).join(' ')
      : `<ul aria-hidden=${hideLeaf}>
          ${data.map(item => `<li>${metanode(item)}</li>`).join('\n')}
         </ul>
         <div aria-hidden=${!hideLeaf} class="collapsedMark">…</div>`

  } else if (typeof data == 'object') {
    value = table(Object.entries(data), hideLeaf)

  } else {
    value = data

  }

  return value
}

function isLeaf(data: any): boolean {
  return typeof data != 'object'
}

function isExpanded(value: string): boolean {
  return value == 'expanded'
}

/**
 * Composes a table row.
 */
function metarow(pair: [string, unknown], hideLeaf): string {
  const label = pair[0]
  const data = pair[1]
  const value = metanode(data, label, hideLeaf)
  const toggle = isLeaf(data) || label == 'tags'
    ? ``
    : ` ${button(label, !hideLeaf)}`
  const idAttr = isLeaf(data) || label == 'tags'
    ? ``
    : ` id="${label}-value"`

  return `
  <tr>
    <th>${toggle}${label}</th>
    <td${idAttr}>${value}</td>
  </tr>
  `
}

function button(label: string, expanded: boolean): string {
  const symbol = expanded ? '▼' : '▶︎'
  return `<button
            class="toggle"
            id="${label}"
            aria-label="Toggle ${label}"
            aria-expanded="${expanded}"
            aria-controls="${label}-value">${symbol}</button>`
}

function table(metadata: [string, unknown][], hideLeaf: boolean): string {
  return `
  <table class="metatable" aria-hidden=${hideLeaf}>
    ${metadata.map(item => metarow(item, hideLeaf)).join("\n")}
  </table>
  <div aria-hidden=${!hideLeaf} class="collapsedMark">…</div>
  `
}

/**
 * Composes a table.
 */
export default function metatable(metadata: [string, unknown][], expanded: string): string {
  const hideLeaf = !isExpanded(expanded)
  const open = expanded == 'all-collapsed' ? '' : ' open'

  return `
    <details${open}>
      <summary>Metadata</summary>
      <table class="metatable">
        ${metadata.map(item => metarow(item, hideLeaf)).join("\n")}
      </table>
    </details>
  `
}
