# Debates

```
npm install debates
```

Debates is a very easy command parser. It can be used to parse CLI arguments with a little bit of pre-processing, but it is designed to take user input as a string directly.

Here is an example of a simple "ping" command.
```JavaScript
const { Command } = require("debates");

let pingCommand = new Command()
	.name("ping")
	.description("Echoes back what you type.")
	.version("1.0.0")
	.argument("message", "The message to echo back.");

const userInput = "hello";
const results = pingCommand.parseSync(userInput);
/**
 * "results" is an object structured like this:
 * {
 * 	arguments: {...},
 * 	options: {...}
 * }
 */

console.log(results.arguments.message); // Should print "hello"
```

You may also use parse asynchronously (it is promise-based internally):
```JavaScript
const results = await pingCommand.parse(userInput);

// ...or...

pingCommand.parse(userInput).then((results) => {
	// ...
});
```

## Roadmap
Debates needs fleshing out. The following are features that are not yet supported, but that I am working on:
- [ ] Support for string arguments `"like this"`
- [ ] Support for options which take values `--like=this`
- [ ] A method for generating a help string from a command