---
previous: %getting_started%
next: %customising_colours_and_symbols%
tags: [section]
---
# Configuration

**Note**: Most changes in configuration will require you to reopen the documents you have opened to be able to see their effect.

You should find the Metatable settings section by opening the Obsidian Preferences and scrolling down the left sidebar until you see the Community Plugins section.


## Expansion level

This option lets you choose whether the metatable is fully collapsed, fully expanded or something in between.

This option is most useful if you use the in-document metatable and you have large sets of metadata.

Possible values:

- Fully expanded: Everything is visible.
- Collapse leafs: The complex leafs (lists and sets) are collapsed.
- Collapse all: TODO
- Collapse root: The Metatable root is collapsed.


## Skip key

This option lets you define a key that, when defined in the frontmatter as `true` it makes the [[inline_metatable]] to not be displayed at all.

By default the skip key is `metatable` so the following frontmatter would not be displayed at all.

```yaml
metatable: true
foo: never displayed
bar: also not displayed
```

**Warning**: This option has no effect on the [[sidebar_metatable]].


## Null values

For the purpose of the metatable, a "null value" is one of the following:

- An explicit `null` value.
- A commented value.
- An empty string, including a missing value.
- An empty list.
- An empty set.

Example: [[null_values]]

Null values can be configured in two ways: ignoring  them or displaying the with a custom value.

### Ignore null values

This switch is disabled by default. When enabled it never displays any member of the metatable with a null value.

### Custom null value

This text is empty by default. When filled in, every null value is replaced with it.


## Filter

The filter settings let you control which keys should never be displayed or the keys that should only be displayed according to the filter mode.

Example: [[filtered_keys]]

### Filter mode

This option lets you choose whether the filtering is either **ignore** or **keep**. By default the mode is **ignore**.

- **Ignore**: Any key in the “filter keys” list is ignored.
- **Keep**: Any key not in the “filter keys” list is ignored.

### Filter keys

This option lets you define the list of keys that should be kept or ignored by the “filter mode”.

By default the values are `metatable` and `frontmatter`.


## Autolinks

This option transforms certain value patterns into actual links. This option is disabled by default.

Example: [[links]]

Available patterns:

- **URL**. Any URL-like value.
- **Local**. Any value starting with `./` or `../`.
- **Markdown**. Any value like a markdown link.
- **Wiki**. Any value surrounded by `[[` and `]]`.
- **Frontmatter**. Any value surrounded by `%`.

You can find a full explanation for each pattern in [[autolinks]].

## Naked mode

This option lets you choose whether to sandbox the metatable widget using [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM). The default is to have the sandbox enabled.

If you enable the naked mode no default CSS will be applied and will be your responsibility or the theme you use to style the metatable correctly.