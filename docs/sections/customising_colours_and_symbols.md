---
previous: %configuration%
next: %customising_parts%
tags: [section]
---
# Customising colours and symbols

You can customise both colours and symbols using [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties).

There are two possible scopes to customise, the [[inline_metatable]] and the [[sidebar_metatable]].

The [[inline_metatable]] uses the `.obsidian-metatable` CSS class whilst the [[sidebar_metatable]] uses the `.obsidian-metatable-sidebar`.

Example: [[custom_properties]].

## Global palette

The global palette is a small set of custom properties which the rest depend on.

### Fonts

```css
--metatable-font-family
--metatable-font-size
```


### `:focus` pseudo-class

```css
--metatable-background-focus
--metatable-text-focus
```


### Colours

```css
/* global */
--metatable-background-primary
--metatable-text-primary

--metatable-text-secondary
--metatable-background-secondary

--metatable-background-primary-alt

/* links */
--metatable-background-link
--metatable-text-link
--metatable-text-link-hover
```

### Deprecated in 0.14.0

The following custom properties are deprecated and will be removed in future versions.

- `--metatable-foreground`: Use `--metatable-text-primary` instead.
- `--metatable-background`: Use `--metatable-background-primary` instead.
- `--metatable-key-focus`: Use `--metatable-key-background-focus` instead.
- `--metatable-member-gap`. Use `::part(member)` instead.
- `--metatable-key-border-color`. Use `::part(key)` instead.
- `--metatable-key-border-color-focus`. Use `::part(key)` instead.


## Global symbols

- `--metatable-collapsed-symbol`
- `--metatable-expanded-symbol`
- `--metatable-mark-symbol`
- `--metatable-tag-symbol`


## Warning

When the frontmatter YAML can't be parsed, a warning is shown.

```css
--metatable-warning-background
--metatable-warning-foreground
--metatable-warning-border
```


## Parts

All part properties follow a pattern like:

```
--metatable-{where?}-{what}
```

For example, `--metatable-external-link-color-hover` has:

- A `where` equal to `external-link`.
- A `what` equal to `link-color-hover`, which implies it applies to the [CSS :hover pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:hover).

Read the [[sections/anatomy]] section to understand how parts compose.


### Root part
```css
--metatable-root-background
--metatable-root-color
```

### Summary part
```css
--metatable-summary-background
--metatable-summary-color
--metatable-summary-background-focus
--metatable-summary-color-focus
```

### Set part
```css
--metatable-set-background
--metatable-set-color
```

### Member part
```css
--metatable-member-background
--metatable-member-color
```

### Key part
```css
--metatable-key-background
--metatable-key-color
--metatable-key-background-focus
--metatable-key-color-focus
```

### Value part
```css
--metatable-value-background
--metatable-value-color
```


### Tag part

```css
--metatable-tag-background
--metatable-tag-color
--metatable-tag-border
--metatable-tag-background-focus
--metatable-tag-color-focus
```

### External link part

```css
--metatable-external-link-background
--metatable-external-link-color
--metatable-external-link-background-hover
--metatable-external-link-color-hover
--metatable-external-link-background-focus
--metatable-external-link-color-focus
--metatable-external-link-icon
```

### Internal link part

```css
--metatable-internal-link-background
--metatable-internal-link-color
--metatable-internal-link-background-hover
--metatable-internal-link-color-hover
--metatable-internal-link-background-focus
--metatable-internal-link-color-focus
```

### Leaf types

```css
--metatable-leaf-number-color
--metatable-leaf-boolean-color
--metatable-leaf-date-color
--metatable-leaf-nil-color
```
