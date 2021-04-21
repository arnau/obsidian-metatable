import { MarkdownPostProcessorContext, Plugin } from 'obsidian'
import { MetatableSettings, MetatableSettingTab } from './settings'
import metatable from './table'
// @ts-ignore
import styles from './metatable.css'

function log(msg: string) {
  console.log(`metatable: ${msg}`)
}

const DEFAULT_SETTINGS: MetatableSettings = {
  debugMode: false,
  expansionMode: 'expanded',
}

function createMetatable(el: HTMLElement, data: object, settings: MetatableSettings) {
  const wrapper = el.createEl('div')
  const { expansionMode } = settings
  wrapper.addClass('obsidian-metatable')
  wrapper.attachShadow({ mode: 'open' })

  const fragment = new DocumentFragment()
  fragment.createEl('style', {text: styles})
  fragment.append(metatable(Object.entries(data), expansionMode))
  wrapper.shadowRoot.append(fragment)
}

async function frontmatterProcessor(this: MetatablePlugin, el: HTMLElement, ctx: MarkdownPostProcessorContext): Promise<void> {
  const plugin = this
  const frontmatter = await el.querySelector('.frontmatter')

  if (frontmatter !== null) {
    const target = el.querySelector('.frontmatter-container') as HTMLElement
    target.removeClass('is-collapsed')
    target.empty()

    createMetatable(target, ctx.frontmatter, plugin.settings)
  }
}

export default class MetatablePlugin extends Plugin {
  settings: MetatableSettings;

  async onload() {
    await this.loadSettings();

    this.registerMarkdownPostProcessor(frontmatterProcessor.bind(this))
    this.addSettingTab(new MetatableSettingTab(this.app, this));

    log('loaded')
  }

  onunload() {
    log('unloaded')
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
