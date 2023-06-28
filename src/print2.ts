import { join } from 'lodash'

let worker: null | Worker = null

export function printTS (s: string): void {
  console.log(join(['print 2', 'ts', 'call', s], ' '))

  if (worker === null) {
    console.log('ts create worker')
    worker = new Worker(new URL('./deep-thought.js', import.meta.url))
    worker.onmessage = ({ data: { answer } }) => {
      console.log('from deep-thought.js', answer)
    }
  }
  worker.postMessage({
    question:
      'The Answer to the Ultimate Question of Life, ' +
      'The Universe, and Everything, from print2.ts.'
  })
}
