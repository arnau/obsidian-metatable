icloud_basepath := "$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents"
icloud_path := icloud_basepath / "docs/.obsidian/plugins/obsidian-metatable/"

icloud-sync:
  npm run docs
  cp -R dist/* "{{icloud_path}}"
