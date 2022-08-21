import { App } from "obsidian"
import { render } from "solid-js/web"
import { Inline } from "./components/Inline"
import { observeTheme } from "./core"
import { MixtureProvider } from "./mixture"
import type { Settings } from "./settings"

export interface Context {
  app: App,
  settings: Settings,
}

export function createInline(root: HTMLElement, data: string | null | undefined, context: Context) {
  let dock: HTMLElement | ShadowRoot
  let { app, settings } = context
  const wrapper = root.createEl('div')
  wrapper.classList.add("obsidian-metatable")
  wrapper.classList.add(settings.theme)

  const observer = observeTheme(wrapper)

  if (settings.naked) {
    dock = wrapper
  } else {
    wrapper.attachShadow({ mode: "open" })

    dock = wrapper.shadowRoot!
  }

  const dispose = render(() => (
    <MixtureProvider app={app} settings={settings} themeObserver={observer}>
      <Inline data={data} />
    </MixtureProvider>
  ), dock)

  return dispose
}
