import { createSignal, Match, onCleanup, onMount, Show, Switch } from "solid-js"
import { debounce, EventRef, MarkdownView } from "obsidian"

import { Metatable } from "./Metatable"
import { ParseError } from "./ParseError"
import { createState } from "src/state"
import { useMixture } from "src/mixture"

// @ts-ignore
import styles from "../metatable.css"


export default function Sidebar() {
  const { workspace, settings, isNaked } = useMixture()

  let root: any
  let listeners: EventRef[] = []

  const [state, setState] = createState(settings)
  const [isTight, setIsTight] = createSignal(false)

  const rootClasses = ["metatable-sidebar", "root"]
  const rootClass = () => {
    const classes = isTight() ? ["tight", ...rootClasses] : rootClasses

    return classes.join(" ")
  }

  const fetchData = () => {
    const view = workspace.getActiveViewOfType(MarkdownView)

    if (view instanceof MarkdownView) {
      const name = view.getDisplayText()
      const content = view.getViewData()

      setState({ name, content })
    } else {
      const leaves = workspace.getLeavesOfType("markdown")

      if (leaves.length == 0) {
        setState(null)
      }
    }
  }

  onMount(() => {
    fetchData()

    listeners = [
      workspace.on('active-leaf-change', () => fetchData()),
      workspace.on('editor-change', debounce(() => fetchData(), 180, true)),
      workspace.on('resize', () => {
        setIsTight(root.clientWidth < 260)
      }),
    ]
  })

  onCleanup(() => {
    listeners.forEach(listener => workspace.offref(listener))
  })

  return (
    <>
      <Show when={!isNaked}>
        <style>{styles}</style>
      </Show>
      <section ref={root} class={rootClass()} part="root">
        <Show when={state().name !== undefined} fallback={<p class="pane-empty">No markdown files active.</p>}>
          <h1 part="summary">Metadata for “{state().name}”</h1>
          <Switch fallback={<p>(empty)</p>}>
            <Match when={state().error !== undefined}>
              <ParseError message={() => state().error!.message} />
            </Match>
            <Match when={state().metadata !== undefined}>
              <Metatable data={state().metadata!} />
            </Match>
          </Switch>
        </Show>
      </section>
    </>
  )
}
