---
previous: %customising_parts%
next: %autolinks%
tags: [section]
---
# Tags

[Obsidian treats tags in a particular way](https://help.obsidian.md/How+to/Working+with+tags). From a YAML point of view it is treated in a non standard way, so this section covers this angle.

The `tags` key (or any casing like `Tags`) expects a sequence of strings. In standard YAML there are two options.

## Compact notation

```yaml
tags: [one, two, three]
```

## Indented notation

```yaml
tags:
    - one
    - two
    - three
```

## Non standard notations

However, the following forms are treated as valid forms by Obsidian (and by Obsidian Metatable to keep compatibility).

**It is highly recommended that you stick with the standard notation to keep compatibility with other tools**.


### String (single)

```yaml
tags: one
```

### String (collection)

```yaml
tags: one, two, three
```

