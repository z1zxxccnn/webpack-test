import { testReactTs } from './testreactts'
import Icon from './icon_carrot.svg'

export default function printMe (): void {
  console.log('I get called from print.ts!')

  const element = document.getElementById('test_div')
  if (element !== null) {
    const reactElem = document.getElementById('e_react_ts')
    if (reactElem === null) {
      const eReactTs = document.createElement('div')
      eReactTs.id = 'e_react_ts'
      element.appendChild(eReactTs)
      testReactTs('e_react_ts')
    }

    // Add the image to our existing div.
    const myIcon = new Image()
    myIcon.src = Icon
    myIcon.width = 40
    myIcon.height = 40
    element.appendChild(myIcon)
  }

  import('./print2.js')
    .then((module) => {
      module.printTS('from ts')
    })
    .catch((error) => {
      console.log('An error occurred while loading print2.js', error)
    })
}
