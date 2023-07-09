import { MarkdownView, getLinkpath } from "obsidian"
import { Match, Switch, createEffect, createSignal } from "solid-js"
import { useMixture } from "../mixture"

/**
 * Represents any form of internal link.
 */
export function InternalLink(props: any) {
  const value = props.value

  return (
    <Switch>
      <Match when={isWikiLink(value)}>
        <WikiLink value={value} />
      </Match>

      <Match when={isFrontmatterLink(value)}>
        <FrontmatterLink value={value} />
      </Match>

      <Match when={isLocalLink(value)}>
        <LocalLink value={value} />
      </Match>

      <Match when={isObsidianUrl(value)}>
        <ObsidianLink value={value} />
      </Match>
    </Switch>
  )
}

export function isInternalLink(value: string): boolean {
  return isWikiLink(value)
    || isFrontmatterLink(value)
    || isLocalLink(value)
    || isObsidianUrl(value)
}


/**
 * Represents a wiki link. It has the form `[[localId]]` or `[[localId|label]]`.
 */
function WikiLink(props: any) {
  let value = props.value.slice(2, -2)
  let url: string
  let label: string

  if (value.includes("|")) {
    const [urlValue, labelValue] = value.split("|")
    url = urlValue.trim()
    label = labelValue.trim()
  } else {
    label = value
    url = value
  }

  return (
    <Link label={label} url={url} />
  )
}

function isWikiLink(value: string): boolean {
  return (value.startsWith("[[") && value.endsWith("]]"))
}


/**
 * Represents a frontmatter link. It has the form `%localId%` or `%localId|label%`.
 */
function FrontmatterLink(props: any) {
  let value = props.value.slice(1, -1)
  let url: string
  let label: string

  if (value.includes("|")) {
    const [urlValue, labelValue] = value.split("|")
    url = urlValue.trim()
    label = labelValue.trim()
  } else {
    label = value
    url = value
  }

  return (
    <Link label={label} url={url} />
  )
}

function isFrontmatterLink(value: string): boolean {
  return (value.startsWith("%") && value.endsWith("%"))
}


/**
 * Reprents a local link of the form `./target/path`.
 */
function LocalLink(props: any) {
  return (
    <Link label={props.value} url={props.value} />
  )
}

function isLocalLink(value: string): boolean {
  return value.startsWith("./") || value.startsWith("../")
}


function ObsidianLink(props: any) {
  return (
    <Link label={props.value} url={props.value} />
  )
}

function isObsidianUrl(url: URL | string): boolean {
  return (url instanceof URL && url.protocol == "obsidian:")
}

function expandUrl(url: string, parent: string | null | undefined) {
  if (!url.startsWith(".") || !url.startsWith("..")) { return url }

  const parentTrail = parent?.split("/").filter(step => step.length > 0) ?? []

  const [relativeStep, ...trail] = url.split("/")

  if (relativeStep === "..") {
    parentTrail.pop()
  }

  return `/${parentTrail.concat(trail).join("/")}`
}

/**
 * Represents an internal link.
 */
export function Link(props: LinkProps) {
  const { workspace } = useMixture()
  const [parent, setParent] = createSignal<string | null>()
  const view = () => workspace.getActiveViewOfType(MarkdownView)
  createEffect(() => {
    setParent(view()?.file.parent?.path)
  })

  const { openNote } = useMixture()
  const label = () => props.label
  const url = () => decodeURIComponent(props.url)
  const localUrl = () => getLinkpath(url())
  const clickHandler = (event: any) => {
    event.preventDefault()
    const href = event.target.dataset.href!
    openNote(expandUrl(href, parent()))
  }

  return (
    <a
      href={localUrl()}
      data-href={localUrl()}
      onClick={clickHandler}
      class="leaf link internal-link"
      part="leaf link internal-link"
      target="_blank"
      rel="noopener"
    >{label()}</a>
  )
}

interface LinkProps {
  label: string;
  url: string;
}
