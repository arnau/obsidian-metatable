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
function metanode(data: any, label?: string): string {
  let value

  if (Array.isArray(data)) {
    value = label == 'tags'
      ? data.map(metatag).join(' ')
      : `<ul>${data.map(item => `<li>${metanode(item)}</li>`).join('\n')}</ul>`

  } else if (typeof data == 'object') {
    value = metatable(Object.entries(data))

  } else {
    value = data

  }

  return value
}

function isLeaf(data: any): boolean {
  return typeof data != 'object'
}

/**
 * Composes a table row.
 */
function metarow(pair: [string, unknown]): string {
  const label = pair[0]
  const data = pair[1]
  const value = metanode(data, label)
  const toggle = isLeaf(data) || label == 'tags'
    ? ``
    : ` <button
          class="toggle"
          id="${label}"
          aria-label="Toggle ${label}"
          aria-expanded="true"
          aria-controls="${label}-value">-</button>`
  const idAttr = isLeaf(data) || label == 'tags'
    ? ``
    : ` id="${label}-value"`

  return `
  <tr>
    <th>${label}${toggle}</th>
    <td${idAttr}>${value}</td>
  </tr>
  `
}

/**
 * Composes a table.
 */
export default function metatable(metadata: [string, unknown][]): string {
  return `
  <table class="metatable">
    ${metadata.map(metarow).join("\n")}
  </table>
  `
}
