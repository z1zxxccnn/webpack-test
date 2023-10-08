import module from './testmain.module.scss'

function dragElement (elmnt: HTMLElement, elmntHeader: HTMLElement,
  moveOrResize: boolean): void {
  let oriX = 0; let oriY = 0
  let oriLeft = 0; let oriTop = 0
  let oriWidth = 0; let oriHeight = 0
  elmntHeader.onmousedown = dragMouseDown

  const style = window.getComputedStyle(elmnt)
  const minW = Number(style.getPropertyValue('min-width').slice(0, -2))
  const minH = Number(style.getPropertyValue('min-height').slice(0, -2))
  const diffW = (elmnt.offsetWidth -
    Number(style.getPropertyValue('width').slice(0, -2)))
  const diffH = (elmnt.offsetHeight -
    Number(style.getPropertyValue('height').slice(0, -2)))

  function dragMouseDown (e: MouseEvent): void {
    e.preventDefault()

    // get the mouse cursor position at startup:
    oriX = e.clientX
    oriY = e.clientY
    oriLeft = elmnt.offsetLeft
    oriTop = elmnt.offsetTop
    oriWidth = elmnt.offsetWidth
    oriHeight = elmnt.offsetHeight

    document.onmouseup = closeDragElement
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag
  }

  function elementDrag (e: MouseEvent): void {
    e.preventDefault()
    // calculate the new cursor position:
    const offsetX = oriX - e.clientX
    const offsetY = oriY - e.clientY

    if (moveOrResize) {
      let newLeft = oriLeft - offsetX
      let newTop = oriTop - offsetY

      // prevent out of parent rect
      if (elmnt.offsetParent !== null) {
        const parentRect = elmnt.offsetParent.getBoundingClientRect()
        if (newLeft + elmnt.offsetWidth > parentRect.right) {
          newLeft = parentRect.right - elmnt.offsetWidth
        }
        if (newTop + elmnt.offsetHeight > parentRect.bottom) {
          newTop = parentRect.bottom - elmnt.offsetHeight
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
    } else {
      let newWidth = oriWidth - offsetX
      let newHeight = oriHeight - offsetY

      // prevent out of parent rect
      if (elmnt.offsetParent !== null) {
        const parentRect = elmnt.offsetParent.getBoundingClientRect()
        if (elmnt.offsetLeft + newWidth + diffW > parentRect.right) {
          newWidth = parentRect.right - elmnt.offsetLeft - diffW
        }
        if (elmnt.offsetTop + newHeight + diffH > parentRect.bottom) {
          newHeight = parentRect.bottom - elmnt.offsetTop - diffH
        }
      }
      if (newWidth < minW) {
        newWidth = minW
      }
      if (newHeight < minH) {
        newHeight = minH
      }

      // set the element's new size:
      elmnt.style.width = String(newWidth) + 'px'
      elmnt.style.height = String(newHeight) + 'px'
    }
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
  document.body.appendChild(mainDiv)

  const mainDivHeader = document.createElement('div')
  mainDivHeader.id = module.test_panel_root_header
  mainDiv.appendChild(mainDivHeader)

  const mainDivHeaderMove = document.createElement('div')
  mainDivHeaderMove.id = module.test_panel_root_header_move
  mainDivHeaderMove.innerHTML = 'MOVE'
  mainDivHeader.appendChild(mainDivHeaderMove)

  const mainDivHeaderResize = document.createElement('div')
  mainDivHeaderResize.id = module.test_panel_root_header_resize
  mainDivHeaderResize.innerHTML = 'RESIZE'
  mainDivHeader.appendChild(mainDivHeaderResize)

  dragElement(mainDiv, mainDivHeaderMove, true)
  dragElement(mainDiv, mainDivHeaderResize, false)
}
