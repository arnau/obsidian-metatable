import { MarkdownPostProcessorContext, Plugin, fuzzySearch, prepareQuery } from 'obsidian'
import { DEFAULT_SETTINGS, MetatableSettings, MetatableSettingTab } from './settings'
import { Context, FilterMode } from './core'
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
  const fragment = new DocumentFragment()

  wrapper.classList.add('obsidian-metatable')

  if (!context.settings.naked) {
    wrapper.attachShadow({ mode: 'open' })
    fragment.createEl('style', { text: styles })
  }

  fragment.append(metatable(data, context))

  if (context.settings.naked) {
    wrapper.append(fragment)
  } else {
    wrapper.shadowRoot.append(fragment)
  }

}

function isEmpty(data: object): boolean {
  return Object.entries(data)
    .every(([_, value]) => value == null || isEmptyArray(value))
}

function filterSet(data: object, filterKeys: string[], filterMode: FilterMode): object {
  const filterFn = filterMode == 'ignore'
  ? (x => !x)
  : (x => x)
  const newData = Object.entries(data)
    .filter(([key, _value]) => filterFn(filterKeys.some(x => x == key)))

  return Object.fromEntries(newData)
}

async function frontmatterProcessor(this: MetatablePlugin, el: HTMLElement, ctx: MarkdownPostProcessorContext): Promise<void> {
  const plugin = this
  const frontmatter = await el.querySelector('.frontmatter')

  if (frontmatter !== null) {
    const embed = await el.querySelector('.internal-embed') as HTMLElement

    // If an embed has already been loaded, writing after the embed expression
    // triggers a re-render for the embedded markdown wrongly injecting the
    // parent metatable for every keystroke.
    //
    // See https://github.com/arnau/obsidian-metatable/issues/12
    if (embed !== null) {
      return
    }

    const target = await el.querySelector('.frontmatter-container') as HTMLElement
    target.removeAttribute('class')
    // Prevents an undesired `display: none` if `tags` is not present.
    target.removeAttribute('style')
    target.empty()

    // @ts-ignore
    const searchFn = plugin.app.internalPlugins.getPluginById('global-search').instance.openGlobalSearch.bind(plugin)
    const openLinkFn = plugin.app.workspace.openLinkText.bind(plugin.app.workspace)
    const { ignoreNulls, filterMode, filterKeys, skipKey } = plugin.settings
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
        filterKeys,
        filterMode,
        autolinks: plugin.settings.autolinks,
        naked: plugin.settings.naked,
      },
      depth: 0,
    }

    if (ctx.frontmatter) {
      const data = filterSet(ctx.frontmatter, filterKeys, filterMode)

      if (ctx.frontmatter[skipKey]) { return }
      // Nothing to render if all top-level are null and nulls should be
      // ignored.
      if (ignoreNulls && isEmpty(data)) { return }
      if (Object.isEmpty(data)) { return }

      createMetatable(target, data, context)
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
