import { parseYaml, Plugin, MarkdownPostProcessorContext } from 'obsidian'
import styles from './metatable.css'


/**
 * A metatable [web component](https://developer.mozilla.org/en-US/docs/Web/Web_Components).
 */
class Metatable extends HTMLElement {
  private raw?: object

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.toggleHandler = this.toggleHandler.bind(this)
  }

  static get observedAttributes() {
    return ['open']
  }

  attributeChangedCallback(attrName: string, oldValue: any, newValue: any) {
    if (newValue !== oldValue) {
      this[attrName] = this.hasAttribute(attrName)
    }
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div id="metatable-wrapper"></div>
    `

    this.render()
  }

  render() {
    const { shadowRoot } = this
    const frontmatter = document.querySelector('.frontmatter.language-yaml > code')
    if (frontmatter !== null) {
      this.data = parseYaml(frontmatter.textContent)
    } else {
      console.log("metatable: No `.frontmatter.language-yaml` found. Skipping.")
    }

    shadowRoot.querySelector('#metatable-wrapper').addEventListener('click', this.toggleHandler)
  }

  disconnectedCallback() {
    const { shadowRoot } = this

    shadowRoot.querySelector('#metatable-wrapper').removeEventListener('click', this.toggleHandler)
  }

  get data(): object {
    return this.raw
  }

  set data(blob: object) {
    const { shadowRoot } = this
    this.raw = blob
    const wrapper = shadowRoot.querySelector('#metatable-wrapper')

    wrapper.innerHTML = metatable(Object.entries(blob))
  }

  toggleHandler(event: Event) {
    toggleHandler(this.shadowRoot, event)
  }
}


function toggleHandler(ctx: HTMLElement, event: Event) {
  event.stopPropagation();

  if (event.target?.hasClass('toggle')) {
    const trigger = event.target
    const isExpanded = trigger.getAttribute('aria-expanded') == 'true'
    const targetId = trigger.getAttribute('aria-controls')

    if (isExpanded) {
      const target = ctx.getElementById(targetId)
      const content = target.firstElementChild

      content.setAttribute('aria-hidden', 'true')
      content.setAttribute('tabindex', '-1');

      target.insertAdjacentHTML('beforeend', '<div class="collapsedMark">…</div>')

      trigger.setAttribute('aria-expanded', 'false');
      trigger.textContent = '+'
    } else {
      const target = ctx.getElementById(targetId)
      const content = target.firstElementChild

      content.setAttribute('aria-hidden', 'false')
      content.removeAttribute('tabindex');

      target.querySelector('.collapsedMark').remove()

      trigger.setAttribute('aria-expanded', 'true');
      trigger.textContent = '-'
    }
  }
}


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
  const toggle = isLeaf(data)
    ? ``
    : ` <button
          class="toggle"
          id="${label}"
          aria-label="Toggle ${label}"
          aria-expanded="true"
          aria-controls="${label}-value">-</button>`
  const idAttr = isLeaf(data)
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
function metatable(metadata: [string, unknown][]): string {
  return `
  <table class="metatable">
    ${metadata.map(metarow).join("\n")}
  </table>
  `
}

async function frontmatterProcessor(el: HTMLElement, ctx: MarkdownPostProcessorContext): Promise<void> {
  const frontmatter = await el.querySelector('.frontmatter')

  if (frontmatter !== null) {
    const target = await el.querySelector('.frontmatter-container')
    target.innerHTML = `<obsidian-metatable />`
    // XXX: A nasty hack to pass the frontmatter data without re-serialising
    target.firstElementChild.data = ctx.frontmatter
  }
}


export default class MetatablePlugin extends Plugin {
  async onload() {
    console.log('Loading Metatable')
    customElements.define('obsidian-metatable', Metatable)
    await this.registerMarkdownPostProcessor(frontmatterProcessor)
  }

  onunload() {
    console.log('Unloading Metatable')
  }
}
