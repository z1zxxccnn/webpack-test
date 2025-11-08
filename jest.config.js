module.exports = {
  testEnvironment: 'jsdom',
  // Transforms tell jest how to process our non-javascript files.
  // Here we're using babel for .js and .jsx files, and ts-jest for
  // .ts and .tsx files.  You *can* just use babel-jest for both, if
  // you already have babel set up to compile typescript files.
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': ['ts-jest', {
      // Tell ts-jest about our typescript config.
      // You can specify a path to your tsconfig.json file,
      // but since we're compiling specifically for node here,
      // this works too.
      tsconfig: './tsconfig.json'
    }]
    // If you're using babel for both:
    // "^.+\\.[jt]sx?$": "babel-jest",
    // Here ts-jest will throw while babel-jest won't:
    // const str: string = 42
  },
  // In webpack projects, we often allow importing things like css files or
  // png files, and let a webpack loader plugin take care of loading these
  // resources. In a unit test, though, we're running in node.js which doesn't
  // know how to import these, so this tells jest what to do for these.
  moduleNameMapper: {
    // Resolve .css and similar files to identity-obj-proxy instead.
    '.+\\.(scss|css)$': 'identity-obj-proxy',
    // Resolve .png and similar files to __mocks__/file-mock.js
    '.+\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/src/__mocks__/file-mock.js'
  },
  // Tells Jest what folders to ignore for tests
  testPathIgnorePatterns: ['node_modules', 'native', 'dist']
}
