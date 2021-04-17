import { parseYaml, Plugin, MarkdownPostProcessorContext } from 'obsidian'
import styles from './metatable.css'
import metatable from './table'

function log(msg: string) {
  console.info(`metatable: ${msg}`)
}

/**
 * A metatable [web component](https://developer.mozilla.org/en-US/docs/Web/Web_Components).
 */
class Metatable extends HTMLElement {
  // The raw frontmatter data.
  private raw?: object = null

  // The root element where the data is rendered.
  private root?: HTMLElement = null

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.toggleHandler = this.toggleHandler.bind(this)
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div id="metatable-wrapper"></div>
    `
    this.root = this.shadowRoot.querySelector('#metatable-wrapper')
    this.renderData()
    this.root.addEventListener('click', this.toggleHandler)
    log(`${this.id} connected`)
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this.toggleHandler)
    log(`${this.id} disconnected`)
  }

  static get observedAttributes() {
    return ['id']
  }

  attributeChangedCallback(attrName: string, oldValue: any, newValue: any) {
    if (newValue !== oldValue) {
      this[attrName] = this.getAttribute(attrName)
    }
  }

  get data(): object {
    return this.raw
  }

  set data(blob: object) {
    this.raw = blob
    this.renderData()
  }

  private renderData() {
    if (this.raw !== null) {
      this.root.innerHTML = metatable(Object.entries(this.raw))
    }
  }

  toggleHandler(event: Event) {
    toggleHandler(this.shadowRoot, event)
  }
}


function toggleHandler(ctx: HTMLElement, event: Event) {
  event.stopPropagation();
  const trigger: HTMLElement = event.target as HTMLElement

  if (trigger?.hasClass('toggle')) {
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


async function frontmatterProcessor(el: HTMLElement, ctx: MarkdownPostProcessorContext): Promise<void> {
  const frontmatter = await el.querySelector('.frontmatter')

  if (frontmatter !== null) {
    const target = el.querySelector('.frontmatter-container')
    target.removeClass('is-collapsed')
    target.innerHTML = `<obsidian-metatable id=${ctx.docId} />`
    const mt = target.querySelector('obsidian-metatable')
    mt.data = ctx.frontmatter
  }
}


export default class MetatablePlugin extends Plugin {
  async onload() {
    customElements.define('obsidian-metatable', Metatable)
    await this.registerMarkdownPostProcessor(frontmatterProcessor)
    log('loaded')
  }

  onunload() {
    log('unloaded')
  }
}
