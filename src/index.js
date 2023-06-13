import './style.css';
import CsvData from './data.csv';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

window.g_testCsvData = CsvData

var worker = null;

function btnOnClick() {
  import('./print.js')
    .then(({ default: printMe }) => {
      printMe()
    })
    .catch((error) => 'An error occurred while loading the component');
  import('./print.ts')
    .then(({ default: printMe }) => {
      printMe()
    })
    .catch((error) => 'An error occurred while loading the component');
}

function component() {
  const element = document.createElement('div');
  element.id = 'test_div'

  // Lodash, now imported by this script
  element.innerHTML = 'Hello webpack';
  element.classList.add('hello');

  const btn = document.createElement('button');
  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = btnOnClick;

  element.appendChild(btn);

  return element;
}

document.body.appendChild(component());
