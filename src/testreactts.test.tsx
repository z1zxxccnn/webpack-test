import { it, expect } from '@jest/globals'
import renderer, { type ReactTestRendererJSON } from 'react-test-renderer'
import { LinkTs } from './testreactts'

it('changes the class when hovered', () => {
  const component = renderer.create(
    <LinkTs page="http://www.facebook.com">Facebook</LinkTs>
  )
  let tree = component.toJSON() as ReactTestRendererJSON
  expect(tree).toMatchSnapshot()

  // manually trigger the callback
  void renderer.act(() => {
    tree.props.onMouseEnter()
  })
  // re-rendering
  tree = component.toJSON() as ReactTestRendererJSON
  expect(tree).toMatchSnapshot()

  // manually trigger the callback
  void renderer.act(() => {
    tree.props.onMouseLeave()
  })
  // re-rendering
  tree = component.toJSON() as ReactTestRendererJSON
  expect(tree).toMatchSnapshot()
})
