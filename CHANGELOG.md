# Changelog

## 0.13.1

- Fix custom text for frontmatter links.

## 0.13.0

- Add `--metatable-member-gap`.
- Add parts for `summary`, `member`, `set` and `marker`.
- Fix preserving filter keys with the same starting substring.
- Fix processing tags when the YAML key is capitalised.
- Add custom text for wikilinks.

## 0.12.0

- Add warning when the frontmatter is not valid YAML.
- Fix preserving the folded frontmatter when in edit mode.

## 0.11.0

- Improve filter key settings UX.
- Add zotero links. Thanks @MaroLIACS
- Add `naked` experimental setting.
- Add `root-collapsed` expansion level.

## 0.10.4

- Fix metatable duplication in embedded notes [bug #12](https://github.com/arnau/obsidian-metatable/issues/12)

## 0.10.3

- Add parts for `link`, `external-link` and `internal-link`.
- Fix parts `key` and `value`.
- Fix vertical alignment for keys.

## 0.10.2

- Add parts for `key` and `value`.

## 0.10.1

- Fix scrolls always showing in Windows.

## 0.10.0

- Add filter mode to either ignore or keep the listed keys.

## 0.9.1

- Fix complex structures in small-screens.

## 0.9.0

- Fix internal links. Now they use the Obsidian default behaviour.
- Remove `--metatable-key-min-width`.
- Add small-screen layout.

## 0.8.4

- Ignore empty arrays when null values are to be ignored.

## 0.8.3

- Ignore ignored keys when checking top-level keys.

## 0.8.2

- Avoid rendering anything if all top-level keys are null and nulls are to be ignored.

## 0.8.1

- Fix tags with spaces.

## 0.8.0

- Add `::part` to enable full tag customisation.

## 0.7.2

- Fix internal link styles (`--metatable-internal-link-icon`, `--metatable-internal-link-color`, `--metatable-internal-link-color-hover`).

## 0.7.1

- Fix numeric values.
- Add evernote autolinking.
- Add custom property `--metatable-tag-symbol`.

## 0.7.0

- Add autolinking (under a feature flag).

## 0.6.1

- Fix opening external links.

## 0.6.0

- Make tags non-foldable.
- Add toggle to ignore members with null values.

## 0.5.3

- Add skip key to avoid displaying the metatable for a document.
- Add ignored key list to not display any of these keys in the metatable.

## 0.5.2

- Handle null values.
- Add null value setting.
- Autolink external links (http, https).

## 0.5.1

- Link comma-separated tags.
