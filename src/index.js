import './style.css';
import CsvData from './data.csv';
import { test_react_js } from './testreact.jsx';
import { test_react_ts } from './testreact.tsx';

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js').then(registration => {
//       console.log('SW registered: ', registration);
//     }).catch(registrationError => {
//       console.log('SW registration failed: ', registrationError);
//     });
//   });
// }

window.g_testCsvData = CsvData

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

  const e_react_js = document.createElement('div');
  e_react_js.id = 'e_react_js'
  element.appendChild(e_react_js);

  const e_react_ts = document.createElement('div');
  e_react_ts.id = 'e_react_ts'
  element.appendChild(e_react_ts);

  document.body.appendChild(element);

  test_react_js('e_react_js')
  test_react_ts('e_react_ts')
}

//component();

import { main_entry } from './mainapp/entry'

main_entry()
