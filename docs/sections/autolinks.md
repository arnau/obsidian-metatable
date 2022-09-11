---
previous: %customising_parts%
next: %anatomy%
tags: [section]
---
# Autolinks

The term “autolinks” refers to the [[configuration#Autolinks | Autolinks setting]] which, when enabled, transforms certain patterns into links.

Check the [[links]] example to see them at work.


## URL

Any value that is a valid HTTP or HTTPS [URLs](https://developer.mozilla.org/en-US/docs/Web/API/URL) such as `https://www.seachess.net`.

It also recognises:

- [Evernote](https://evernote.com/) links using the `evernote:` protocol.
- [Obsidian](https://www.obsidian.md/) links using the `obsidian:` protocol.
- [Zotero](https://www.zotero.org/) links using the `zotero:` protocol. Links are expected to follow a pattern such as `zotero://select/items/@citekey` or `zotero://open-pdf/...`. When used with the [obsidian-citation-plugin](https://github.com/hans/obsidian-citation-plugin), the variable `{{zoteroSelectURI}}` can be used to open the linked citation directly.


## Local

Any value starting with `./` or `../` is considered a local link. For example, `./projects/obsidian-metatable` will link to the `obsidian-metatable.md` under the `projects` folder.


## Markdown

Any value of the form `[label](url)` where the URL is a [valid URL](#url) or a [valid local URL](#local).


## Wiki

Any value starting with `[[` and ending with `]]` is considered a wiki link. The behaviour should be the same with any other wikilink you would write in Markdown.

**Warning**: Square brackets `[]` in YAML are reserved for defining arrays so in order to actually use wikilinks you have to tell YAML that it's a string.

For example,

```yaml
quoted: "[[basic-alt]]"
long-string: >-
  [[target]]
```

You can also customise the text displayed by using the following form:

```
[[target|Text to display]]
```


## Frontmatter

Any value starting and ending with `%` is considered a frontmatter link. The behaviour is the same as per wiki links.

**Warning**: This format is non-standard. But it's more convenient than wiki links.