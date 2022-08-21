import { App, PluginSettingTab, Setting } from "obsidian"
import MetatablePlugin from "./plugin"

export type Theme = "light" | "dark"

export type Mode = 'expanded' | 'leaf-collapsed' | 'all-collapsed' | 'root-collapsed'

export function isOpen(depth: number, mode: Mode): boolean {
  if (mode == "expanded") {
    return true
  }

  // Keep the root open when leafs are collapsed
  if (mode == "leaf-collapsed" && depth == 0) {
    return true
  }

  // Keep the root close when leafs are opened
  if (mode == "root-collapsed" && depth != 0) {
    return true
  }

  // all-collapsed
  return false
}

export type FilterMode = "keep" | "ignore"

export interface Settings {
  // The level of expansion of the metatable tree
  expansionMode: Mode,
  // Whether to ignore null values
  ignoreNulls: boolean,
  // The value to display for null values
  nullValue: string,
  // The key to look for to not render the metatable.
  skipKey: string,
  filterKeys: string[],
  filterMode: FilterMode,
  autolinks: boolean,
  naked: boolean,
  theme: Theme,
}


export const DEFAULT_SETTINGS: Settings = {
  expansionMode: "expanded",
  ignoreNulls: false,
  nullValue: "",
  skipKey: "metatable",
  filterKeys: ["metatable", "frontmatter"],
  filterMode: "ignore",
  autolinks: false,
  naked: false,
  theme: "light",
}


export class MetatableSettingTab extends PluginSettingTab {
  plugin: MetatablePlugin;

  constructor(app: App, plugin: MetatablePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  async display(): Promise<void> {
    const { containerEl, plugin } = this

    containerEl.empty()

    containerEl.createEl('h2', { text: 'Metatable Settings' })

    new Setting(containerEl)
      .setName('Expansion level')
      .setDesc('Level of expansion of the metatable tree')
      .addDropdown(drop => drop
        .addOption('expanded', 'Fully expanded')
        .addOption('leaf-collapsed', 'Collapse leafs')
        .addOption('all-collapsed', 'Collapse all')
        .addOption('root-collapsed', 'Collapse root')
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

    containerEl.createEl('h3', { text: 'Nulls' })

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


    containerEl.createEl('h3', { text: 'Filter' })

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

    new Setting(containerEl)
      .setName('Filter keys')
      .setDesc('Any empty field will be ignored.')

    let keyset = plugin.settings.filterKeys

    let filterKeys = containerEl.createEl('ol')

    for (const [idx, originalValue] of [...keyset].entries()) {
      if (originalValue === '') { continue }
      addFilterInput(originalValue, filterKeys, keyset, plugin, idx)
    }

    new Setting(containerEl)
      .addButton(x => x
        .setButtonText("Add key")
        .onClick(async () => {
          addFilterInput('', filterKeys, keyset, plugin, keyset.length)
        }))


    containerEl.createEl('h3', { text: 'Experimental' })

    new Setting(containerEl)
      .setName('Autolink')
      .setDesc('Enables autolinks for wikilinks `[[target]]`, frontmatter links `%target%` and local links `./deep/target`')
      .addToggle(setting => setting
        .setValue(plugin.settings.autolinks)
        .onChange(async (value) => {
          plugin.settings.autolinks = value
          await plugin.saveSettings()
        }))

    new Setting(containerEl)
      .setName('Naked')
      .setDesc('Removes the Shadow DOM and the default CSS so you can bring your own via CSS snippets.')
      .addToggle(setting => setting
        .setValue(plugin.settings.naked)
        .onChange(async (value) => {
          plugin.settings.naked = value
          await plugin.saveSettings()
        }))
  }
}

function addFilterInput(originalValue: string, el: HTMLElement, keyset: Array<string>, plugin: MetatablePlugin, idx: number) {
  const item = el.createEl('li')
  const input = item.createEl('input')

  item.setAttribute('id', `filter-${idx}`)
  input.setAttribute('type', 'text')
  input.setAttribute('value', originalValue)
  input.setAttribute('data-prev', originalValue)

  input.addEventListener('input', async (e) => {
    let target = e.target as HTMLInputElement

    keyset[idx] = target.value

    input.setAttribute('data-prev', target.value)

    plugin.settings.filterKeys = keyset

    await plugin.saveSettings()
  })
}
