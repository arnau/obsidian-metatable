import { Match, Show, Switch } from "solid-js"
import { ValueError, Value } from "src/value"
import { parseFrontmatter } from "src/frontmatter"
import { useMixture } from "src/mixture"
import { ParseError } from "./ParseError"
import { Metatable } from "./Metatable"

// @ts-ignore
import styles from "../metatable.css"

interface InlineProps {
  data: string | null | undefined,
}

export function Inline(props: InlineProps) {
  let { settings, isOpen, cleanData } = useMixture()
  let metadata: Value | ValueError | undefined

  try {
    metadata = cleanData(parseFrontmatter(props.data))
  } catch (err) {
    metadata = err as ValueError
  }

  return (
    <>
      <Show when={!settings.naked}>
        <style>{styles}</style>
      </Show>
      <Switch>
        <Match when={metadata instanceof Error}>
          <ParseError message={() => (metadata as ValueError)!.message!} />
        </Match>
        <Match when={metadata !== undefined}>
          <details open={isOpen(0)} class="metatable root" part="root">
            <summary part="summary">Metatable</summary>
            <Metatable data={metadata as Value} />
          </details>
        </Match>
      </Switch>
    </>
  )
}
