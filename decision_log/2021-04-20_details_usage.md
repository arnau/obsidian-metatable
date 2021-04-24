---
creation_date: 2021-04-20
decision_date: 2021-04-22
decision_outcome: rejected
---
# Use `details` instead of `table`

The [`details`] element is designed from the start to handle situations where
a expand/collapse behaviour is required.

## Proposal

Use a set of nested `details` to render the frontmatter tree instead of a
`table` such that the logic for toggling visibility is handled natively by the
browser.

## Outcome

The attempt to move from a `table` structure to a `details` one requires the
aid of CSS to display things as a table. The [CSS Grid] layout system is
a natural choice to have full control.

As it turns out, browsers (tested with Firefox and Chromium) make `details`
behave uniquely and _ignore_ the `display: grid` property. A quick attempt
using [Flexbox] shows the same behaviour.

This alone makes `details` a useless option for anything that is not exactly
what the browsers have decided is useful.

## Conclusion

Given that `details` refuses to be managed by robust layout systems the choice
is to revert back to `table`, JavaScript and [ARIA].



[`details`]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
[CSS Grid]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout
[Flexbox]: https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
[ARIA]: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA
