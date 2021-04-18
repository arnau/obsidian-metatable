import { logger } from './utils'
// @ts-ignore
import styles from './metatable.css'
import metatable from './table'

/**
 * A metatable [web component](https://developer.mozilla.org/en-US/docs/Web/Web_Components).
 */
export class Metatable extends HTMLElement {
  // The raw frontmatter data.
  private raw?: object = null

  // The root element where the data is rendered.
  private root?: HTMLElement = null

  private log: (msg: string) => void

  // Attributes
  debug: boolean
  expanded: string
  id: string

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.toggleHandler = this.toggleHandler.bind(this)
  }

  connectedCallback() {
    this.log = logger(this.debug)

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div id="metatable-wrapper"></div>
    `
    this.root = this.shadowRoot.querySelector('#metatable-wrapper')
    this.renderData()
    this.root.addEventListener('click', this.toggleHandler)

    this.log(`${this.id} connected`)
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this.toggleHandler)

    this.log(`${this.id} disconnected`)
  }

  static get observedAttributes() {
    return ['id', 'debug', 'expanded']
  }

  attributeChangedCallback(attrName: string, oldValue: any, newValue: any) {
    if (newValue !== oldValue) {
      switch (attrName) {
        case 'id':
          this.id = this.getAttribute(attrName)
          break;
        case 'expanded':
          this.expanded = this.getAttribute(attrName)
          break;
        case 'debug':
          this.debug = this.getAttribute(attrName) == 'true'
          break;
        default:
          console.error(`metatable: ${attrName} is not a valid obsidian-metatable attribute`)
      }
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
      this.root.innerHTML = metatable(Object.entries(this.raw), this.expanded)
    }
  }

  toggleHandler(event: Event) {
    toggleHandler(this.root, event)
  }
}


function toggleHandler(root: HTMLElement, event: Event) {
  event.stopPropagation();
  const trigger: HTMLElement = event.target as HTMLElement

  if (trigger?.hasClass('toggle')) {
    const isExpanded = trigger.getAttribute('aria-expanded') == 'true'
    const targetId = trigger.getAttribute('aria-controls')
    const target = root.querySelector(`#${targetId}`) as HTMLElement

    if (isExpanded) {
      closeNode(trigger, target, '▶︎')
    } else {
      openNode(trigger, target, '▼')
    }
  }
}

function closeNode(trigger: HTMLElement, target: HTMLElement, symbol: string) {
  const content = target.firstElementChild
  const mark = target.lastElementChild

  content.setAttribute('aria-hidden', 'true')
  content.setAttribute('tabindex', '-1');

  mark.setAttribute('aria-hidden', 'false')

  // target.insertAdjacentHTML('beforeend', '<div class="collapsedMark">…</div>')

  trigger.setAttribute('aria-expanded', 'false');
  trigger.textContent = symbol
}

function openNode(trigger: HTMLElement, target: HTMLElement, symbol: string) {
  const content = target.firstElementChild
  const mark = target.lastElementChild

  content.setAttribute('aria-hidden', 'false')
  content.removeAttribute('tabindex');

  mark.setAttribute('aria-hidden', 'true')
  // target.querySelector('.collapsedMark').remove()

  trigger.setAttribute('aria-expanded', 'true');
  trigger.textContent = symbol
}

