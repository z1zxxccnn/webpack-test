import module from './testcontent.module.scss'
import { createRoot } from 'react-dom/client'
import { TestLog } from './testlog'

export function testContentCreate (eid: string): void {
  const container = document.getElementById(eid)
  if (container !== null) {
    const element = (
      <div id={module.test_content}>
        <TestLog></TestLog>
      </div>
    )
    const root = createRoot(container)
    root.render(element)
  }
}
