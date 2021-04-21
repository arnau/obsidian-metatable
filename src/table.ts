/**
 * Composes a link for tags as defined by Obsidian's default metadata block.
 */
function tag(value: string): HTMLElement {
  const a = document.createElement('a')
  a.addClass('tag')
  a.setAttribute('target', '_blank')
  a.setAttribute('rel', 'noopener')
  a.setAttribute('href', `#${value}`)
  a.append(`${value}`)

  return a
}

function taglist(data: any): DocumentFragment {
  const fragment = new DocumentFragment()

  data.forEach((item: string) => {
    fragment.append(tag(item))
  })

  return fragment
}

function mark(hideLeaf: boolean): HTMLElement {
  const mark = document.createElement('div')
  mark.setAttribute('aria-hidden', String(!hideLeaf))
  mark.addClass('collapsedMark')
  mark.append('…')

  return mark
}

function list(data: any, hideLeaf: boolean): DocumentFragment {
  const fragment = new DocumentFragment()
  const ul = document.createElement('ul')
  const ulmark = mark(hideLeaf)

  ul.setAttribute('aria-hidden', String(hideLeaf))

  data.forEach((item: any) => {
    const li = document.createElement('li')
    li.append(metanode(item, hideLeaf))

    ul.append(li)
  })

  fragment.append(ul)
  fragment.append(ulmark)

  return fragment
}


/**
 * Dispatches the transformation to HTML for each type of data value.
 */
function metanode(data: any, hideLeaf: boolean, label?: string): DocumentFragment | HTMLElement | string {
  let value

  if (Array.isArray(data)) {
    value = label == 'tags' ? taglist(data) : list(data, hideLeaf)

  } else if (typeof data == 'object') {
    value = table(Object.entries(data), hideLeaf)

  } else {
    value = data

  }

  return value
}

function isLeaf(data: any): boolean {
  return typeof data != 'object'
}

function isExpanded(value: string): boolean {
  return value == 'expanded'
}

/**
 * Composes a table row.
 */
function metarow(pair: [string, unknown], hideLeaf: boolean): HTMLElement {
  const label = pair[0]
  const data = pair[1]
  const value = metanode(data, hideLeaf, label)
  const toggle = isLeaf(data) || label == 'tags'
    ? ``
    : button(label, !hideLeaf)

  const tr = document.createElement('tr')
  const th = document.createElement('th')
  const td = document.createElement('td')

  th.append(toggle)
  th.append(label)
  td.setAttribute('id', `${label}-value`)
  td.append(value)
  tr.append(th)
  tr.append(td)

  return tr
}

function button(label: string, expanded: boolean): HTMLElement {
  const symbol = expanded ? '▼' : '▶︎'
  const button = document.createElement('button')

  button.addClass('toggle')
  button.setAttribute('id', label)
  button.setAttribute('aria-label', `Toggle ${label}`)
  button.setAttribute('aria-expanded', String(expanded))
  button.setAttribute('aria-controls', `${label}-value`)
  button.append(symbol)

  return button
}

function table(data: [string, unknown][], hideLeaf?: boolean): DocumentFragment {
  const fragment = new DocumentFragment()
  const table = document.createElement('table')

  data.forEach(item => {
    table.append(metarow(item, hideLeaf))
  })

  fragment.append(table)

  if (hideLeaf !== undefined) {
    const tmark = mark(hideLeaf)
    fragment.append(tmark)
  }

  return fragment
}

function closeNode(trigger: HTMLElement, target: HTMLElement, symbol: string) {
  const content = target.firstElementChild
  const mark = target.lastElementChild

  content.setAttribute('aria-hidden', 'true')
  content.setAttribute('tabindex', '-1');

  mark.setAttribute('aria-hidden', 'false')

  trigger.setAttribute('aria-expanded', 'false');
  trigger.textContent = symbol
}

function openNode(trigger: HTMLElement, target: HTMLElement, symbol: string) {
  const content = target.firstElementChild
  const mark = target.lastElementChild

  content.setAttribute('aria-hidden', 'false')
  content.removeAttribute('tabindex');

  mark.setAttribute('aria-hidden', 'true')

  trigger.setAttribute('aria-expanded', 'true');
  trigger.textContent = symbol
}


function toggleHandler(root: HTMLElement, event: Event) {
  event.stopPropagation();
  const trigger: HTMLElement = event.target as HTMLElement

  if (trigger?.hasClass('toggle')) {
    const isExpanded = trigger.getAttribute('aria-expanded') == 'true'
    const targetId = trigger.getAttribute('aria-controls')
    const target = root.querySelector(`#${targetId}`) as HTMLElement

    if (isExpanded) {
      closeNode(trigger, target, '▶︎')
    } else {
      openNode(trigger, target, '▼')
    }
  }
}


/**
 * Composes a table.
 */
export default function metatable(data: [string, unknown][], expanded: string): DocumentFragment {
  const fragment = new DocumentFragment()
  const hideLeaf = !isExpanded(expanded)

  const details = document.createElement('details')
  if (expanded != 'all-collapsed') {
    details.setAttribute('open', '')
  }
  fragment.append(details)

  const summary = document.createElement('summary')
  summary.append('Metadata')

  const tableEl = table(data)

  details.append(summary)
  details.append(tableEl)

  details.addEventListener('click', (e) => toggleHandler(details, e))

  return fragment
}
