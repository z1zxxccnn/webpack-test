import { createRoot } from 'react-dom/client'

export function test_react_js (eid) {
  const container = document.getElementById(eid)
  if (container !== null) {
    const element = (
      <div>
        <h1>Hello, js react!</h1>
        <h2>Now is {new Date().toLocaleTimeString()}.</h2>
      </div>
    )
    const root = createRoot(container)
    root.render(element)
  }
}
