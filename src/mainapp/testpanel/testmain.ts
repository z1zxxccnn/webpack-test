import module from './testmain.module.scss'

function dragElement (elmnt: HTMLElement, elmntHeader: HTMLElement): void {
  let oriX = 0; let oriY = 0
  elmntHeader.onmousedown = dragMouseDown

  function dragMouseDown (e: MouseEvent): void {
    e.preventDefault()

    // get the mouse cursor position at startup:
    oriX = e.clientX
    oriY = e.clientY

    document.onmouseup = closeDragElement
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag
  }

  function elementDrag (e: MouseEvent): void {
    e.preventDefault()
    // calculate the new cursor position:
    const offsetX = oriX - e.clientX
    const offsetY = oriY - e.clientY
    oriX = e.clientX
    oriY = e.clientY
    let newLeft = elmnt.offsetLeft - offsetX
    let newTop = elmnt.offsetTop - offsetY

    // prevent out of parent rect
    if (elmnt.offsetParent !== null) {
      const parentRect = elmnt.offsetParent.getBoundingClientRect()
      if (newLeft + Math.abs(elmnt.offsetWidth) >= parentRect.right) {
        newLeft = parentRect.right - Math.abs(elmnt.offsetWidth)
      }
      if (newTop + Math.abs(elmnt.offsetHeight) >= parentRect.bottom) {
        newTop = parentRect.bottom - Math.abs(elmnt.offsetHeight)
      }
    }
    if (newLeft < 0) {
      newLeft = 0
    }
    if (newTop < 0) {
      newTop = 0
    }

    // set the element's new position:
    elmnt.style.left = String(newLeft) + 'px'
    elmnt.style.top = String(newTop) + 'px'
  }

  function closeDragElement (): void {
    // stop moving when mouse button is released:
    document.onmouseup = null
    document.onmousemove = null
  }
}

export function createTestPanel (): void {
  const mainDiv = document.createElement('div')
  mainDiv.id = module.test_panel_root

  const mainDivHeader = document.createElement('div')
  mainDivHeader.id = module.test_panel_root_header
  mainDivHeader.innerHTML = 'Click here to move'
  mainDiv.appendChild(mainDivHeader)

  document.body.appendChild(mainDiv)

  dragElement(mainDiv, mainDivHeader)
}
