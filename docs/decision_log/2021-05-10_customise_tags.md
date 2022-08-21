---
creation_date: 2021-05-10
decision_date: 2021-04-11
decision_outcome: accepted
---
# Customise tags

The default Obsidian behaviour allows users to customise tags with enough
flexibility such that they can do things like [Tag Pills].

Metatable though can't offer this way to customise things givent that it uses
a shadow DOM ([Web Components]) to set boundaries between the plugin and the
rest.


## Proposal

Use either the [slot element] or the [::part pseudo-element] to offer a
controlled way into the shadow DOM without exposing the implementation details.


## Outcome

The research on using the [slot element] suggests that it only works in
combination with custom elements ([rejected in favour of plain shadow
DOM](./decision_log/2021-04-19_web_component.md)).

The [::part pseudo-element] on the other hand gives good results with "just CSS".

Given a frontmatter such as:

```yaml
tags:
  - important
  - example
```

it will be transformed into:

```html
…
<tr class="member">
  <th class="key">tags</th>
  <td class="value">
    <ul class="tag-list">
      <li>
        <a class="tag" part="tag important" target="_blank" rel="noopener" href="#example">important</a>
      </li>
      <li>
        <a class="tag" part="tag example" target="_blank" rel="noopener" href="#example">example</a>
      </li>
    </ul>
  </td>
</tr>
…
```

which can then be styled using “Style Snippets” like:

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


## Conclusion

The use of the [::part element] provides a well balanced compromise between
flexibility and abstraction. The only potential concern is the fact that it is
a working draft rather than a well established specification which is highly
mitigated by the fact that Obsidian is a controlled environment using Chromium
(via Electron).


[Web Components]: https://developer.mozilla.org/en-US/docs/Web/Web_Components
[Custom Properties]: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
[::part pseudo-element]: https://developer.mozilla.org/en-US/docs/Web/CSS/::part
[Tag Pills]: https://forum.obsidian.md/t/meta-post-common-css-hacks/1978/13
[slot element]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot
