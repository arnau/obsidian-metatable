---
next: %getting_started%
tags: [section]
---
# Installation

You can install this plugin in three ways, each one with its own strengths. 

## From Obsidian

Use this option if you want minimum friction both installing and updating. This is the recommended way for most people.

- Ensure Community Plugins are enabled.
- Browse community plugins searching for **metatable**.
- Click install.
- Enable plugin in the “Community Plugins” Settings section.
- Open a file (notice that previously opened files won't get the effects of the plugin until reopened or changed).

## From release

Use this option if you want to try a particular version outside of what the Community Plugins offer or if you rather sidestep Obsidian's installation system.

- Download the `obsidian-metatable-{version}.zip` file from the chosen release, for example the [latest release].
- Ensure “Community Plugins” are enabled in Settings.
- Ensure the `.obsidian/plugins/` directory exists in your vault directory.
- Expand the zip file into the `.obsidian/plugins/` directory such that an `obsidian-metatable` directory is a direct child of `plugins`.
- Enable plugin in the “Community Plugins” Settings section.
- Open a file (notice that previously opened files won't get the effects of the plugin until reopened or changed).

## From source

Use this option if you intent to contribute to the plugin development, you want to fork it out or don't find the previous two options suitable.

- Clone the [source repository].
- Run `npm install`.
- Run `npm run build`.
- Create an `obsidian-metatable` directory under your vault's `.obsidian/plugins/` directory.
- Copy over `main.js`, `versions.json` and `manifest.json`.
- Enable plugin in the “Community Plugins” Settings section.
- Open a file (notice that previously opened files won't get the effects of the plugin until reopened or changed).
