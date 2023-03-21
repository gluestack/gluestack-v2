# CLI Tool built using CommanderJS & Typescript

## That Autoloads commands from a directory

1. You can register your new commands in `commands/` directory
2. All commmands are attached with an action, which I usually keep in an `actions/` directory
3. I have added few helpers which you might need, I will add their details below -
  - execute: Helper function to execute a command on your CLI
  - exit-with-msg: Helper function to print a message and exit the CLI with a code
  - fs-exists: Helper function to check if a file exists
  - fs-readfile: Helper function to read file contents
  - typeof: Helper function to returns the type of the value passed in

## Scripts

```sh
# Install npm dependencies
$ npm install

# Create your build
$ npm run build

# Run a watcher that builds your active development changes
$ npm run watch

# Publish your cli tool locally
$ npm link
```

## Registered CLI Commands

```sh
# Sample command with a choice option and a mandatory argument
$ node build/index run:first --help

# Basic sample command
$ node build/index run --help
```
