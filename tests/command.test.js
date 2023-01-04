const { Command } = require("../index.js");

test("Command default constructor", () => {
	const cmd = new Command();
	expect(cmd.name()).toBe(null);
	expect(cmd.description()).toBe(null);
	expect(cmd.version()).toBe(null);
});

test("Command constructor", () => {
	const cmd = new Command("cmd", "description", "1.0.0");
	expect(cmd.name()).toBe("cmd");
	expect(cmd.description()).toBe("description");
	expect(cmd.version()).toBe("1.0.0");
});

test("Command name", () => {
	const cmd = new Command("cmd");
	cmd.name("cmd2");
	expect(cmd.name()).toBe("cmd2");
});

test("Command description", () => {
	const cmd = new Command("cmd");
	cmd.description("description2");
	expect(cmd.description()).toBe("description2");
});

test("Command version", () => {
	const cmd = new Command("cmd");
	cmd.version("1.0.0");
	expect(cmd.version()).toBe("1.0.0");
});

test("Command parse with one argument", () => {
	const cmd = new Command("cmd")
		.argument("arg1", "description", true);
	const results = cmd.parseSync("arg1value");

	expect(Object.keys(results.arguments).length).toBe(1);
	expect(results.arguments.arg1).toBe("arg1value");
});

test("Command parse with two arguments", () => {
	const cmd = new Command("cmd")
		.argument("arg1", "description", true)
		.argument("arg2", "description", true);
	const results = cmd.parseSync("arg1value arg2value");

	expect(Object.keys(results.arguments).length).toBe(2);
	expect(results.arguments.arg1).toBe("arg1value");
	expect(results.arguments.arg2).toBe("arg2value");
});

test("Command parse with one option", () => {
	const cmd = new Command("cmd")
		.option("option1", "o", "description", true);
	const results = cmd.parseSync("--option1");

	expect(Object.keys(results.options).length).toBe(1);
	expect(results.options.option1).toBe(true);

	const results2 = cmd.parseSync("-o");

	expect(Object.keys(results2.options).length).toBe(1);
	expect(results2.options.option1).toBe(true);
});

test("Command parse with two options", () => {
	const cmd = new Command("cmd")
		.option("option1", "o", "description", true)
		.option("option2", "p", "description", true);
	const results = cmd.parseSync("--option1 --option2");

	expect(Object.keys(results.options).length).toBe(2);
	expect(results.options.option1).toBe(true);
	expect(results.options.option2).toBe(true);

	const results2 = cmd.parseSync("-o -p");

	expect(Object.keys(results2.options).length).toBe(2);
	expect(results2.options.option1).toBe(true);
	expect(results2.options.option2).toBe(true);
});

test("Command parse with one option and one argument", () => {
	const cmd = new Command("cmd")
		.option("option1", "o", "description", true)
		.argument("arg1", "description", true);
	const results = cmd.parseSync("--option1 arg1value");

	expect(Object.keys(results.options).length).toBe(1);
	expect(results.options.option1).toBe(true);
	expect(Object.keys(results.arguments).length).toBe(1);
	expect(results.arguments.arg1).toBe("arg1value");
});

test("Command parse with non-required option", () => {
	const cmd = new Command("cmd")
		.option("option1", "o", "description", false);
	const results = cmd.parseSync("");

	expect(Object.keys(results.options).length).toBe(1);
	expect(results.options.option1).toBe(false);
});