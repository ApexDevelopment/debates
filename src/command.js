import Argument from "./argument.js";
import Option from "./option.js";

class Command {
	#name;
	#description;
	#version;
	#acceptedArguments;
	#acceptedOptions;
	#strict;
	#lastAdded;

	constructor(name, description = null, version = null) {
		this.#name = name;
		this.#description = description;
		this.#version = version;
		this.#acceptedArguments = [];
		this.#acceptedOptions = [];
		this.#strict = false;
		this.#lastAdded = null;
	}

	/**
	 * Sets the name of the command, or returns the name if no value is provided.
	 * @param {string} [name] The new name of the command.
	 * @returns {Command|string}
	 */
	name(name) {
		if (name) {
			this.#name = name;
			return this;
		}

		return this.#name;
	}

	/**
	 * Sets the description of the command, or returns the description if no value is provided.
	 * @param {string} [description] The new description of the command.
	 * @returns {Command|string}
	 */
	description(description) {
		if (description) {
			this.#description = description;
			return this;
		}

		return this.#description;
	}

	/**
	 * Sets the version of the command, or returns the version if no value is provided.
	 * @param {string} [version] The new version of the command.
	 * @returns {Command|string}
	 */
	version(version) {
		if (version) {
			this.#version = version;
			return this;
		}

		return this.#version;
	}

	/**
	 * Makes the command strict, meaning that it will only accept arguments and options that have been explicitly defined.
	 * @returns {Command}
	 */
	strict() {
		this.#strict = true;
		return this;
	}

	/**
	 * A convenience method for calling `accepts()` on the last option added.
	 * @param {string} type The type of value that the option accepts.
	 * @returns {Command}
	 */
	accepts(type) {
		if (this.#acceptedOptions.length < 1) {
			throw new Error("Cannot set accepted value without any options.");
		}

		this.#acceptedOptions[this.#acceptedOptions.length - 1].accepts(type);
		return this;
	}

	/**
	 * A convenience method for calling `required(true)` on the last option or argument added.
	 * @returns {Command}
	 */
	required() {
		if (this.#lastAdded === "option") {
			this.#acceptedOptions[this.#acceptedOptions.length - 1].required(true);
		}
		else if (this.#lastAdded === "argument") {
			this.#acceptedArguments[this.#acceptedArguments.length - 1].required(true);
		}
		else {
			throw new Error("Cannot set required without any options or arguments.");
		}

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
		this.#acceptedArguments.push(new Argument(name, description, required));
		this.#lastAdded = "argument";
		return this;
	}

	/**
	 * Adds a user-provided argument object to the command.
	 * @param {Argument} argument The argument to add.
	 * @returns {Command}
	 */
	addArgument(argument) {
		this.#acceptedArguments.push(argument);
		this.#lastAdded = "argument";
		return this;
	}

	/**
	 * Adds an option to the command.
	 * @param {string} name The name of the option.
	 * @param {string} [shorthand] The shorthand name of the option.
	 * @param {string} [description] The description of the option.
	 * @param {string} [type] The type of value the option accepts.
	 * @param {boolean} [required] Whether or not the option is required.
	 * @returns {Command}
	 */
	option(name, shorthand = null, description = null, type = null, required = false) {
		this.#acceptedOptions.push(new Option(name, shorthand, description, type, required));
		this.#lastAdded = "option";
		return this;
	}

	/**
	 * Adds a user-provided option object to the command.
	 * @param {Option} option The option to add.
	 * @returns {Command}
	 */
	addOption(option) {
		this.#acceptedOptions.push(option);
		this.#lastAdded = "option";
		return this;
	}

