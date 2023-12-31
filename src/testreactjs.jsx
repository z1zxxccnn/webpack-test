import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import PropTypes from 'prop-types'
import Icon from './icon_carrot.svg'

export function testReactJs (eid) {
  const container = document.getElementById(eid)
  if (container !== null) {
    const element = (
      <div>
        <h1>Hello, js react!</h1>
        <h2>Now is {new Date().toLocaleTimeString()}.</h2>
        <img src={Icon} width="40" height="40" alt=""/>
      </div>
    )
    const root = createRoot(container)
    root.render(element)
  }
}

const STATUS = {
  HOVERED: 'hovered',
  NORMAL: 'normal'
}

export function LinkJs (
  {
    page,
    children
  }
) {
  const [status, setStatus] = useState(STATUS.NORMAL)

  const onMouseEnter = () => {
    setStatus(STATUS.HOVERED)
  }

  const onMouseLeave = () => {
    setStatus(STATUS.NORMAL)
  }

  return (
    <a
      className={status}
      href={page || '#'}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </a>
  )
}

// By default all prop types aren't required
// (i.e. allow null or undefined) unless you
// pop a .isRequired on the end of them.
LinkJs.propTypes = {
  page: PropTypes.string,
  children: PropTypes.string
}

export function CheckboxWithLabelJs (
  {
    labelOn,
    labelOff
  }
) {
  const [isChecked, setIsChecked] = useState(false)

  const onChange = () => {
    setIsChecked(!isChecked)
  }

  return (
    <label>
      <input type="checkbox" checked={isChecked} onChange={onChange} />
      {isChecked ? labelOn : labelOff}
    </label>
  )
}

// By default all prop types aren't required
// (i.e. allow null or undefined) unless you
// pop a .isRequired on the end of them.
CheckboxWithLabelJs.propTypes = {
  labelOn: PropTypes.string,
  labelOff: PropTypes.string
}
