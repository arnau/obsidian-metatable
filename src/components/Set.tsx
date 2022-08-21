import { For } from "solid-js"
import { SetValue } from "../value"
import Member from "./Member"

interface SetProps {
  key: string,
  depth: number,
  value: SetValue,
}

export function Set(props: SetProps) {
  const name = `set-${props.key}`

  return (
    <table class={`set ${name}`} part={`set ${name}`}>
      <For each={Object.entries(props.value)}>
        {([key, value], index) =>
          <Member id={`${key}-${index()}`} depth={props.depth} key={key} value={value} />}
      </For>
    </table>
  )
}
