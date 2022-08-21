import type { Value as TValue } from "../value"
import Value from "./Value";

interface MetatableProps {
  data: TValue;
}

/**
 * The root of any metatable widget.
 */
export function Metatable(props: MetatableProps) {
  return (
    <Value key="metatableroot" depth={0} value={props.data} />
  )
}
