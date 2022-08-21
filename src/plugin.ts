import { Plugin, Notice } from "obsidian"
import { SidebarView, SidebarViewType } from "./sidebarView"
import { Context, createInline } from "./inliner"
import { DEFAULT_SETTINGS, MetatableSettingTab } from "./settings"
import type { Settings } from "./settings"
import { queryTheme } from "./core"


export default class MetatablePlugin extends Plugin {
  settings: Settings
  private sidebarView: SidebarView

  async onload() {
    const iconName = "bracket-glyph"
    // TODO: Add icon
    // addIcon("circle", `<circle cx="50" cy="50" r="50" fill="currentColor" />`);

    await this.loadSettings();

    this.settings.theme = queryTheme()


    this.registerMarkdownPostProcessor(frontmatterProcessor.bind(this))
    this.addSettingTab(new MetatableSettingTab(this.app, this));

    this.registerView(
      SidebarViewType,
      (leaf) =>
        (this.sidebarView = new SidebarView(leaf, this.settings, iconName)),
    )

    this.addRibbonIcon(iconName, "Metatable", () => this.toggleSidebar())

    this.addCommand({
      id: "toggle-metatable-sidebar",
      name: "Toggle Metatable sidebar",
      callback: () => this.toggleSidebar()
    })
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(SidebarViewType)
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  private readonly toggleSidebar = async (): Promise<void> => {
    const { workspace } = this.app
    const existing = workspace.getLeavesOfType(SidebarViewType)

    if (existing.length > 0) {
      workspace.detachLeavesOfType(SidebarViewType)
    } else {
      await workspace.getRightLeaf(false).setViewState({
        type: SidebarViewType,
        active: true,
      })

      workspace.revealLeaf(workspace.getLeavesOfType(SidebarViewType)[0])
    }

  }
}


async function frontmatterProcessor(this: MetatablePlugin, el: HTMLElement): Promise<void> {
  const plugin = this
  const frontmatter = el.querySelector('.frontmatter')

  if (frontmatter !== null) {
    const embed = el.querySelector('.internal-embed') as HTMLElement

    // If an embed has already been loaded, writing after the embed expression
    // triggers a re-render for the embedded markdown wrongly injecting the
    // parent metatable for every keystroke.
    //
    // See https://github.com/arnau/obsidian-metatable/issues/12
    if (embed !== null) {
      return
    }

    const target = el.querySelector('.frontmatter-container') as HTMLElement
    target.style.display = 'none'

    const raw = frontmatter.querySelector("code")?.textContent

    const context: Context = {
      app: plugin.app,
      settings: plugin.settings,
    }
    // TODO: clean up inliners
    const _dispose = createInline(target.parentNode as HTMLElement, raw, context)
  }
}


