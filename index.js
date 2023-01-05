class Argument {
	constructor(name, description = null, required = false) {
		this._name = name;
		this._description = description;
		this._required = required;
	}

	/**
	 * Sets the name of the argument, or returns the name if no value is provided.
	 * @param {string} [name] The new name of the argument.
	 * @returns {Argument|string}
	 */
	name(name) {
		if (name) {
			this._name = name;
			return this;
		}

		return this._name;
	}

	/**
	 * Sets the description of the argument, or returns the description if no value is provided.
	 * @param {string} [description] The new description of the argument.
	 * @returns {Argument|string}
	 */
	description(description) {
		if (description) {
			this._description = description;
			return this;
		}

		return this._description;
	}

	/**
	 * Sets whether or not the argument is required, or returns whether or not the argument is required if no value is provided.
	 * @param {boolean} [required] Whether or not the argument is required.
	 * @returns {Argument|boolean}
	 */
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

	/**
	 * Sets the name of the option, or returns the name if no value is provided.
	 * @param {string} [name] The new name of the option.
	 * @returns {Option|string}
	 */
	name(name) {
		if (name) {
			this._name = name;
			return this;
		}

		return this._name;
	}

	/**
	 * Sets the shorthand name of the option, or returns the shorthand if no value is provided.
	 * @param {string} [shorthand] The new shorthand name of the option.
	 * @returns {Option|string}
	 */
	shorthand(shorthand) {
		if (shorthand) {
			this._shorthand = shorthand;
			return this;
		}

		return this._shorthand;
	}

	/**
	 * Sets the description of the option, or returns the description if no value is provided.
	 * @param {string} [description] The new description of the option.
	 * @returns {Option|string}
	 */
	description(description) {
		if (description) {
			this._description = description;
			return this;
		}

		return this._description;
	}

	/**
	 * Sets whether or not the option is required, or returns whether or not the option is required if no value is provided.
	 * @param {boolean} [required] Whether or not the option is required.
	 * @returns {Option|boolean}
	 */
	required(required) {
		if (typeof required === "boolean") {
			this._required = required;
			return this;
		}

		return this._required;
	}

	/**
	 * Checks if the provided argument matches this option.
	 * @param {string} arg The argument to check.
	 * @returns {boolean}
	 */
	match(arg) {
		return arg === `--${this._name}` || arg === `-${this._shorthand}`;
	}
}

class Command {
	constructor(name, description = null, version = null) {
		this._name = name;
		this._description = description;
		this._version = version;
		this._acceptedArguments = [];
		this._acceptedOptions = [];
		this._strict = false;
	}

	/**
	 * Sets the name of the command, or returns the name if no value is provided.
	 * @param {string} [name] The new name of the command.
	 * @returns {Command|string}
	 */
	name(name) {
		if (name) {
			this._name = name;
			return this;
		}

		return this._name;
	}

	/**
	 * Sets the description of the command, or returns the description if no value is provided.
	 * @param {string} [description] The new description of the command.
	 * @returns {Command|string}
	 */
	description(description) {
		if (description) {
			this._description = description;
			return this;
		}

		return this._description;
	}

	/**
	 * Sets the version of the command, or returns the version if no value is provided.
	 * @param {string} [version] The new version of the command.
	 * @returns {Command|string}
	 */
	version(version) {
		if (version) {
			this._version = version;
			return this;
		}

		return this._version;
	}

	/**
	 * Makes the command strict, meaning that it will only accept arguments and options that have been explicitly defined.
	 * @returns {Command}
	 */
	strict() {
		this._strict = true;
		return this;
	}

	/**
	 * Adds an argument to the command.
	 * @param {string} name The name of the argument.
	 * @param {string} [description] The description of the argument.
	 * @param {boolean} [required] Whether or not the argument is required.
	 * @returns {Command}
	 */
	argument(name, description = null, required = false) {
		this._acceptedArguments.push(new Argument(name, description, required));
		return this;
	}

	/**
	 * Adds a user-provided argument object to the command.
	 * @param {Argument} argument The argument to add.
	 * @returns {Command}
	 */
	addArgument(argument) {
		this._acceptedArguments.push(argument);
		return this;
	}

	/**
	 * Adds an option to the command.
	 * @param {string} name The name of the option.
	 * @param {string} [shorthand] The shorthand name of the option.
	 * @param {string} [description] The description of the option.
	 * @param {boolean} [required] Whether or not the option is required.
	 * @returns {Command}
	 */
	option(name, shorthand = null, description = null, required = false) {
		this._acceptedOptions.push(new Option(name, shorthand, description, required));
		return this;
	}

	/**
	 * Adds a user-provided option object to the command.
	 * @param {Option} option The option to add.
	 * @returns {Command}
	 */
	addOption(option) {
		this._acceptedOptions.push(option);
		return this;
	}

	/**
	 * Generates a help string for the command.
	 * @returns {string}
	 */
	helpString() {
		let helpString = `${this._description}\n\nUsage: ${this._name}`;
		let details = "";

		if (this._acceptedArguments.length > 0) {
			details += "Arguments:\n";

			this._acceptedArguments.forEach((argument) => {
				if (argument.required()) {
					helpString += ` <${argument.name()}>`;
				}
				else {
					helpString += ` [${argument.name()}]`;
				}

				details += `\t${argument.name()}\t${argument.description()}\n`;
			});
		}

		if (this._acceptedOptions.length > 0) {
			if (details !== "") {
				details += "\n\n";
			}

			helpString += " [OPTIONS]";
			details += "Options:\n";

			this._acceptedOptions.forEach((option) => {
				details += "\t"
				
				if (option.shorthand()) {
					details += `-${option.shorthand()}, `;
				}
				details += `--${option.name()}\t${option.description()}\n`;
			});
		}

		return helpString + "\n\n" + details;
	}

	parseSync(input) {
		let parsed = {
			arguments: {},
			options: {},
			_: []
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
				else if (this._strict) {
					throw new Error(`Unknown option: ${arg}`);
				}
				else {
					parsed._.push(arg);
				}
			}
			else if (argumentIndex < this._acceptedArguments.length) {
				let argument = this._acceptedArguments[argumentIndex];
				parsed.arguments[argument.name()] = arg;
				argumentIndex++;
			}
			else if (this._strict) {
				throw new Error(`Unknown argument: ${arg}`);
			}
			else {
				parsed._.push(arg);
			}

			i++;
		}

		// Mark options that we didn't see as false, or throw an error if they're required
		this._acceptedOptions.forEach((option) => {
			if (!parsed.options[option.name()]) {
				if (option.required()) {
					throw new Error(`Missing required option: ${option.name()}`);
				}

				parsed.options[option.name()] = false;
			}
		});

		// Check if we have all required arguments
		this._acceptedArguments.forEach((argument) => {
			if (!parsed.arguments[argument.name()] && argument.required()) {
				throw new Error(`Missing required argument: ${argument.name()}`);
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
		this.command = command; // The command that was parsed
		this.results = results; // The results of command.parseSync()
	}
}

class CommandHandler {
	constructor() {
		this.commands = {};
	}

	/**
	 * Adds a command to the handler.
	 * @param {Command} command The command to add.
	 * @returns {CommandHandler}
	 */
	addCommand(command) {
		this.commands[command.name()] = command;
		return this;
	}

	/**
	 * Parses a command string, determining which command to parse automatically.
	 * @param {string} input The command string to parse.
	 * @returns {CommandParseResult|null} The result of the parse, or null if no command was found.
	 */
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