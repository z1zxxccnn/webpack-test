import module from './testmain.module.scss'
import { testContentCreate } from './testcontent'
import { toTestLog } from './testlog'

function dragElement (elmnt: HTMLElement, elmntHeader: HTMLElement,
  moveOrResize: boolean): void {
  let oriX = 0; let oriY = 0
  let oriLeft = 0; let oriTop = 0
  let oriWidth = 0; let oriHeight = 0
  let curTouchId: number | null = null

  elmntHeader.addEventListener('mousedown', dragMouseDown)
  elmntHeader.addEventListener('touchstart', dragTouchStart)

  const style = window.getComputedStyle(elmnt)
  const minW = Number(style.getPropertyValue('min-width').slice(0, -2))
  const minH = Number(style.getPropertyValue('min-height').slice(0, -2))
  const diffW = (elmnt.offsetWidth -
    Number(style.getPropertyValue('width').slice(0, -2)))
  const diffH = (elmnt.offsetHeight -
    Number(style.getPropertyValue('height').slice(0, -2)))

  function onStart (e: MouseEvent | Touch): void {
    // get the mouse cursor position at startup:
    oriX = e.clientX
    oriY = e.clientY
    oriLeft = elmnt.offsetLeft
    oriTop = elmnt.offsetTop
    oriWidth = elmnt.offsetWidth
    oriHeight = elmnt.offsetHeight
  }

  function onMoveOrResize (e: MouseEvent | Touch): void {
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

  function dragMouseDown (e: MouseEvent): void {
    e.preventDefault()

    onStart(e)
    document.addEventListener('mousemove', dragMouseMove)
    document.addEventListener('mouseup', dragMouseUp)
  }

  function dragMouseMove (e: MouseEvent): void {
    e.preventDefault()

    onMoveOrResize(e)
  }

  function dragMouseUp (e: MouseEvent): void {
    e.preventDefault()

    document.removeEventListener('mousemove', dragMouseMove)
    document.removeEventListener('mouseup', dragMouseUp)
  }

  function dragTouchStart (e: TouchEvent): void {
    e.preventDefault()

    if (curTouchId === null) {
      const touches = e.changedTouches
      if (touches.length > 0) {
        const touch = touches[0]
        toTestLog(`touch.radiusX: ${touch.radiusX}`)
        toTestLog(`touch.radiusY: ${touch.radiusY}`)
        toTestLog(`touch.rotationAngle: ${touch.rotationAngle}`)
        // for iOS Safari distinguishing finger vs Apple Pencil
        // finger: direct, Apple Pencil: stylus
        if ('touchType' in touch) {
          toTestLog(`touch.touchType: ${String(touch.touchType)}`)
        }
        curTouchId = touch.identifier
        onStart(touch)
        elmntHeader.addEventListener('touchmove', dragTouchMove)
        elmntHeader.addEventListener('touchend', dragTouchEnd)
        elmntHeader.addEventListener('touchcancel', dragTouchCancel)
      }
    }
  }

  function dragTouchMove (e: TouchEvent): void {
    e.preventDefault()

    if (curTouchId !== null) {
      const touches = e.changedTouches
      for (let i = 0; i < touches.length; i++) {
        const touch = touches[0]
        if (curTouchId === touch.identifier) {
          onMoveOrResize(touch)
          break
        }
      }
    }
  }

  function dragTouchEnd (e: TouchEvent): void {
    e.preventDefault()

    if (curTouchId !== null) {
      const touches = e.changedTouches
      for (let i = 0; i < touches.length; i++) {
        const touch = touches[0]
        if (curTouchId === touch.identifier) {
          curTouchId = null
          elmntHeader.removeEventListener('touchmove', dragTouchMove)
          elmntHeader.removeEventListener('touchend', dragTouchEnd)
          elmntHeader.removeEventListener('touchcancel', dragTouchCancel)
          break
        }
      }
    }
  }

  function dragTouchCancel (e: TouchEvent): void {
    e.preventDefault()

    if (curTouchId !== null) {
      const touches = e.changedTouches
      for (let i = 0; i < touches.length; i++) {
        const touch = touches[0]
        if (curTouchId === touch.identifier) {
          curTouchId = null
          elmntHeader.removeEventListener('touchmove', dragTouchMove)
          elmntHeader.removeEventListener('touchend', dragTouchEnd)
          elmntHeader.removeEventListener('touchcancel', dragTouchCancel)
          break
        }
      }
    }
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

  const mainDivContent = document.createElement('div')
  mainDivContent.id = module.test_panel_root_content
  mainDiv.appendChild(mainDivContent)

  testContentCreate(module.test_panel_root_content)

  dragElement(mainDiv, mainDivHeaderMove, true)
  dragElement(mainDiv, mainDivHeaderResize, false)
}
