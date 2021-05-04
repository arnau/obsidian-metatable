import {
  App,
  Plugin,
  PluginSettingTab,
  Setting,
} from 'obsidian'
import MetatablePlugin from './plugin'


export interface MetatableSettings {
  expansionMode: string,
  nullValue: string,
  searchFn: (query: string) => void,
}

export class MetatableSettingTab extends PluginSettingTab {
  plugin: MetatablePlugin;

  constructor(app: App, plugin: MetatablePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const {containerEl, plugin} = this

    containerEl.empty()

    containerEl.createEl('h2', {text: 'Metatable Settings'})

    new Setting(containerEl)
      .setName('Expansion level')
      .setDesc('Level of expansion of the metatable tree')
      .addDropdown(drop => drop
                   .addOption('expanded', 'Fully expanded')
                   .addOption('leaf-collapsed', 'Collapse leafs')
                   .addOption('all-collapsed', 'Collapse all')
                   .setValue(plugin.settings.expansionMode)
                   .onChange(async (value) => {
                     plugin.settings.expansionMode = value
                     await plugin.saveSettings()
                   }))

    new Setting(containerEl)
      .setName('Null value')
      .setDesc('Text to show when a key has no value. Defaults to nothing')
      .addText(text => text
               .setValue(plugin.settings.nullValue)
               .onChange(async (value) => {
                 plugin.settings.nullValue = value
                 await plugin.saveSettings()
               }))

  }
}
