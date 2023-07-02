import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import PropTypes from 'prop-types'
import Icon from './icon_carrot.svg'

export function testReactTs (eid: string): void {
  const container = document.getElementById(eid)
  if (container !== null) {
    const element = (
      <div>
        <h1>Hello, ts react!</h1>
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

export function LinkTs (
  {
    page,
    children
  }: { page: string | null, children: string | null }
): React.JSX.Element {
  const [status, setStatus] = useState(STATUS.NORMAL)

  const onMouseEnter = (): void => {
    setStatus(STATUS.HOVERED)
  }

  const onMouseLeave = (): void => {
    setStatus(STATUS.NORMAL)
  }

  return (
    <a
      className={status}
      href={page ?? '#'}
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
LinkTs.propTypes = {
  page: PropTypes.string,
  children: PropTypes.string
}
