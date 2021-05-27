import { getLinkpath } from 'obsidian'
import { taglist } from './mappers'
import { Rule, RuleStore } from './rule'
import { Leaf, Context, Settings } from './core'

import isEmptyArray from './utils'

function toggle(trigger: HTMLElement) {
  const isExpanded = trigger.getAttribute('aria-expanded') == 'true'
  trigger.setAttribute('aria-expanded', String(!isExpanded))
}

function clickHandler(event: Event, searchFn: (query: string) => void) {
  const trigger: HTMLElement = event.target as HTMLElement

  if (trigger?.hasAttribute('aria-expanded')) {
    event.stopPropagation();
    event.preventDefault();
    toggle(trigger)
    return;
  }

  if (trigger?.hasAttribute('href')) {
    event.stopPropagation();
    const href = trigger.getAttribute('href')

    if (trigger.hasClass('tag')) {
      event.preventDefault();
      searchFn(`tag:${href}`)
    }
  }
}

function keyHandler(event: KeyboardEvent) {
  const trigger: HTMLElement = event.target as HTMLElement

  if ((event.code == 'Space' || event.code == 'Enter') && trigger?.hasAttribute('aria-expanded')) {
    event.stopPropagation();
    event.preventDefault();
    toggle(trigger)
  }
}

function externalLink(value: string): HTMLElement {
  const a = document.createElement('a')
  a.classList.add('external-link')
  a.setAttribute('target', '_blank')
  a.setAttribute('rel', 'noopener')
  a.setAttribute('href', value)
  a.append(value)

  return a
}

function obsidianUrl(vaultName: string, fileName: string): string {
  return `obsidian://open?vault=${vaultName}&file=${encodeURI(getLinkpath(fileName))}`
}


function internalLink(url: URL): HTMLElement {
  const a = document.createElement('a')
  const value = url.toString()
  const label = url.searchParams.get('file')

  a.dataset.href = value
  a.setAttribute('href', value)
  a.classList.add('internal-link')
  a.setAttribute('target', '_blank')
  a.setAttribute('rel', 'noopener')
  a.append(label)

  return a
}

/**
/* Creates a link for internal links from a string of the form `[[text]]`.
 */
function wikiLink(value: string, vaultName: string): HTMLElement {
  const cleanValue = value.slice(2, -2)
  const url = new URL(obsidianUrl(vaultName, cleanValue))

  return internalLink(url)
}

/**
/* Creates a link for internal links from a string of the form `%text%`.
 */
function frontmatterLink(value: string, vaultName: string): HTMLElement {
  const cleanValue = value.slice(1, -1)
  const url = new URL(obsidianUrl(vaultName, cleanValue))

  return internalLink(url)
}


/**
 * Creates a link for local paths.
 */
function localLink(value: string, vaultName: string): HTMLElement {
  const url = new URL(obsidianUrl(vaultName, value))

  return internalLink(url)
}

function isExpanded(value: string): boolean {
  return value == 'expanded'
}

function isOpen(mode: string, depth: number): boolean {
  if (mode == 'expanded') {
    return true
  }

  // Keep the root open when leafs are collapsed
  if (mode == 'leaf-collapsed' && depth == 0) {
    return true
  }

  // all-collapsed
  return false
}

function isObsidianUrl(url: URL | string): boolean {
  return (url instanceof URL && url.protocol == 'obsidian:')
}

function isUrl(url: URL | string): boolean {
  const allowedProtocols = ['http:', 'https:', 'evernote:']

  return (url instanceof URL && allowedProtocols.some(protocol => url.protocol == protocol))
}

function isLocalLink(value: string): boolean {
  return value.startsWith('./')
}

function tryUrl(value: string): URL | string {
  try {
    return new URL(value)
  } catch(_) {
    value
  }
}

function isWikiLink(value: string): boolean {
  return (value.startsWith('[[') && value.endsWith(']]'))
}

function isFrontmatterLink(value: string): boolean {
  return (value.startsWith('%') && value.endsWith('%'))
}

function enrichValue(value: Leaf, context: Context): string | HTMLElement {
  const { settings, vaultName } = context
  const { autolinks } = settings
  const cleanValue = value.toString().trim()

  if (autolinks) {
    if (isWikiLink(cleanValue)) {
      return wikiLink(cleanValue, vaultName)
    }

    if (isFrontmatterLink(cleanValue)) {
      return frontmatterLink(cleanValue, vaultName)
    }

    if (isLocalLink(cleanValue)) {
      return localLink(cleanValue, vaultName)
    }
  }

  const url = tryUrl(cleanValue)

  if (isObsidianUrl(url)) {
    return internalLink(url as URL)
  }

  if (isUrl(url)) {
    return externalLink(cleanValue)
  }

  return value.toString()
}

