import { For, Show } from "solid-js"

import type { ListValue } from "../value"
import Value from "./Value"


export function List(props: { key: string, depth: number, value: ListValue }) {
  const name = `list-${props.key}`

  return (
    <Show when={props.value.length > 0}>
      <ul class={`list ${name}`} part={`list ${name}`}>
        <For each={props.value}>
          {(item, index) => (
            <li id={`${props.key}-${index()}`} part={`list-item list-item-${props.key}`}>
              {<Value key={props.key} depth={props.depth} value={item} />}
            </li>
          )}
        </For>
      </ul>
    </Show>
  )
}
