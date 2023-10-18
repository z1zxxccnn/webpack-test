import module from './testlog.module.scss'

export function toTestLog (msg: string): void {
  const elmnt = document.getElementById(module.test_log_pre)
  if (elmnt != null) {
    elmnt.textContent = `${msg}\n${elmnt.textContent ?? ''}`
  }
}

export function TestLog (): React.JSX.Element {
  const handleBtnClicked = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.preventDefault()
    toTestLog('TEST LOG Clicked!TEST LOG Clicked!TEST LOG Clicked!')
  }
  return (
    <div id={module.test_log_div}>
      <button onClick={handleBtnClicked}>TEST LOG</button>
      <pre id={module.test_log_pre}></pre>
    </div>
  )
}
