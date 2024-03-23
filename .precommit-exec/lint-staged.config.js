module.exports = {
  "../**/*.{js,ts,mjs,jsx,tsx,vue}": [
    (filenames) => `yarn eslint --fix --config .eslintrc.yml ${filenames.join(' ')}`,
    (filenames) => `yarn prettier --write --config .prettierrc.json ${filenames.join(' ')}`,
  ],
  // '../**/*.go': [
  //   'cd .. && gofmt -w',
  //   'cd .. && goimports -w'
  // ],
}
