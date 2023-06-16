import Icon from './icon_carrot.svg';

export default function printMe() {
  console.log('I get called from print.ts!');

  const element = document.getElementById('test_div');
  if (element) {
    // Add the image to our existing div.
    const myIcon = new Image();
    myIcon.src = Icon;
    myIcon.width = 40;
    myIcon.height = 40;

    element.appendChild(myIcon);
  }

  import('./print2.js')
    .then(({ default: printJS }) => {
      printJS('from ts');
    })
    .catch((error) => 'An error occurred while loading the component');
}