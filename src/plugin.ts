import { MarkdownPostProcessorContext, Plugin, fuzzySearch, prepareQuery } from 'obsidian'
import { DEFAULT_SETTINGS, MetatableSettings, MetatableSettingTab } from './settings'
import { Context } from './core'
import { RuleStore } from './rule'
import metatable from './table'
import { isEmptyArray } from './utils'
import { taglist } from './mappers'
// @ts-ignore
import styles from './metatable.css'

function log(msg: string) {
  console.log(`metatable: ${msg}`)
}

function createMetatable(el: HTMLElement, data: object, context: Context) {
  const wrapper = el.createEl('div')
  wrapper.classList.add('obsidian-metatable')
  wrapper.attachShadow({ mode: 'open' })

  const fragment = new DocumentFragment()
  fragment.createEl('style', { text: styles })
  fragment.append(metatable(data, context))
  wrapper.shadowRoot.append(fragment)
}

function isEmpty(data: object, ignoredKeys: string[]): boolean {
  return Object.entries(data)
    .filter(([key, value]) => !(ignoredKeys.some(x => x == key)))
    .every(([_, value]) => value == null || isEmptyArray(value))
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
    const openLinkFn = plugin.app.workspace.openLinkText.bind(plugin.app.workspace)
    const { ignoreNulls, ignoredKeys, skipKey } = plugin.settings
    const rules = new RuleStore()
    rules.set('tags', {
      toHtml: taglist,
      foldable: false,
    })

    const context: Context = {
      vaultName: plugin.app.vault.getName(),
      rules,
      searchFn,
      openLinkFn,
      settings: {
        mode: plugin.settings.expansionMode,
        ignoreNulls,
        nullValue: plugin.settings.nullValue,
        ignoredKeys,
        autolinks: plugin.settings.autolinks,
      },
      depth: 0,
    }

    if (ctx.frontmatter) {
      if (ctx.frontmatter[skipKey]) { return }
      // Nothing to render if all top-level are null and nulls should be
      // ignored.
      if (ignoreNulls && isEmpty(ctx.frontmatter, ignoredKeys)) { return }

      createMetatable(target, ctx.frontmatter, context)
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
