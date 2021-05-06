import {
  App,
  Plugin,
  PluginSettingTab,
  Setting,
} from 'obsidian'
import MetatablePlugin from './plugin'


export interface MetatableSettings {
  // The level of expansion of the metatable tree
  expansionMode: string,
  // The value to display for null values
  nullValue: string,
  // The function to use to search. Used right now to mimic the default
  // behaviour when clicking a tag link.
  searchFn: (query: string) => void,
  // The key to look for to not render the metatable.
  skipKey: string,
  ignoredKeys: string[],
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

    new Setting(containerEl)
      .setName('Skip key')
      .setDesc('When this key is found and `true`, the metatable will not be displayed')
      .addText(text => text
               .setValue(plugin.settings.skipKey)
               .onChange(async (value) => {
                 plugin.settings.skipKey = value
                 await plugin.saveSettings()
               }))

    new Setting(containerEl)
      .setName('Ignored keys')
      .setDesc('Any key found in this comma-separated list will be ignored whilst displaying the metatable')
      .addText(text => text
               .setValue(plugin.settings.ignoredKeys.join(', '))
               .onChange(async (value) => {
                 plugin.settings.ignoredKeys = value.split(',').map(v => v.trim())
                 await plugin.saveSettings()
               }))


  }
}
