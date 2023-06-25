import './style.css'
import CsvData from './data.csv'
import { testReactJs } from './testreact.jsx'
import { testReactTs } from './testreact.tsx'

import { mainEntry } from './mainapp/entry'

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js')
//       .then(registration => {
//         console.log('SW registered: ', registration);
//       })
//       .catch(registrationError => {
//         console.log('SW registration failed: ', registrationError);
//       });
//   });
// }

window.g_testCsvData = CsvData

function btnOnClick () {
  import('./print.js')
    .then(({ default: printMe }) => {
      printMe()
    })
    .catch((error) => {
      console.log('An error occurred while loading print.js: ', error)
    })
  import('./print.ts')
    .then(({ default: printMe }) => {
      printMe()
    })
    .catch((error) => {
      console.log('An error occurred while loading print.ts: ', error)
    })
}

// eslint-disable-next-line no-unused-vars
function component () {
  const element = document.createElement('div')
  element.id = 'test_div'

  // Lodash, now imported by this script
  element.innerHTML = 'Hello webpack'
  element.classList.add('hello')

  const btn = document.createElement('button')
  btn.innerHTML = 'Click me and check the console!'
  btn.onclick = btnOnClick

  element.appendChild(btn)

  const eReactJs = document.createElement('div')
  eReactJs.id = 'e_react_js'
  element.appendChild(eReactJs)

  const eReactTs = document.createElement('div')
  eReactTs.id = 'e_react_ts'
  element.appendChild(eReactTs)

  document.body.appendChild(element)

  testReactJs('e_react_js')
  testReactTs('e_react_ts')
}

// component()

mainEntry()
