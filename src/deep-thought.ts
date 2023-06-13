// Chrome needs to be started with --allow-file-access-from-files for local file web workers.
self.onmessage = ({ data: { question } }) => {
  console.log(question)
  self.postMessage({
    answer: 42,
  });
};