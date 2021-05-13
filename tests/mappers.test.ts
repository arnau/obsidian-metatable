import { taglist } from '../src/mappers';

const rule = {
  toHtml: taglist,
  foldable: false,
}

describe('mappers', () => {
  describe('taglist', () => {
    test('baseline', () => {
      const el = taglist(['foo'], rule)
      const child = el.children.item(0)

      expect(el.childElementCount).toBe(1)
      // expect(child.classList.contains('tag')).toBe(true)
      expect(child.innerHTML).toBe('<a class="tag" target="_blank" rel="noopener" href="#foo">foo</a>')
    })

    test('null input', () => {
      expect(taglist(null, rule)).toBe(null)
    })

    test('empty input', () => {
      expect(taglist([], rule)).toBe(null)
    })

    test('plain string', () => {
      const el = taglist('foo', rule)

      expect(el.childElementCount).toBe(1)
    })

    test('comma-separated string', () => {
      const el = taglist('foo bar, qux', rule)
      const child = el.children.item(0)

      expect(el.childElementCount).toBe(2)
    })

    test('array', () => {
      const el = taglist(['foo bar', 'qux'], rule)
      const child = el.children.item(0)

      expect(el.childElementCount).toBe(2)
    })
  })
})
