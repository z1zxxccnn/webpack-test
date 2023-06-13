import { join } from 'lodash';

var worker = null;

export default function printJS(s) {
  console.log(join(['print 2', 'js', 'call', s], ' '));

  if (!worker) {
    console.log('js create worker')
    worker = new Worker(new URL('./deep-thought.ts', import.meta.url));
    worker.onmessage = ({ data: { answer } }) => {
      console.log(answer);
    };
  }
  worker.postMessage({
    question:
      'The Answer to the Ultimate Question of Life, The Universe, and Everything.',
  });
}