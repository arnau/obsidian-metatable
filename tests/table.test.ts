import metatable from '../src/table'
import { Context, RuleStore, defaultContext, patchSettings } from '../src/core'

jest.mock('obsidian')
const context: Context = defaultContext('test')

describe('metatable', () => {
  test('empty', () => {
    const frontmatter = {}
    const fragment = metatable(frontmatter, context)
    const members = fragment.querySelectorAll('details > .set > .member')

    expect(members.length).toBe(0)
  })

  test('one member', () => {
    const frontmatter = {
      date: '2021-05-16'
    }
    const fragment = metatable(frontmatter, context)
    const members = fragment.querySelectorAll('details > .set > .member')

    expect(members.length).toBe(1)
  })

  describe('ignoreNulls', () => {
    test('one null member', () => {
      const frontmatter = {
        foo: null
      }
      const fragment = metatable(frontmatter, patchSettings(context, { ignoreNulls: true }))
      const members = fragment.querySelectorAll('details > .set > .member')

      expect(members.length).toBe(0)
    })

    test('one member', () => {
      const frontmatter = {
        foo: 'bar'
      }
      const fragment = metatable(frontmatter, patchSettings(context, { ignoreNulls: true }))
      const members = fragment.querySelectorAll('details > .set > .member')

      expect(members.length).toBe(1)
    })

    test('one member each', () => {
      const frontmatter = {
        date: '2021-05-16',
        foo: null,
      }
      const fragment = metatable(frontmatter, patchSettings(context, { ignoreNulls: true }))
      const members = fragment.querySelectorAll('details > .set > .member')

      expect(members.length).toBe(1)
    })

    test('nested null', () => {
      const frontmatter = {
        top: {
          child: null,
        }
      }
      const fragment = metatable(frontmatter, patchSettings(context, { ignoreNulls: true }))
      const members = fragment.querySelectorAll('details > .set > .member .member')

      expect(members.length).toBe(0)
    })
  })

  describe('filterKeys', () => {
    test('ignore custom', () => {
      const frontmatter = {
        notme: 'boo',
        butme: 'hey',
      }
      const fragment = metatable(frontmatter, patchSettings(context, { filterMode: 'ignore', filterKeys: ['notme'] }))
      const members = fragment.querySelectorAll('details > .set > .member')

      expect(members.length).toBe(1)
    })

    test('keep custom', () => {
      const frontmatter = {
        notme: 'boo',
        butme: 'hey',
      }
      const fragment = metatable(frontmatter, patchSettings(context, { filterMode: 'keep', filterKeys: ['butme'] }))
      const members = fragment.querySelectorAll('details > .set > .member')

      expect(members.length).toBe(1)
    })
  })

  describe('nullValue', () => {
    test('custom', () => {
      const nullValue = '(null)'
      const frontmatter = {
        foo: null,
      }
      const fragment = metatable(frontmatter, patchSettings(context, { nullValue }))
      const value = fragment.querySelector('.value')

      expect(value.textContent).toBe(nullValue)
    })
  })

  describe('mode', () => {
    test('expanded', () => {
      const frontmatter = {
        foldable: ['one', 'two'],
      }
      const fragment = metatable(frontmatter, context)
      const root = fragment.querySelector('details')
      const memberKey = fragment.querySelector('.member > .key')

      expect(root.getAttribute('open')).toBe('')
      expect(memberKey.getAttribute('aria-expanded')).toBe('true')
    })

    test('leaf-collapsed', () => {
      const frontmatter = {
        foldable: ['one', 'two'],
      }
      const fragment = metatable(frontmatter, patchSettings(context, { mode: 'leaf-collapsed'}))
      const root = fragment.querySelector('details')
      const memberKey = fragment.querySelector('.member > .key')

      expect(root.getAttribute('open')).toBe('')
      expect(memberKey.getAttribute('aria-expanded')).toBe('false')
    })

    test('all-collapsed', () => {
      const frontmatter = {
        foldable: ['one', 'two'],
      }
      const fragment = metatable(frontmatter, patchSettings(context, { mode: 'all-collapsed'}))
      const root = fragment.querySelector('details')
      const memberKey = fragment.querySelector('.member > .key')

      expect(root.getAttribute('open')).toBe(null)
      expect(memberKey.getAttribute('aria-expanded')).toBe('false')
    })
  })

})
