## Obsidian Metatable

A plugin for [Obsidian] to display the full frontmatter block instead of just the list of tags.

![screenshot](screenshot.png)

## Changelog

- 0.13.1:
  - Fix custom text for frontmatter links.
- 0.13.0:
  - Add `--metatable-member-gap`.
  - Add parts for `summary`, `member`, `set` and `marker`.
  - Fix preserving filter keys with the same starting substring.
  - Fix processing tags when the YAML key is capitalised.
  - Add custom text for wikilinks.
- **O.12.0**:
  - Add warning when the frontmatter is not valid YAML.
  - Fix preserving the folded frontmatter when in edit mode.

See the [changelog](./CHANGELOG.md) for the full list of version. Or check the
[decision log](./docs/decision_log/) for the main design choices.


## Configuration

By enabling the plugin in the “Community plugins” section you'll be all set.
To see the effects you'll need to open a new document or restart the vault.

Check the [documentation](./docs/index.md) for a getting started, customisation
strategies, examples and more.


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
- Run `npm install`.
- Run `npm run build`.
- Create an `obsidian-metatable` directory under your vault's `.obsidian/plugins/` directory.
- Copy over `main.js`, `versions.json` and `manifest.json`.
- Enable plugin in the “Community Plugins” Settings section.
- Open a file (notice that previously opened files won't get the effects of the plugin until reopened or changed).


## Licence

Arnau Siches under the [MIT License](./LICENCE)


[Obsidian]: https://www.obsidian.md/
[latest release]: https://github.com/arnau/obsidian-metatable/releases/latest
[source repository]: https://github.com/arnau/obsidian-metatable
