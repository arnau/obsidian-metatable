## Obsidian Metatable

A plugin to display the full frontmatter block instead of just the list of tags.

![](screenshot.png)


## Configuration

By enabling the plugin in the “Community plugins” section you'll be all set. To see the effects you'll need to open a new document or restart the vault.


### Settings

- **Expansion level** let's you choose whether you want the metatable fully collapsed, collapse only leafs or fully expanded.


### CSS Custom properties

Use [CSS custom properties] to tweak the styles defined for the `.obsidian-metatable` [Web Component] shadow DOM.

- `--metatable-border`: Defined in terms of `--background-modifier-border`.
- `--metatable-background-primary`: Defined in terms of `--background-primary-alt`.
- `--metatable-background-secondary-alt`: Defined in terms of `--background-secondary-alt`.
- `--metatable-background-secondary`: Defined in terms of `--background-secondary`.
- `--metatable-font-size`.
- `--metatable-toggle`.

For more details, either use the Inspector tool in Obsidian or check out the [`metatable.css`](src/metatable.css).


## Roadmap

- [x] Basic takeover from the default plugin.
- [x] Use a [Web Component] for better isolation.
- [x] Add setting for expansion level.
- [x] Cut releases with Github Actions.
- [x] Adjust styles to work better with the default light theme.
- [x] Adjust styles to work better with the default dark theme.
- [ ] Add setting for filtering top level keys.
- [ ] Add setting for adding custom mapping functions.


## Installation

From source:

- Clone the [source repository].
- Run `yarn install`.
- Run `yarn build`.
- Create a `obsidian-metatable` under your vault's `.obsidian/plugins/` directory.
- Copy over `main.js`, `versions.json` and `manifest.json`.


## Licence

Arnau Siches under the [MIT License](./LICENCE)


[CSS custom properties]: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
[Web Component]: https://developer.mozilla.org/en-US/docs/Web/Web_Components
[source repository]: https://github.com/arnau/obsidian-metatable
