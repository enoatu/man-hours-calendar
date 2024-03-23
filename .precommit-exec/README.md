# .precommit-exec

## Description
This script ensures code quality by running commands before git commit. It's easy to use and can be added to any project.

## Usage
1. Place .precommit-exec under the root directory of your project and commit the changes.
2. Ask developers to run `cd .precommit-exec && yarn install` before starting work on the project.

## Customization
1. Modify lint-staged.config.js to add or replace the commands to run before precommit.
2. By default, the script includes eslint and prettier, but you can customize it as per your project's needs.

## References
- lint-staged: https://github.com/okonet/lint-staged
- husky: https://github.com/typicode/husky

## For Development
Example command to generate a release file:

```
rsync -a --delete --exclude '.git/' --exclude 'node_modules/' . /tmp/precommit-exec && cd /tmp && zip -r precommit-exec-v1.0.0.zip precommit-exec
```

This command uses `rsync` to synchronize the contents of the project directory to `/tmp/precommit-exec`, excluding the `.git/` and `node_modules/` directories. It then creates a zip archive of the precommit-exec directory. You can adjust the version number and archive filename as necessary.
