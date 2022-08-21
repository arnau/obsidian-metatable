import { createMemo, Match, Switch } from "solid-js"

import { useMixture } from "../mixture"
import { List } from "./List"
import { Set } from "./Set"
import { Leaf } from "./Leaf"
import type { Value as TValue, SetValue, ListValue, LeafValue } from "../value"
import { isEmptyValue, isLeaf } from "../value"

interface ValueProps {
  key: string,
  depth: number,
  value: TValue,
}

export default function Value(props: ValueProps) {
  const { settings } = useMixture()
  const patchedKey = createMemo(() => patchKey(props.key))
  const patchedValue = createMemo(() => patchValue(props.value, settings.nullValue))

  return (
    <Switch>
      <Match when={Array.isArray(patchedValue())}>
        <List key={patchedKey()} depth={props.depth} value={patchedValue() as ListValue} />
      </Match>
      <Match when={typeof patchedValue() == "object"}>
        <Set key={patchedKey()} depth={props.depth} value={patchedValue() as SetValue} />
      </Match>
      <Match when={isLeaf(patchedValue())}>
        <Leaf key={patchedKey()} value={patchedValue() as LeafValue} />
      </Match>
    </Switch>
  )
}


/**
 * Normalise keys into a canonical form that:
 *
 * - It can be used as an identifier (including class names).
 * - It can be matched regardles of casing.
 */
function patchKey(input: string): string {
  return input.toLocaleLowerCase().replace(' ', '-')
}

function patchValue(input: TValue, nullValue: string) {
  return isEmptyValue(input)
    ? nullValue
    : input
}
