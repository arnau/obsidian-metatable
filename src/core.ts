import { RuleStore } from './rule'
import { taglist } from './mappers'
export { RuleStore, Rule } from './rule'


/**
 * A value at the end of the frontmattter tree.
 */
export type Leaf = string | number

export type Mode = 'expanded' | 'leaf-collapsed' | 'all-collapsed'

/**
 * A bag of information from the context of execution.
 */
export interface Context {
  vaultName: string;
  rules: RuleStore;
  searchFn: (query: string) => void;
  // openLinkFn: (linktext: string, sourcePath: string, newLeaf?: boolean, openViewState?: OpenViewState): Promise<void>;
  openLinkFn: (linktext: string, sourcePath: string) => Promise<void> | void;
  settings: Settings;
  depth: number;
}

export interface Settings {
  mode: Mode;
  ignoreNulls: boolean;
  nullValue: string;
  ignoredKeys: string[];
  autolinks: boolean;
}

export interface Patch {
  mode?: Mode;
  ignoreNulls?: boolean;
  nullValue?: string;
  ignoredKeys?: string[];
  autolinks?: boolean;
}


export function defaultContext(vaultName: string): Context {
  const rules = new RuleStore()
  rules.set('tags', {
    toHtml: taglist,
    foldable: false,
  })

  const context: Context = {
    vaultName,
    rules,
    searchFn: (query: string) => { console.error("unimplemented") },
    openLinkFn: (linktext: string, sourcePath: string) => { console.error("unimplemented") },
    settings: {
      mode: 'expanded',
      ignoreNulls: false,
      nullValue: '',
      ignoredKeys: ['metatable', 'forntmatter'],
      autolinks: false,
    },
    depth: 0,
  }

  return context
}

export function patchSettings(context: Context, patch: Patch): Context {
  return { ...context, settings: { ...context.settings, ...patch } }
}
