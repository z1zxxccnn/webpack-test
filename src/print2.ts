import { join } from 'lodash';

var worker: Worker | null = null;

export default function printTS(s: string) {
  console.log(join(['print 2', 'ts', 'call', s], ' '));

  if (!worker) {
    console.log('ts create worker')
    worker = new Worker(new URL('./deep-thought.js', import.meta.url));
    worker.onmessage = ({ data: { answer } }) => {
      console.log(answer);
    };
  }
  worker.postMessage({
    question:
      'The Answer to the Ultimate Question of Life, The Universe, and Everything.',
  });
}