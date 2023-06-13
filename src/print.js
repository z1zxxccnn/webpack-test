import Icon from './icon.svg';

export default function printMe() {
  console.log('I get called from print.js!');

  const element = document.getElementById('test_div');
  if (element) {
    // Add the image to our existing div.
    const myIcon = new Image();
    myIcon.src = Icon;
    myIcon.width = 40;
    myIcon.height = 40;

    element.appendChild(myIcon);
  }

  import('./print2.ts')
    .then(({ default: printTS }) => {
      printTS('from js');
    })
    .catch((error) => 'An error occurred while loading the component');
}