import { Match, Switch, createEffect } from "solid-js"
import type { LeafValue } from "../value"
import { useMixture } from "../mixture"
import { Tag } from "./Tag"
import { isInternalLink, InternalLink, Link as ILink } from "./InternalLink"
import { isExternalLink, ExternalLink, Link as ELink } from "./ExternalLink"


const ISODATE_RE = new RegExp(/^\d{4}-\d{2}-\d{2}$/)
const MD_LINK_RE = new RegExp(/^\[(?<label>[^\[\]]+)\]\((?<url>[^\(\)]+)\)$/)


export function Leaf(props: { key: string, value: LeafValue }) {
  const { settings } = useMixture()
  const key = props.key
  const value = props.value

  return (
    <Switch>
      <Match when={typeof value === "number"}>
        <span class="leaf number" part="leaf number">{value}</span>
      </Match>

      <Match when={typeof value === "boolean"}>
        <span class="leaf boolean" part="leaf boolean">{value!.toString()}</span>
      </Match>

      <Match when={key == "tags"}>
        <Tag value={value} />
      </Match>

      <Match when={value === settings.nullValue}>
        <span class="leaf nil" part="leaf nil">{value}</span>
      </Match>

      <Match when={ISODATE_RE.test((value as string).trim())}>
        <span class="leaf isodate" part="leaf isodate">{value}</span>
      </Match>

      <Match when={typeof value === "string"}>
        <String key={key} value={value} />
      </Match>

      <Match when={true}>
        <span class="leaf" part="leaf">{value}</span>
      </Match>
    </Switch>
  )
}

function String(props: any) {
  const { settings } = useMixture()
  const value = props.value

  return (
    <Switch>
      <Match when={settings.autolinks && isInternalLink(value)}>
        <InternalLink value={value} />
      </Match>

      <Match when={settings.autolinks && isExternalLink(value)}>
        <ExternalLink value={value} />
      </Match>

      <Match when={settings.autolinks && MD_LINK_RE.test(value.trim())}>
        <MarkdownLink value={value.trim()} />
      </Match>

      <Match when={true}>
        <span class="leaf string" part="leaf string">{value}</span>
      </Match>
    </Switch>
  )
}

function MarkdownLink(props: any) {
  const groups = () => props.value.match(MD_LINK_RE).groups

  return (
    <Switch>
      <Match when={isExternalLink(groups().url)}>
        <ELink label={groups().label} url={groups().url} />
      </Match>

      <Match when={true}>
        <ILink label={groups().label} url={groups().url} />
      </Match>
    </Switch>
  )
}
