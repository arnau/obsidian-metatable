import { parseYaml, Plugin, MarkdownPostProcessorContext } from 'obsidian'
import styles from './metatable.css'


/**
 * A metatable [web component](https://developer.mozilla.org/en-US/docs/Web/Web_Components).
 */
class Metatable extends HTMLElement {
  // The raw frontmatter data
  private raw?: object
  // The observer for changes in frontmatter children (i.e. code.is-loaded)
  private observer?: MutationObserver
  // The frontmatter element
  private frontmatter?: HTMLElement

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

    this.frontmatter = document.querySelector('.frontmatter')
    this.render()

  }

  render() {
    const { shadowRoot } = this
    this.fetchData()

    const callback = (mutationsList, observer) => {
      for (const mutation of mutationsList) {
        const {target} = mutation

        if (target.nodeName === 'CODE' && target.hasClass('is-loaded')) {
          this.data = parseYaml(target.textContent)
        }
      }
    }

    this.observer = new MutationObserver(callback)
    this.observer.observe(this.frontmatter, { attributeFilter: ['class'], subtree: true })

    shadowRoot.querySelector('#metatable-wrapper').addEventListener('click', this.toggleHandler)
  }

  /**
   * Takes the frontmatter from the code element and stores it as plain YAML.
   */
  fetchData() {
    const code = this.frontmatter.querySelector('code')
    if (code !== null) {
      this.data = parseYaml(code.textContent)
    }
  }

  disconnectedCallback() {
    const { shadowRoot } = this

    this.observer?.disconnect()
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
    const target = el.querySelector('.frontmatter-container')
    target.innerHTML = `<obsidian-metatable />`
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
