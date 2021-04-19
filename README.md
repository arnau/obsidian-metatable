## Obsidian Metatable

A plugin to display the full frontmatter block instead of just the list of tags.

It has been mostly tested using the [Minimal theme](https://github.com/kepano/obsidian-minimal). At this time the default theme doesn't look as good.

![](screenshot.png)


## Configuration

By enabling the plugin in the “Community plugins” section you'll be all set. To see the effects you'll need to open a new document or restart the vault.


### Options

- **Expansion level** let's you choose whether you want the metatable fully collapsed, collapse only leafs or fully expanded.
- **Debug mode** helps with the development of this plugin. Ignore otherwise.


## Roadmap

- [x] Basic takeover from the default plugin.
- [x] Use a [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) for better isolation.
- [x] Add setting for expansion level.
- [ ] Cut releases with Github Actions.
- [ ] Adjust styles to work better with the default light theme.
- [ ] Adjust styles to work better with the default dark theme.
- [ ] Add setting for filtering top level keys.
- [ ] Add setting for adding custom mapping functions.


## Installation

From source:

- Clone the [source repository](https://github.com/arnau/obsidian-metatable).
- Run `yarn install`.
- Run `yarn build`.
- Create a `obsidian-metatable` under your vault's `.obsidian/plugins/` directory.
- Copy over `main.js`, `versions.json` and `manifest.json`.


## Licence

Arnau Siches under the [MIT License](./LICENCE)
