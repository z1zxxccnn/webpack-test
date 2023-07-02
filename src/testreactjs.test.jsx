import { it, expect } from '@jest/globals'
import renderer from 'react-test-renderer'
import { LinkJs } from './testreactjs.jsx'

it('changes the class when hovered', () => {
  const component = renderer.create(
    <LinkJs page="http://www.facebook.com">Facebook</LinkJs>
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()

  // manually trigger the callback
  renderer.act(() => {
    tree.props.onMouseEnter()
  })
  // re-rendering
  tree = component.toJSON()
  expect(tree).toMatchSnapshot()

  // manually trigger the callback
  renderer.act(() => {
    tree.props.onMouseLeave()
  })
  // re-rendering
  tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
