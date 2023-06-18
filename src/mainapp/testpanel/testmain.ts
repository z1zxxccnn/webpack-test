import module from './testmain.module.scss'

function drag_element(elmnt: HTMLElement, elmnt_header: HTMLElement) {
  let ori_x = 0, ori_y = 0;
  elmnt_header.onmousedown = drag_mouse_down;

  function drag_mouse_down(e: MouseEvent) {
    e.preventDefault();

    // get the mouse cursor position at startup:
    ori_x = e.clientX;
    ori_y = e.clientY;
    
    document.onmouseup = close_drag_element;
    // call a function whenever the cursor moves:
    document.onmousemove = element_drag;
  }

  function element_drag(e: MouseEvent) {
    e.preventDefault();
    // calculate the new cursor position:
    const offset_x = ori_x - e.clientX;
    const offset_y = ori_y - e.clientY;
    ori_x = e.clientX;
    ori_y = e.clientY;
    let new_left = elmnt.offsetLeft - offset_x;
    let new_top = elmnt.offsetTop - offset_y;

    // prevent out of parent rect
    const parent_rect = elmnt.offsetParent.getBoundingClientRect();
    if (new_left + Math.abs(elmnt.offsetWidth) >= parent_rect.right) {
      new_left = parent_rect.right - Math.abs(elmnt.offsetWidth);
    }
    if (new_left < 0) {
      new_left = 0
    }
    if (new_top + Math.abs(elmnt.offsetHeight) >= parent_rect.bottom) {
      new_top = parent_rect.bottom - Math.abs(elmnt.offsetHeight);
    }
    if (new_top < 0) {
      new_top = 0
    }

    // set the element's new position:
    elmnt.style.left = new_left + "px";
    elmnt.style.top = new_top + "px";
  }

  function close_drag_element() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

export function create_test_panel() {
  const main_div = document.createElement('div');
  main_div.id = module.test_panel_root;

  const main_div_header = document.createElement('div');
  main_div_header.id = module.test_panel_root_header;
  main_div_header.innerHTML = 'Click here to move';
  main_div.appendChild(main_div_header);

  document.body.appendChild(main_div);

  drag_element(main_div, main_div_header);
}