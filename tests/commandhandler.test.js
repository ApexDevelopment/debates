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