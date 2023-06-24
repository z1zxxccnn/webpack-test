// Chrome needs to be started with --allow-file-access-from-files
// for local file web workers.
onmessage = ({ data: { question } }) => {
  console.log(question)
  postMessage({
    answer: 42
  })
}
