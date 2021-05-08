## Obsidian Metatable

A plugin to display the full frontmatter block instead of just the list of tags.

![](screenshot.png)

## Changelog

- **next**:
  - Make tags non-foldable.
  - Add toggle to ignore members with null values.
- **0.5.3**:
  - Add skip key to avoid displaying the metatable for a document.
  - Add ignored key list to not display any of these keys in the metatable.
- **0.5.2**:
  - Handle null values.
  - Add null value setting.
  - Autolink external links (http, https).
- **0.5.1**:
  - Link comma-separated tags.

## Configuration

By enabling the plugin in the “Community plugins” section you'll be all set. To see the effects you'll need to open a new document or restart the vault.


### Settings

- **Expansion level** lets you choose whether you want the metatable fully collapsed, collapse only leafs or fully expanded.
- **Null value** lets you define a string to display when a value is `null`.
- **Skip key** lets you define a key that when `true` will not display the metatable for that document.
- **Ignored keys** lets you define the list of keys that should not be displayed in the metatable.


### CSS Custom properties

Use [CSS custom properties] to tweak the styles defined for the `.obsidian-metatable` [Web Component] shadow DOM.

- `--metatable-background`
- `--metatable-collapsed-symbol`
- `--metatable-expanded-symbol`
- `--metatable-external-link-color-hover`
- `--metatable-external-link-color`
- `--metatable-font-family`
- `--metatable-font-size`
- `--metatable-foreground`
- `--metatable-key-background`
- `--metatable-key-border-color-focus`
- `--metatable-key-border-color`
- `--metatable-key-border-width`
- `--metatable-key-focus`
- `--metatable-key-min-width`
- `--metatable-mark-symbol`
- `--metatable-tag-background`
- `--metatable-value-background`


### Example

Say you want your metadata to have a custom palette of pinks and arrows is not your thing.

First, create a directory `<vault>/.obsidian/snippets` and a file `metatable.css` inside.

Then, in Obsidian, open `Settings`, go to `Appearance`, enable `CSS snippets` and enable the `metatable` snippet. Note that you might have to reload the snippets by hand using the button at the top-right hand side of the section.

Finally, add your custom CSS inside the file you just created:

```css
/* .obsidian/snippets/metatable.css */
.theme-light .obsidian-metatable {
  --metatable-key-background: mistyrose;
  --metatable-key-border-color: pink;
  --metatable-foreground: dimgrey;
  --metatable-value-background: snow;
  --metatable-collapsed-symbol: "😶";
  --metatable-expanded-symbol: "😎";
}
```

For more details, either use the Inspector tool in Obsidian or check out the [`metatable.css`](src/metatable.css).


## Roadmap

- [x] Basic takeover from the default plugin.
- [x] Use a [Web Component] for better isolation.
- [x] Add setting for expansion level.
- [x] Cut releases with Github Actions.
- [x] Adjust styles to work better with the default light theme.
- [x] Adjust styles to work better with the default dark theme.
- [x] Add setting for filtering top level keys.
- [ ] Add setting for adding custom mapping functions.

Check the [decision log](./decision_log) for the rationale behind the main design choices.


## Installation

From Obsidian:

- Ensure Community Plugins are enabled.
- Browse community plugins searching for **metatable**.
- Click install.
- Enable plugin in the “Community Plugins” Settings section.
- Open a file (notice that previously opened files won't get the effects of the plugin until reopened or changed).

From release:

- Download the `obsidian-metatable-{version}.zip` file from the chosen release, for example the [latest release].
- Ensure “Community Plugins” are enabled in Settings.
- Ensure the `.obsidian/plugins/` directory exists in your vault directory.
- Expand the zip file into the `.obsidian/plugins/` directory such that an `obsidian-metatable` directory is a direct child of `plugins`.
- Enable plugin in the “Community Plugins” Settings section.
- Open a file (notice that previously opened files won't get the effects of the plugin until reopened or changed).

From source:

- Clone the [source repository].
- Run `yarn install`.
- Run `yarn build`.
- Create a `obsidian-metatable` under your vault's `.obsidian/plugins/` directory.
- Copy over `main.js`, `versions.json` and `manifest.json`.
- Enable plugin in the “Community Plugins” Settings section.
- Open a file (notice that previously opened files won't get the effects of the plugin until reopened or changed).


## Licence

Arnau Siches under the [MIT License](./LICENCE)


[CSS custom properties]: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
[Web Component]: https://developer.mozilla.org/en-US/docs/Web/Web_Components
[source repository]: https://github.com/arnau/obsidian-metatable
[latest release]: https://github.com/arnau/obsidian-metatable/releases/latest
