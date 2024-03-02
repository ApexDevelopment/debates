import CommandParseResult from "./commandparseresult.js";

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
	 * Adds multiple commands to the handler.
	 * @param {...Command} commands The commands to add.
	 * @returns {CommandHandler}
	 */
	addCommands(...commands) {
		for (let command of commands) {
			this.addCommand(command);
		}
		
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

export default CommandHandler;