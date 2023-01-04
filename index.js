class Argument {
	constructor(name, description = null, required = false) {
		this._name = name;
		this._description = description;
		this._required = required;
	}

	name(name) {
		if (name) {
			this._name = name;
			return this;
		}

		return this._name;
	}

	description(description) {
		if (description) {
			this._description = description;
			return this;
		}

		return this._description;
	}

	required(required) {
		if (typeof required === "boolean") {
			this._required = required;
			return this;
		}

		return this._required;
	}
}

class Option {
	constructor(name, shorthand = null, description = null, required = false) {
		this._name = name;
		this._shorthand = shorthand;
		this._description = description;
		this._required = required;
	}

	name(name) {
		if (name) {
			this._name = name;
			return this;
		}

		return this._name;
	}

	shorthand(shorthand) {
		if (shorthand) {
			this._shorthand = shorthand;
			return this;
		}

		return this._shorthand;
	}

	description(description) {
		if (description) {
			this._description = description;
			return this;
		}

		return this._description;
	}

	required(required) {
		if (typeof required === "boolean") {
			this._required = required;
			return this;
		}

		return this._required;
	}

	match(arg) {
		return arg === `--${this._name}` || arg === `-${this._shorthand}`;
	}
}

class Command {
	constructor(name = null, description = null, version = null) {
		this._name = name;
		this._description = description;
		this._version = version;
		this._acceptedArguments = [];
		this._acceptedOptions = [];
	}

	name(name) {
		if (name) {
			this._name = name;
			return this;
		}

		return this._name;
	}

	description(description) {
		if (description) {
			this._description = description;
			return this;
		}

		return this._description;
	}

	version(version) {
		if (version) {
			this._version = version;
			return this;
		}

		return this._version;
	}

	argument(name, description = null, required = false) {
		this._acceptedArguments.push(new Argument(name, description, required));
		return this;
	}

	addArgument(argument) {
		this._acceptedArguments.push(argument);
		return this;
	}

	option(name, shorthand = null, description = null, required = false) {
		this._acceptedOptions.push(new Option(name, shorthand, description, required));
		return this;
	}

	addOption(option) {
		this._acceptedOptions.push(option);
		return this;
	}

	parseSync(input) {
		let parsed = {
			arguments: {},
			options: {}
		}

		let args = input.split(" ");
		const isOption = (arg) => arg.startsWith("-");

		let argumentIndex = 0;
		let i = 0;
		while (i < args.length) {
			let arg = args[i];
			if (arg === "") {
				// Skip empty arguments
			}
			else if (isOption(arg)) {
				let option = this._acceptedOptions.find((option) => option.match(arg));
				if (option) {
					parsed.options[option.name()] = true;
				}
				else {
					throw new Error(`Unknown option: ${arg}`);
				}
			}
			else if (argumentIndex < this._acceptedArguments.length) {
				let argument = this._acceptedArguments[argumentIndex];
				parsed.arguments[argument.name()] = arg;
				argumentIndex++;
			}
			else {
				throw new Error(`Unknown argument: ${arg}`);
			}
			i++;
		}

		// Mark options that we didn't see as false
		this._acceptedOptions.forEach((option) => {
			if (!parsed.options[option.name()]) {
				parsed.options[option.name()] = false;
			}
		});

		return parsed;
	}

	parse(input) {
		return new Promise((resolve, reject) => {
			resolve(this.parseSync(input));
		});
	}
}

class CommandParseResult {
	constructor(command, results) {
		this.command = command;
		this.results = results;
	}
}

class CommandHandler {
	constructor() {
		this.commands = {};
	}

	addCommand(command) {
		this.commands[command.name()] = command;
		return this;
	}

	parseSync(input) {
		let args = input.split(" ");
		let command = args.shift();
		if (this.commands[command]) {
			return new CommandParseResult(this.commands[command], this.commands[command].parseSync(args.join(" ")));
		} else {
			return null;
		}
	}

	parse(input) {
		return new Promise((resolve, reject) => {
			resolve(this.parseSync(input));
		});
	}
}

module.exports = { Argument, Option, Command, CommandHandler };