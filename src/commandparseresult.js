class CommandParseResult {
	constructor(command, results) {
		this.command = command; // The command that was parsed
		this.results = results; // The results of command.parseSync()
	}
}

export default CommandParseResult;