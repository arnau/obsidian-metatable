/**
  * The state for the Sidebar.
  */

import { createSignal } from "solid-js"

import { parseFrontmatter, readFrontmatter } from "./frontmatter"
import { cleanData } from "./core"
import type { ValueError, MaybeValue, MaybeValueError } from "./value"
import type { Settings } from "./settings"


export interface State {
  name: string,
  frontmatter: string | undefined,
  metadata: MaybeValue,
  error: ValueError | undefined,
}

export interface Seed {
  name: string,
  content: string,
}


/**
 * Creates a new Signal for the given `Settings` which computes the new state out
 * of a `Seed`.
 */
export function createState(settings: Settings): [get: () => State, set: (v: Seed | null) => void] {
  const [state, setState] = createSignal<State>({} as State)

  const nextState = (seed: Seed | null) => {
    if (seed !== null) {
      const newState = computeState(state, seed, settings)

      if (newState !== undefined) {
        setState(newState)
      }
    } else {
      setState({} as State)
    }
  }

  return [state, nextState]
}


function computeState(state: () => State, seed: Seed, settings: Settings): State | undefined {
  const name = seed.name
  const frontmatter = readFrontmatter(seed.content)

  // Avoid unnecessary parsing.
  if (frontmatter === state().frontmatter) { return }

  let metadata: MaybeValue
  let error: MaybeValueError

  try {
    metadata = parseFrontmatter(frontmatter)
    metadata = cleanData(metadata, settings)
  } catch (err) {
    error = err as MaybeValueError
  }

  return ({ name, frontmatter, metadata, error })
}
