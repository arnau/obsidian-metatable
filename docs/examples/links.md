---
url: https://www.obsidian.md
local:
  - ../examples/null_values
  - ./filtered_keys
  - ./tests/title with spaces
wiki:
  - "[[autolinks]]"
  - "[[title with spaces]]"
  - "[[autolinks | Auto Links]]"
frontmatter:
  - %autolinks%
  - %title with spaces%
  - %autolinks|Autolinks%
md:
  - "[Basic configuration](../configuration)"
  - "[Missing page](../missing)"
  - "[A remote page](https://www.obsidian.md)"
  - "[test spaces](../tests/title with spaces)"
---
# Links

**This example requires the [[configuration#Autolinks | Autolinks]] setting enabled.**