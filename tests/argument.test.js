import Argument from "../src/argument.js";

test("Argument default constructor", () => {
	const arg = new Argument("arg");
	expect(arg.name()).toBe("arg");
	expect(arg.description()).toBe(null);
	expect(arg.defaultsTo()).toBe(null);
	expect(arg.required()).toBe(false);
});

test("Argument constructor", () => {
	const arg = new Argument("arg", "description", null, true);
	expect(arg.name()).toBe("arg");
	expect(arg.description()).toBe("description");
	expect(arg.defaultsTo()).toBe(null);
	expect(arg.required()).toBe(true);
});

test("Argument constructor failure", () => {
	expect(() => {
		const arg = new Argument("arg", "description", "default", true);
	}).toThrow();
});

test("Argument name", () => {
	const arg = new Argument("arg");
	arg.name("arg2");
	expect(arg.name()).toBe("arg2");
});

test("Argument description", () => {
	const arg = new Argument("arg");
	arg.description("description2");
	expect(arg.description()).toBe("description2");
});

test("Argument defaultsTo", () => {
	const arg = new Argument("arg");
	arg.defaultsTo("default");
	expect(arg.defaultsTo()).toBe("default");
});

test("Argument required", () => {
	const arg = new Argument("arg");
	arg.required(true);
	expect(arg.required()).toBe(true);
	arg.required(false);
	expect(arg.required()).toBe(false);
});