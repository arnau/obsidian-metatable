---
creation_date: 2021-04-19
decision_date: 2021-04-19
decision_outcome: accepted
---
# Use Web Component for better isolation

[Web Components] have three main technologies: custom elements, shadow DOM and
HTML Templates.

## Proposal

Use a Web component to isolate the complexities of the plugin, reduce CSS
conflicts and JavaScript clashes.


## Outcome

The initial approach was to use both custom elements and shadow DOM. The goals
were met.

The Obidian reviewers pointed out that custom elements cannot be de-registered
which at all effects pollute the global namespace.

Take this scenario:

1. Install plugin with custom element.
2. Enable plugin: custom element registered.
3. Disable plugin: custom element still there.
4. Uninstall plugin: custom element still there.

The fact that custom elements can't be de-registred is a problem in a system
where plugins should be able to clean after themselves.

The second approach was to just use a shadow DOM. The goals were met.

Shadow DOM is what provides the boundary preventing CSS and JavaScript to
affect the other side so by not using a custom element the main goal was
preserved.


## Conclusion

Using the shadow DOM mechanism provides the required level of isolation. And
combined with [Custom Properties] enough flexibility to tweak how the table is
rendered.


[Web Components]: https://developer.mozilla.org/en-US/docs/Web/Web_Components
[Custom Properties]: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
