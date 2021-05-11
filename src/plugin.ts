import { MarkdownPostProcessorContext, Plugin, fuzzySearch, prepareQuery } from 'obsidian'
import { MetatableSettings, MetatableSettingTab } from './settings'
import metatable from './table'
// @ts-ignore
import styles from './metatable.css'

function log(msg: string) {
  console.log(`metatable: ${msg}`)
}

const DEFAULT_SETTINGS: MetatableSettings = {
  expansionMode: 'expanded',
  ignoreNulls: false,
  nullValue: '',
  searchFn: null,
  skipKey: 'metatable',
  ignoredKeys: ['metatable', 'frontmatter'],
  autolinks: false,
  vault: null,
}

function createMetatable(el: HTMLElement, data: object, settings: MetatableSettings) {
  const wrapper = el.createEl('div')
  const { expansionMode } = settings
  wrapper.addClass('obsidian-metatable')

  const template = document.createElement('template')
  template.setAttribute('id', 'metatable-tag')
  template.innerHTML = '<slot name="metatable-tag"><a href=""></a></slot>'
  wrapper.append(template)

  wrapper.attachShadow({ mode: 'open' })

  const fragment = new DocumentFragment()
  fragment.createEl('style', {text: styles})
  fragment.append(metatable(data, settings))
  wrapper.shadowRoot.append(fragment)
}

async function frontmatterProcessor(this: MetatablePlugin, el: HTMLElement, ctx: MarkdownPostProcessorContext): Promise<void> {
  const plugin = this
  const frontmatter = await el.querySelector('.frontmatter')

  if (frontmatter !== null) {
    const target = el.querySelector('.frontmatter-container') as HTMLElement
    target.removeAttribute('class')
    // Prevents an undesired `display: none` if `tags` is not present.
    target.removeAttribute('style')
    target.empty()
    // @ts-ignore
    const searchFn = plugin.app.internalPlugins.getPluginById('global-search').instance.openGlobalSearch.bind(plugin)
    const settings = { ...plugin.settings, searchFn, vault: this.app.vault }

    if (ctx.frontmatter) {
      createMetatable(target, ctx.frontmatter, settings)
    }
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