	/**
	 * Generates a help string for the command.
	 * @returns {string}
	 */
	helpString() {
		let helpString = `${this.#description}\n\nUsage: ${this.#name}`;
		let details = "";

		if (this.#acceptedArguments.length > 0) {
			details += "Arguments:\n";

			this.#acceptedArguments.forEach((argument) => {
				if (argument.required()) {
					helpString += ` <${argument.name()}>`;
				}
				else {
					helpString += ` [${argument.name()}]`;
				}

				details += `\t${argument.name()}\t${argument.description()}\n`;
			});
		}

		if (this.#acceptedOptions.length > 0) {
			if (details !== "") {
				details += "\n\n";
			}

			helpString += " [OPTIONS]";
			details += "Options:\n";

			this.#acceptedOptions.forEach((option) => {
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
		/**
		 * @readonly
		 * @enum {number}
		 */
		const ParseMode = {
			NORMAL: 0,
			NON_OPTIONS: 1,
			OPTION_VALUE: 2,
			OPTION_VALUE_STRING: 3
		}

		let parsed = {
			arguments: {},
			options: {},
			_: []
		}

		let args = input.split(" ");
		const isOption = (arg) => arg.startsWith("-");

		/**
		 * @type {Option}
		 */
		let option = null;

		/**
		 * @type {ParseMode}
		 */
		let mode = ParseMode.NORMAL;

		let stringValue = [];
		let argumentIndex = 0;
		let i = 0;

		while (i < args.length) {
			let arg = args[i];

			if (arg === "") {
				// Skip empty arguments
			}
			// In non-option mode, always add the argument to the list of extra arguments (_)
			else if (mode === ParseMode.NON_OPTIONS) {
				parsed._.push(arg);
			}
			// In option value mode, set the option to the value and return to normal mode
			else if (mode === ParseMode.OPTION_VALUE && option) {
				// Strings are special, because they can contain spaces if they're wrapped in quotes
				if (option.accepts() === "string" && arg.startsWith(`"`)) {
					// Try to avoid a fakeout by checking if the string ends with a quote
					if (arg.endsWith(`"`)) {
						parsed.options[option.name()] = arg.substring(1, arg.length - 1);
						mode = ParseMode.NORMAL;
					}
					else {
						// When we enter option value string mode, we have to clear the string value first
						stringValue = [];
						stringValue.push(arg.substring(1));
						mode = ParseMode.OPTION_VALUE_STRING;
					}
				}
				else if (option.validValue(arg)) {
					parsed.options[option.name()] = option.parseValue(arg);
					mode = ParseMode.NORMAL;
				}
				else {
					throw new Error(`Invalid value for option ${option.name()}: ${arg} (expected ${option.type()}))`);
				}
			}
			// In option value string mode, add the argument to the string value
			else if (mode === ParseMode.OPTION_VALUE_STRING && option) {
				// Exit string mode if the string ends with a quote
				if (arg.endsWith(`"`)) {
					stringValue.push(arg.substring(0, arg.length - 1));
					parsed.options[option.name()] = stringValue.join(" ");
					mode = ParseMode.NORMAL;
				}
				else {
					stringValue.push(arg);
				}
			}
			// In normal mode, if the argument is --, everything after it is an extra argument
			else if (arg === "--") {
				mode = ParseMode.NON_OPTIONS;
			}
			// Scan for options
			else if (isOption(arg)) {
				option = this.#acceptedOptions.find((option) => option.match(arg));

				// If this option accepts a value (option argument), search for it
				if (option && option.accepts()) {
					mode = ParseMode.OPTION_VALUE;
				}
				// Otherwise, set the option to true
				else if (option) {
					parsed.options[option.name()] = true;
				}
				// If the option is not recognized, throw an error or push it to _
				else if (this.#strict) {
					throw new Error(`Unknown option: ${arg}`);
				}
				else {
					parsed._.push(arg);
				}
			}
			// Scan for arguments (non-options)
			else if (argumentIndex < this.#acceptedArguments.length) {
				let argument = this.#acceptedArguments[argumentIndex];
				parsed.arguments[argument.name()] = arg;
				argumentIndex++;
			}
			// If the argument is not recognized, throw an error or push it to _
			else if (this.#strict) {
				throw new Error(`Unknown argument: ${arg}`);
			}
			else {
				parsed._.push(arg);
			}

			i++;
		}

		// Mark options that we didn't see as false, or throw an error if they're required
		this.#acceptedOptions.forEach((option) => {
			if (!parsed.options[option.name()]) {
				if (option.required()) {
					throw new Error(`Missing required option: ${option.name()}`);
				}

				parsed.options[option.name()] = false;
			}
		});

		// Check if we have all required arguments
		this.#acceptedArguments.forEach((argument) => {
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

export default Command;