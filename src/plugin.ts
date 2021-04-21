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
    target.innerHTML = `<obsidian-metatable id=${ctx.docId} expanded=${expansionMode} debug=${debugMode} />`
    const mt = target.querySelector('obsidian-metatable') as Metatable
    mt.data = ctx.frontmatter
  }
}

export default class MetatablePlugin extends Plugin {
  settings: MetatableSettings;

  async onload() {
    await this.loadSettings();
    customElements.define('obsidian-metatable', Metatable)
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
