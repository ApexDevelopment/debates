# Debates

```
npm install debates
```

Debates is a very easy command parser. It can be used to parse CLI arguments with a little bit of pre-processing, but it is designed to take user input as a string directly.

This is an example of a simple "echo" command:
```JavaScript
const { Command } = require("debates");

let echo = new Command()
	.name("echo")
	.description("Echoes back what you type.")
	.version("1.0.0")
	.argument("message", "The message to echo back.");

const userInput = "hello";
const results = echo.parseSync(userInput);

console.log(results.arguments.message); // Should print "hello"
```

You may also use parse asynchronously (it is promise-based internally):
```JavaScript
const results = await echo.parse(userInput);

// ...or...

echo.parse(userInput).then((results) => {
	// ...
});
```

## Parse Results
Calling `parse()` or `parseSync()` will give back an object that contains what options and arguments were parsed. The structure of the object looks like this:
```JavaScript
{
	arguments: {...},
	options: {...},
	_: [...]
}
```

The `_` property contains extra options or arguments that were not defined in the command. In strict parsing mode, no extra options or arguments are allowed, they will cause a `throw`.

## Required Arguments
Options and arguments are optional by default. They can be made required like this:
```JavaScript
new Command()
	.argument("arg", "Some required argument", true);
// The third parameter to argument() specifies whether the argument is required.
```

Required arguments can be used to, for example, make the user enter an IP address or hostname to ping in a ping command. Required options however serve little purpose right now, as options cannot take a value in Debates (yet).

## Multiple Commands
Debates provides a `CommandHandler` class, in case you want to parse and differentiate between multiple different commands.
```JavaScript
const { Command, CommandHandler } = require("debates");

let command1 = new Command("command1", "Does something cool");
let command2 = new Command("command2", "Does something else");

let handler = new CommandHandler()
	.addCommand(command1)
	.addCommand(command2);

// CAUTION: This will be more than just a results object.
// It is actually a CommandParseResult, since you'll probably want to know which command was parsed.
let parseResult = handler.parseSync("command1 someargument --option");

// This should be "command1"
console.log(`Parsed command was: ${parseResult.command.name()}`);
console.log("The arguments passed were:", parseResult.results._);
```

`CommandParseResult` has only two members, `results` and `command`. The `results` object is the same as the one described above. `command` is the instance of `Command` that was parsed.

## Roadmap
Debates needs fleshing out. The following are features that are not yet supported, but that I am working on:
- [ ] Support for string arguments provided in quotes `"like this"`
- [ ] Support for options which take values `--like=this`
- [ ] Support for setting default values for arguments

Complete:
- [x] A method for generating a help string from a command