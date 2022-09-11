---
previous: %customising_colours_and_symbols%
next: %tags%
tags: [section]
---
# Customising parts

Whilst [[customising_colours_and_symbols]] go a long way, it does have limits either shortcomings of the implementation or by design. I these scenarios, parts will allow you to go further.

It's worth acquainting yourself with the [[sections/anatomy]] of the metatable to see how parts compose.

When we say “part” we really refer to the [::part pseudo-element](https://developer.mozilla.org/en-US/docs/Web/CSS/::part). So, when we say that there is a “list part” we mean that there is an HTML element with an attribute `part="list"` which can be targeted from CSS using `::part(list)`. 

Note that parts are limited by design so you won't be able to influence children such as links or deep structures in values. If that's what you need, you will have to enable the [[configuration#Naked mode | naked mode]] and style everything yourself.

Example: [[parts]]


## Parts

The available parts are:

- [[#Root and summary]]
- [[#Set member key and value]]
- [[#List and list item]]
- [[#Scalars]]
- [[#Tags]]
- [[#Links]]


## Root and summary

The root contains the summary and the actual metatable.

Note that the metatable is expected to start as a [[sections/anatomy#Set]] but technically speaking it can be anything YAML allows for.

The summary is the header for the metatable, it is a `summary` element for the [[inline_metatable]] and an `h1` element for the [[sidebar_metatable]].


## Set, member, key and value

A set is composed of members and members are composed of a key and a value. Effectively the same structure as an HTML table where you have a `table` (set), `tr` (member), `th` (key) and `td` (value).

The structure uses multiple [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) to arrange each part in place.

For example, if you want to give more room to keys and you could remove the grid layout:

```css
.obsidian-metatable::part(member) {
  display: block;
}

.obsidian-metatable::part(value) {
  margin-left: 20px;
}
```

Or, in a extreme case you could start by resetting everything for a part:

```css
.obsidian-metatable::part(value) {
  all: unset;
}
```

Finally, when values contain a collection (either set or list) there is a `marker` part that allows styling the, by default, `...` when the collection is collapsed.


## List and list item

A list is composed of list items. Effectively an HTML `ul` element with a collection of `li` elements.

The same logic described for [[#Set member key and value]] apply here.

Note that although [[#Tags]] are a list, they have different rules and structure. To customise it further you can use the [[#Named Parts]].

## Scalars

Scalar parts are:

- `string`: Any string not conforming to other more restrictive patterns.
- `number`: Any number as per YAML.
- `null`: Any value as per [[null_values]].
- `link` (and `internal-link`, `external-link`): Any value as per [[autolinks]].
- `isodate`: Any string conforming to an ISO date (e.g. 2022-09-03).


### Tags

A tag has a `tag` part.

For example, to reproduce the [Tag Pills](https://forum.obsidian.md/t/meta-post-common-css-hacks/1978/13) with this plugin you would do instead:

```css
.obsidian-metatable::part(tag) {
  background-color: pink;
}

.obsidian-metatable::part(tag):hover {
  background-color: var(--text-accent-hover);
}

.obsidian-metatable::part(tag important) {
  color: white;
  background-color: tomato;
}

.obsidian-metatable::part(tag example) {
  color: black;
  background-color: deepskyblue;
}
```

### Links
A link has a `link` part and either a `internal-link` or a `external-link` part.

```css
.obsidian-metatable::part(link) {
  /* generic link tweaks */
}

.obsidian-metatable::part(external-link) {
  /* external link tweaks */
}

.obsidian-metatable::part(external-link):hover {
  /* external link hover tweaks */
}
```


## Named Parts

Both [[#Set member key and value|Sets]] and [[#List and list item|Lists]] have an extra part following the pattern `{collection_type}-{key}`.

For example, the list for the key `tags` has a `list-tags` part and in turn each list item a `list-item-tags` part.

