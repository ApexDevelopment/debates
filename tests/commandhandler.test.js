const { Command, CommandHandler } = require("../index.js");

test("CommandHandler constructor", () => {
	const handler = new CommandHandler();
	expect(Object.keys(handler.commands).length).toBe(0);
});

test("CommandHandler addCommand", () => {
	const handler = new CommandHandler();
	const cmd = new Command("cmd");
	handler.addCommand(cmd);
	expect(Object.keys(handler.commands).length).toBe(1);
	expect(handler.commands.cmd).toBe(cmd);
});

test("CommandHandler parseSync", () => {
	const handler = new CommandHandler();
	const cmd = new Command("cmd");
	const cmd2 = new Command("cmd2");
	handler.addCommand(cmd);
	handler.addCommand(cmd2);
	const commandParseResult = handler.parseSync("cmd2");
	expect(commandParseResult.command).toBe(cmd2);
	expect(commandParseResult.results.arguments).toEqual({});
	expect(commandParseResult.results.options).toEqual({});
});