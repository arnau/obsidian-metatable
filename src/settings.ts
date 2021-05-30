import {
  App,
  Plugin,
  PluginSettingTab,
  Setting,
  Vault,
} from 'obsidian'
import MetatablePlugin from './plugin'
import { Mode, FilterMode } from './core'


export interface MetatableSettings {
  // The level of expansion of the metatable tree
  expansionMode: Mode;
  // Whether to ignore null values
  ignoreNulls: boolean;
  // The value to display for null values
  nullValue: string;
  // The key to look for to not render the metatable.
  skipKey: string;
  // XXX: Deprecated
  ignoredKeys: string[];
  filterKeys: string[];
  filterMode: FilterMode;
  autolinks: boolean;
  // A reference to the current vault.
  vault: Vault;
}

export const DEFAULT_SETTINGS: MetatableSettings = {
  expansionMode: 'expanded',
  ignoreNulls: false,
  nullValue: '',
  skipKey: 'metatable',
  ignoredKeys: [],
  filterKeys: ['metatable', 'frontmatter'],
  filterMode: 'ignore',
  autolinks: false,
  vault: null,
}



export class MetatableSettingTab extends PluginSettingTab {
  plugin: MetatablePlugin;

  constructor(app: App, plugin: MetatablePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  async display(): Promise<void> {
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
                     plugin.settings.expansionMode = value as Mode
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

    containerEl.createEl('h3', {text: 'Nulls'})

    new Setting(containerEl)
      .setName('Ignore null values')
      .setDesc('Ignore any member with a null value.')
      .addToggle(setting => setting
               .setValue(plugin.settings.ignoreNulls)
               .onChange(async (value) => {
                 plugin.settings.ignoreNulls = value
                 await plugin.saveSettings()
                 this.display()
               }))

    if (!plugin.settings.ignoreNulls) {
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


    containerEl.createEl('h3', {text: 'Filter'})

    new Setting(containerEl)
      .setName('Filter mode')
      .setDesc('Either ignore or keep the filter keys')
      .addDropdown(drop => drop
                   .addOption('ignore', 'Ignore')
                   .addOption('keep', 'Keep')
                   .setValue(plugin.settings.filterMode)
                   .onChange(async (value) => {
                     plugin.settings.filterMode = value as FilterMode
                     await plugin.saveSettings()
                   }))

    // XXX: Remove in 0.11.0
    if (plugin.settings.ignoredKeys.length > 0) {
      plugin.settings.filterKeys = plugin.settings.ignoredKeys
      await plugin.saveSettings()
    }

    new Setting(containerEl)
      .setName('Filter keys')
      .setDesc('Any key found in this comma-separated list will be either ignored or kept according to the filter mode')
      .addText(text => text
               .setValue(plugin.settings.filterKeys.join(', '))
               .onChange(async (value) => {
                 plugin.settings.filterKeys = value.split(',').map(v => v.trim())
                 await plugin.saveSettings()
               }))

    containerEl.createEl('h3', {text: 'Experimental'})

    new Setting(containerEl)
      .setName('Autolink')
      .setDesc('Enables autolinks for wikilinks `[[target]]`, frontmatter links `%target%` and local links `./deep/target`')
      .addToggle(setting => setting
                 .setValue(plugin.settings.autolinks)
                 .onChange(async (value) => {
                   plugin.settings.autolinks = value
                   await plugin.saveSettings()
                 }))
  }
}