function isNully(value: unknown): boolean {
  if (typeof value == 'string') {
    return value.length == 0
  }

  return value == null
}


/**
 * A set member with a scalar value.
 */
function leafMember(label: string, data: string | null, context: Context): HTMLElement {
  const { rules, settings } = context
  const root = document.createElement('tr')
  const key = document.createElement('th')
  const value = document.createElement('td')
  const rule = rules.get(label)
  const datum = (rules.has(label) && !isNully(data))
    ? rule.toHtml(data, rule)
    : enrichValue(data, context)

  key.classList.add('key')
  key.append(label)
  value.classList.add('value')
  value.append(datum)

  root.classList.add('member')
  root.append(key)
  root.append(value)

  return root
}

/**
 * A set member with a complex value.
 */
function nodeMember(label: string, value: unknown, context: Context): HTMLElement {
  const root = details(label, value, { ...context, depth: context.depth + 1 })
  root.classList.add('member')

  return root
}

/**
 * A set member.
 */
function member(label: string, value: unknown, context: Context): HTMLElement {
  const { settings } = context
  const patchedValue = value == null ? settings.nullValue : value

  if (typeof patchedValue == 'object') {
    return nodeMember(label, value, context)
  }

  return leafMember(label, patchedValue as string, context)
}

/**
 * A set of members.
 */
function set(data: object, context: Context): HTMLElement {
  const { settings, depth } = context
  const { ignoredKeys, ignoreNulls } = settings
  const valueContext = { ...context, depth: depth + 1 }

  const root = document.createElement('table')
  root.classList.add('set')

  Object.entries(data).forEach(([label, value]: [string, unknown]) => {
    if (ignoreNulls && (value == null || isEmptyArray(value))) return;
    if (ignoredKeys.some(key => key == label)) return;

    root.append(member(label, value, valueContext))
  })

  return root
}


/**
 * A list of members.
 */
function list(data: unknown[], context: Context): HTMLElement {
  const { settings, depth } = context
  const valueContext = { ...context, depth: depth + 1 }

  const root = document.createElement('ul')

  data.forEach((item: unknown) => {
    let value
    const li = document.createElement('li')

    if (Array.isArray(item)) {
      value = list(item, valueContext)
    } else if (typeof item == 'object') {
      value = set(item , valueContext)
    } else {
      value = enrichValue(item as Leaf, valueContext)
    }

    li.append(value)

    root.append(li)
  })

  return root
}


function ordinaryValue(data: unknown, context: Context): HTMLElement {
  return Array.isArray(data)
    ? list(data, context)
    : set(data as object, context)
}

/**
 * A collapsible group.
 */
function details(label: string, data: any, context: Context): HTMLElement {
  const { settings, rules, depth } = context
  const { mode } = settings

  const root = document.createElement('tr')
  const key = document.createElement('th')
  const value = document.createElement('td')

  const rule = rules.get(label)
  const valueId = `${label}-${depth}`
  const datum = (rules.has(label) && !isNully(data))
    ? rule.toHtml(data, rule)
    : ordinaryValue(data, { ...context, depth: depth + 1 })

  key.classList.add('key')
  key.append(label)
  root.append(key)

  value.classList.add('value')
  value.setAttribute('id', valueId)
  value.append(datum)
  root.append(value)

  if (rule == undefined || rule.foldable) {
    const marker = document.createElement('div')

    key.classList.add('toggle')
    key.setAttribute('role', 'button')
    key.setAttribute('aria-expanded', String(isOpen(mode, depth)))
    key.setAttribute('aria-controls', valueId)
    key.setAttribute('tabindex', '0')

    marker.classList.add('marker')
    value.append(marker)
  }

  return root
}


function sheath(data: object, context: Context): HTMLElement {
  const { settings } = context
  const root = document.createElement('details')
  const summary = document.createElement('summary')
  const value = set(data, context)

  if (isOpen(settings.mode, 0)) {
    root.setAttribute('open', '')
  }

  summary.append('Metadata')
  root.classList.add('metatable')
  root.append(summary)
  root.append(value)

  return root
}

export default function metatable(data: object, context: Context): DocumentFragment {
  const { searchFn, settings } = context
  const fragment = new DocumentFragment()

  const root = sheath(data, context)
  root.addEventListener('click', (e) => clickHandler(e, searchFn))
  root.addEventListener('keydown', keyHandler)
  fragment.append(root)

  return fragment
}
