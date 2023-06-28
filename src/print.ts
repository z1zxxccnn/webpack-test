import Icon from './icon_carrot.svg'

export default function printMe (): void {
  console.log('I get called from print.ts!')

  const element = document.getElementById('test_div')
  if (element !== null) {
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
