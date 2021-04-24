// A map between known keys and their mapping function.
interface Keymap {
  [key: string]: string;
}

interface Mappers {
  [key: string]: (value: string) => HTMLElement;
}

interface Settings {
  mode: string; // expansionMode
  depth: number;
  mappers: Mappers;
  keymap: Keymap;
}

function toggle(trigger: HTMLElement) {
  const isExpanded = trigger.getAttribute('aria-expanded') == 'true'
  trigger.setAttribute('aria-expanded', String(!isExpanded))
}

function clickHandler(event: Event) {
  const trigger: HTMLElement = event.target as HTMLElement

  if (trigger?.hasAttribute('aria-expanded')) {
    event.stopPropagation();
    toggle(trigger)
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


function tag(value: string): HTMLElement {
  const a = document.createElement('a')
  a.addClass('tag')
  a.setAttribute('target', '_blank')
  a.setAttribute('rel', 'noopener')
  a.setAttribute('href', `#${value}`)
  a.append(`${value}`)

  return a
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


/**
 * A set member with a scalar value.
 */
function leafMember(label: string, data: string): HTMLElement {
  const root = document.createElement('div')
  const key = document.createElement('strong')
  const value = document.createElement('span')

  key.addClass('key')
  key.append(label)
  value.addClass('value')
  value.append(data)

  root.addClass('member')
  root.append(key)
  root.append(value)

  return root
}

/**
 * A set member with a complex value.
 */
function nodeMember(label: string, value: any, settings: Settings): HTMLElement {
  const root = details(label, value, { ...settings, depth: settings.depth + 1 })
  root.addClass('member')

  return root
}

/**
 * A set member.
 */
function member(label: string, value: any, settings: Settings): HTMLElement {
  if (typeof value == 'object') {
    return nodeMember(label, value, settings)
  }

  return leafMember(label, value)
}

/**
 * A set of members.
 */
function set(data: object, settings: Settings): HTMLElement {
  const root = document.createElement('div')
  const { depth } = settings
  const valueSettings = { ...settings, depth: depth + 1 }

  root.addClass('set')

  Object.entries(data).forEach(([label, value]: [string, unknown]) => {
    root.append(member(label, value, valueSettings))
  })

  return root
}

function mapWith(value: string, settings: Settings, labelledBy?: string): string | HTMLElement {
  const { mappers, keymap } = settings
  const ref = keymap[labelledBy]
  const fn = mappers[ref]

  if (fn === undefined) {
    return value
  }

  return fn(value)
}

/**
 * A list of members.
 */
function list(data: any[], settings: Settings, labelledBy?: string): HTMLElement {
  const root = document.createElement('ul')
  const { depth } = settings
  const valueSettings = { ...settings, depth: depth + 1 }

  // TODO: Generalise
  if (labelledBy == 'tags') {
    root.addClass('tag-list')
  }

  data.forEach((item: any) => {
    let value
    const li = document.createElement('li')

    if (Array.isArray(item)) {
      value = list(item, valueSettings)
    } else if (typeof item == 'object') {
      value = set(item , valueSettings)
    } else {
      value = mapWith(item, settings, labelledBy)
    }

    li.append(value)

    root.append(li)
  })

  return root
}

/**
 * A collapsible group.
 */
function details(label: string, data: any, settings: Settings): HTMLElement {
  const root = document.createElement('div')
  const key = document.createElement('strong')
  const marker = document.createElement('div')
  const { depth, mode } = settings
  const valueSettings = { ...settings, depth: depth + 1 }
  const valueId = `${label}-${depth}`
  let value

  key.addClass('key')
  key.addClass('toggle')
  key.setAttribute('role', 'button')
  key.setAttribute('aria-expanded', String(isOpen(mode, depth)))
  key.setAttribute('aria-controls', valueId)
  key.setAttribute('tabindex', '0')
  key.append(label)

  root.append(key)

  value = Array.isArray(data)
    ? list(data, valueSettings, label)
    : set(data, valueSettings)
  value.addClass('value')
  value.setAttribute('id', valueId)

  root.append(value)

  marker.addClass('marker')
  root.append(marker)

  return root
}

export default function metatable(data: object, mode: string): DocumentFragment {
  const fragment = new DocumentFragment()
  const settings = {
    mode,
    depth: 0,
    mappers: {
      autotag: tag,
    },
    keymap: {
      tags: 'autotag',
    }
  }
  const root = document.createElement('details')
  const summary = document.createElement('summary')
  const value = set(data, settings)

  if (isOpen(mode, 0)) {
    root.setAttribute('open', '')
  }

  summary.append('Metadata')
  root.addClass('metatable')
  root.append(summary)
  root.append(value)
  root.addEventListener('click', clickHandler)
  root.addEventListener('keydown', keyHandler)
  fragment.append(root)

  return fragment
}
