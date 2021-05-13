/**
 * A rule to process a `SetMember`.
 */
export interface Rule {
  // A function to transform the member value into a HTML structure.
  toHtml: Mapper;
  // A flag to control whether a member should be foldable.
  foldable: boolean;
}

/**
 * A function to map from a frontmatter node into an HTML element.
 */
export type Mapper = (value: unknown, rule: Rule) => HTMLElement | null;


/**
 * A member key.
 */
export type Key = string

/**
 * A store of rules to apply to set members.
 *
 * Only one rule can be assigned to a member. If you add two rules against the
 * same member key it will only keep the last one.
 *
 * ## Example
 *
 * ```
 * const rules = new RuleStore()
 * const tagsRule = { toHtml: tagslist, foldable: false }
 * rules.set('tags', tagsRule)
 * ```
 */
export class RuleStore extends Map<Key, Rule> {}
