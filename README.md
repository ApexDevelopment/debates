# Debates

```
npm install debates
```

Debates is a very easy command parser. It can be used to parse CLI arguments with a little bit of pre-processing, but it is designed to take user input as a string directly.

- [Debates](#debates)
  - [Example](#example)
  - [Parse Results](#parse-results)
  - [Option Values](#option-values)
  - [Required Arguments and Options](#required-arguments-and-options)
  - [Multiple Commands](#multiple-commands)
  - [Roadmap](#roadmap)

## Example
This is an example of a simple "echo" command:
```JavaScript
import { Command } from "debates";

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
	arguments: { /* ... */ },
	options: { /* ... */ },
	_: [ /* ... */ ]
}
```

The full (long) name of the options are used as the keys to the options object.

The `_` property contains extra options or arguments that were not defined in the command. In strict parsing mode, no extra options or arguments are allowed, they will cause a `throw`.

## Option Values
Also known as option arguments, options can take a value, e.g. when you do something like `ping -n 300 google.com`, in which case the option "n" has a value of 300. Debates supports this:
```JavaScript
new Command()
	.option("option", "o", "Some option").accepts("string");
	// Options can accept "string", "integer", or "float"
```

Options (and arguments) can also have default values:
```JavaScript
new Command()
	.option("option", "o", "Some option").accepts("string").defaultsTo("foo");
```

You **cannot** provide a default value if the option is required. The default value **must** match the type that the option accepts. If `accepts()` is specified, but no default value is provided, the default value will be `false` to indicate that the option was not provided.

You can use this behavior to discern whether the user provided a value for the option:

```JavaScript
let pingCommand = new Command("ping")
	.option("repeat", "n", "Ping the host n times. If not provided, will ping forever.").accepts("integer");
	.argument("hostname", "The hostname to ping.");

let results = pingCommand.parse("google.com");

if (!results.options.repeat) {
	console.log("-n not specified, pinging forever...");
	/* ... */
}
```

## Required Arguments and Options
Options and arguments are optional by default.
```JavaScript
new Command()
	.argument("arg", "Some required argument").required();
```

Required arguments can be used to, for example, make the user enter an IP address or hostname to ping in a ping command.

`required()` and `accepts()` can be chained together. For readability, it is recommended to keep them on the same line as the argument or option they modify, because you may also continue to chain calls to `argument()` and `option()`.

As stated earlier, `required()` cannot be combined with `defaultsTo()`.
```JavaScript
// THIS WILL THROW AN ERROR:
new Command()
	.argument("arg", "Some required argument").required().defaultsTo("default");
```

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
Debates is now as feature-complete as I originally intended it to be. Feature releases are not expected for the forseeable future. If you would like a new feature, please request it on the GitHub issues page.

Complete:
- [x] Option grouping (e.g. `-abcd` == `-a -b -c -d`)
- [x] Support for setting default values for arguments
- [x] A method for generating a help string from a command
- [x] Support for options which take values `--like this`
- [x] Support for string arguments provided in quotes `"like this"` (currently only supported in option arguments, unsure if I will go any further)