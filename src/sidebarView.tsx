import { ItemView, WorkspaceLeaf } from "obsidian"
import { render } from "solid-js/web"

import { MixtureProvider } from "./mixture"
import type { Settings } from "./settings"
import Sidebar from "./components/Sidebar"
import { observeTheme } from "./core"

export const SidebarViewType = "metatable-sidebar-view"


export class SidebarView extends ItemView {
  settings: Settings
  iconName: string
  listeners: any[]
  dispose: any

  constructor(leaf: WorkspaceLeaf, settings: Settings, iconName: string) {
    super(leaf)
    this.settings = settings
    this.iconName = iconName
  }

  getViewType(): string {
    return SidebarViewType
  }

  getDisplayText(): string {
    return "Metatable Sidebar";
  }

  getIcon(): string {
    return this.iconName
  }

  async onOpen() {
    const root = this.containerEl.children[1]
    const wrapper = root.createEl("div")
    let dock: HTMLElement | ShadowRoot

    wrapper.classList.add("obsidian-metatable-sidebar")
    wrapper.classList.add(this.settings.theme)

    const themeObserver = observeTheme(wrapper)


    if (this.settings.naked) {
      dock = wrapper
    } else {
      wrapper.attachShadow({ mode: "open" })

      dock = wrapper.shadowRoot!
    }

    this.dispose = render(() => (
      <MixtureProvider app={this.app} settings={this.settings} themeObserver={themeObserver}>
        <Sidebar />
      </MixtureProvider>

    ), dock)
  }

  async onClose() {
    this.dispose()
  }
}
