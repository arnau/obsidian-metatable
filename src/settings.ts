import {
  App,
  Plugin,
  PluginSettingTab,
  Setting,
} from 'obsidian'
import MetatablePlugin from './plugin'


export interface MetatableSettings {
  debugMode: boolean,
  expansionMode: string,
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
      .setName('Debug mode')
      .setDesc('Increase the logging output')
      .addToggle(toggle => toggle
                 .setValue(plugin.settings.debugMode)
                 .onChange(async (value) => {
                   plugin.settings.debugMode = value
                   await plugin.saveSettings()
                 }))
  }
}
