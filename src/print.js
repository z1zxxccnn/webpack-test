import { testReactJs } from './testreactjs.jsx'
import Icon from './icon_carrot.svg'

export default function printMe () {
  console.log('I get called from print.js!')

  const element = document.getElementById('test_div')
  if (element !== null) {
    const reactElem = document.getElementById('e_react_js')
    if (reactElem === null) {
      const eReactJs = document.createElement('div')
      eReactJs.id = 'e_react_js'
      element.appendChild(eReactJs)
      testReactJs('e_react_js')
    }

    // Add the image to our existing div.
    const myIcon = new Image()
    myIcon.src = Icon
    myIcon.width = 40
    myIcon.height = 40
    element.appendChild(myIcon)
  }

  import('./print2.ts')
    .then((module) => {
      module.printTS('from js')
    })
    .catch((error) => {
      console.log('An error occurred while loading print2.ts', error)
    })
}
