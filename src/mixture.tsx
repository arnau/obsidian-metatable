import { App, Workspace } from "obsidian"
import { Context, createContext, onCleanup, useContext } from "solid-js"

import type { MaybeValue } from "./value"
import type { Settings } from "./settings"
import { isOpen } from "./settings"
import { cleanData } from "./core"


export interface Mixture {
  app: App,
  workspace: Workspace,

  settings: Settings,
  isOpen(depth: number): boolean,
  isNaked: boolean,

  search(term: string): void,
  openTag(tag: string): void,
  openNote(note: string): void,

  cleanData(data: MaybeValue): MaybeValue,
}


export function useMixture() {
  return useContext<Mixture>(MixtureContext as Context<Mixture>);
}

export const MixtureContext = createContext();

export function MixtureProvider(props: any) {
  const app: App = props.app
  const settings: Settings = props.settings
  const workspace: Workspace = app.workspace
  const searchFn =
    app
      // @ts-ignore
      .internalPlugins.getPluginById('global-search')
      .instance
      .openGlobalSearch.bind(app.workspace)
  const openLinkFn = app.workspace.openLinkText.bind(app.workspace)
  // @ts-ignore
  // ws.protocolHandlers.get('search').bind(app.workspace)("foo")

  onCleanup(() => {
    props.themeObserver.disconnect()
  })

  const mixture: Mixture = {
    app,
    workspace,
    settings,

    search(term: string) {
      searchFn(term)
    },
    isOpen(depth: number): boolean {
      return isOpen(depth, settings.expansionMode)
    },
    isNaked: settings.naked,

    openTag(tag: string) {
      searchFn(`tag:${tag}`)
    },
    openNote(note: string) {
      openLinkFn(note, "")
    },

    cleanData: (data: MaybeValue) => cleanData(data, settings),
  }

  return (
    <MixtureContext.Provider value={mixture}>
      {props.children}
    </MixtureContext.Provider>
  );
}

