import { it, expect, afterEach } from '@jest/globals'
import renderer from 'react-test-renderer'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { LinkJs, CheckboxWithLabelJs } from './testreactjs.jsx'

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

// Note: running cleanup afterEach is done automatically
// for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup)

it('CheckboxWithLabel changes the text after click', () => {
  const { queryByLabelText, getByLabelText } = render(
    <CheckboxWithLabelJs labelOn="On" labelOff="Off" />
  )

  expect(queryByLabelText(/off/i)).toBeTruthy()

  fireEvent.click(getByLabelText(/off/i))

  expect(queryByLabelText(/on/i)).toBeTruthy()
})
