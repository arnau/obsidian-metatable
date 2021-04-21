import { MarkdownPostProcessorContext, Plugin } from 'obsidian'
import { MetatableSettings, MetatableSettingTab } from './settings'
import { log } from './utils'
import { Metatable } from './metatable'


const DEFAULT_SETTINGS: MetatableSettings = {
  debugMode: false,
  expansionMode: 'expanded',
}

async function frontmatterProcessor(this: MetatablePlugin, el: HTMLElement, ctx: MarkdownPostProcessorContext): Promise<void> {
  const plugin = this
  const frontmatter = await el.querySelector('.frontmatter')

  if (frontmatter !== null) {
    const { expansionMode, debugMode } = plugin.settings
    const target = el.querySelector('.frontmatter-container')
    target.removeClass('is-collapsed')

    const mtEl = document.createElement('obsidian-metatable')
    mtEl.setAttribute('id', ctx.docId)
    mtEl.setAttribute('expanded', expansionMode)
    mtEl.setAttribute('debug', debugMode)
    target.replaceChildren(mtEl)

    const mt = target.querySelector('obsidian-metatable') as Metatable
    mt.data = ctx.frontmatter
  }
}

export default class MetatablePlugin extends Plugin {
  settings: MetatableSettings;

  async onload() {
    await this.loadSettings();

    if (customElements.get('obsidian-metatable') === undefined) {
      customElements.define('obsidian-metatable', Metatable)
    }

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
