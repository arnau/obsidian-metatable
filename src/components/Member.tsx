import { createSignal, Show, Switch, Match, ErrorBoundary } from "solid-js"
import { useMixture } from "src/mixture"
import { Value as TValue, isSet, isEmptyValue, isLeaf } from "../value"
import Value from "./Value"


interface MemberProps {
  id: string,
  depth: number,
  key: string,
  value: TValue,
}

export default function Member(props: MemberProps) {
  const { cleanData, isOpen, settings } = useMixture()
  const data = () => isSet(props.value)
    ? cleanData(props.value) ?? {}
    : props.value
  const depth = () => props.depth + 1

  return (
    <ErrorBoundary fallback={(error) => <p class="parse-error">Error: {error}</p>}>
      <Show when={!(isEmptyValue(data()) && settings.ignoreNulls)}>
        <tr class="member" part="member">
          <Switch>
            <Match when={!isLeaf(props.value)}>
              <Key target={props.id} expanded={isOpen(depth())}>{props.key}</Key>
              <td class="value" part="value" id={props.id}>
                <Value key={props.key} depth={depth()} value={data()} />
                <Marker />
              </td>
            </Match>
            <Match when={isLeaf(props.value)}>
              <th class="key" part="key" title={props.key}>{props.key}</th>
              <td class="value" part="value" id={props.id}>
                <Value key={props.key} depth={props.depth} value={data()} />
              </td>
            </Match>
          </Switch>
        </tr>
      </Show>
    </ErrorBoundary>
  )
}


function Key(props: any) {
  const [isExpanded, setIsExpanded] = createSignal(props.expanded)
  const togglePart = () => isExpanded() ? "expanded" : "collapsed"
  const handler = (event: Event) => {
    event.stopPropagation()
    event.preventDefault()

    setIsExpanded(!isExpanded())
  }
  const clickHandler = (event: Event) => handler(event)
  const keyHandler = (event: KeyboardEvent) => {
    if (event.code == "Space" || event.code == "Enter") {
      handler(event)
    }
  }

  return (
    <th
      class="key toggle"
      part={`key toggle ${togglePart()}`}
      role="button"
      onClick={clickHandler}
      onkeydown={keyHandler}
      aria-expanded={isExpanded()}
      aria-controls={props.target}
      tabindex="0"
      title={props.children}
    ><span>{props.children}</span></th>
  )
}

function Marker() {
  return (
    <div
      class="marker"
      part="marker"
    ></div>
  )
}
