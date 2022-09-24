import type { FilterMode, Settings, Theme } from "./settings"
import type { MaybeValue } from "./value"
import { isEmptyValue } from "./value"

/**
  * Sets an observer to watch for changes in the body class list.
  *
  * It serves as a way to react to Obsidian theme settings.
  */
export function observeTheme(el: HTMLElement): MutationObserver {
  const observer = new MutationObserver((mutationList) => {
    mutationList.forEach((mutation) => {
      const target = (mutation.target as HTMLElement)

      if (target.hasClass("theme-light")) {
        el.classList.add("light")
        el.classList.remove("dark")
      } else {
        el.classList.add("dark")
        el.classList.remove("light")
      }
    })
  })
  const body = document.querySelector("body")!
  observer.observe(body, { attributes: true, attributeFilter: ["class"] })

  return observer
}

/** XXX: By capturing the external theme we avoid using `:host-context()` in CSS which is likely to be deprecated.
  *
  * See also[mixture.tsx] for the observer logic.
*/
export function queryTheme(): Theme {
  const body = document.querySelector("body")!

  return body.hasClass("theme-light")
    ? "light"
    : "dark"
}


/**
  * Takes a value and wrangles through ensuring is clean and ready.
  */
export function cleanData(data: MaybeValue, settings: Settings): MaybeValue {
  if (data === undefined || data === null) { return }
  if (typeof data == "string") { return }
  if (data[settings.skipKey] === true) { return }

  let entries = Object.entries(data)

  entries = filterKeys(entries, settings.filterKeys, settings.filterMode)

  if (settings.ignoreNulls) {
    entries = filterNulls(entries)
  }

  entries = normalise(entries)

  return entries.length == 0
    ? undefined
    : Object.fromEntries(entries)
}

type Entries = [string, any][]

function normalise(entries: Entries): Entries {
  return entries.map(([key, value]) => {
    if (key.toLocaleLowerCase() == "tags") {
      return [key, normaliseTags(value)]
    }

    return [key, value]
  })
}

function normaliseTags(data: string[] | string | null): string[] {
  if (data == null) { return [] }

  if (!Array.isArray(data) && typeof data != "string") {
    throw new Error("Tags must be an array or a string")
  }

  const result: string[] = typeof data == "string"
    ? data.split(",").flatMap(x => x.trim().split(" "))
    : data

  return result.filter(x => x && x.length != 0)
}

function filterKeys(entries: Entries, keys: string[], mode: FilterMode): Entries {
  const predicate = mode == "ignore"
    ? (x: boolean) => !x
    : (x: boolean) => x

  return entries.filter(([key, _value]) => predicate(keys.some(x => x === key)))
}

function filterNulls(entries: Entries): Entries {
  return entries
    .filter(([_key, value]) => !isEmptyValue(value))
}
