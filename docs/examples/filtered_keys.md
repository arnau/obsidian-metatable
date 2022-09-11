---
guacamole: green
metatable: false
frontmatter: 42
tags: [one, two, three]
---
# Filtered keys

This example shows the behaviour of the [[configuration#Filter | filter settings]]. When the “filter mode” is **ignore**, only the keys `guacamole` and `tags` should be displayed and when the value is **keep**, only `metatable` and `frontmatter` should be kept.

This example assumes that the “filter keys” setting has the default values.

If you modify the example with the following frontmatter you'll see that filtering is honoured regardless of how deep into the structure keys are found.

```yaml
guacamole: green
metatable: false
frontmatter: 42
deep:
    frontmatter: wave
deeper:
    foo: 1
    bar:
        metatable: false
        value: qux
tags: [one, two, three]
```