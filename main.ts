import { Plugin, MarkdownPostProcessorContext } from 'obsidian';


/**
 * Composes a link for tags as defined by Obsidian's default metadata block.
 */
function metatag(value: string[]): string {
  return `
    <a class="tag" target="_blank" rel="noopener" href="#${value}">#${value}</a>
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

/**
 * Composes a table row.
 */
function metarow(pair: [string, unknown]): string {
  const label = pair[0]
  const value = metanode(pair[1], label)

  return `
  <tr>
    <th>${label}</th>
    <td>${value}</td>
  </tr>
  `
}

/**
 * Composes a table.
 */
function metatable(metadata: [string, unknown][]): string {
  return `
  <table class="metatable">
    ${metadata.map(metarow).join("\n")}
  </table>
  `;
}

function frontmatterProcessor(el: HTMLElement, ctx: MarkdownPostProcessorContext): void {
  const metadata = Object.entries(ctx.frontmatter)
  const frontmatter = el.querySelector('.frontmatter')

  if (frontmatter !== null) {
    const target = el.querySelector('.frontmatter-container')
    target.innerHTML = metatable(metadata)
  }
}


export default class MetatablePlugin extends Plugin {
  async onload() {
    console.log('Loading Metatable');
    await this.registerMarkdownPostProcessor(frontmatterProcessor);
  }

  onunload() {
    console.log('Unloading Metatable');
  }
}
