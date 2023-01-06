const { Option } = require("../index.js");

test("Option default constructor", () => {
	const opt = new Option("opt");
	expect(opt.name()).toBe("opt");
	expect(opt.shorthand()).toBe(null);
	expect(opt.description()).toBe(null);
	expect(opt.accepts()).toBe(null);
	expect(opt.required()).toBe(false);
});

test("Option constructor", () => {
	const opt = new Option("opt", "o", "description", "string", true);
	expect(opt.name()).toBe("opt");
	expect(opt.shorthand()).toBe("o");
	expect(opt.description()).toBe("description");
	expect(opt.accepts()).toBe("string");
	expect(opt.required()).toBe(true);
});

test("Option name", () => {
	const opt = new Option("opt");
	opt.name("opt2");
	expect(opt.name()).toBe("opt2");
});

test("Option shorthand", () => {
	const opt = new Option("opt");
	opt.shorthand("o");
	expect(opt.shorthand()).toBe("o");
});

test("Option description", () => {
	const opt = new Option("opt");
	opt.description("description2");
	expect(opt.description()).toBe("description2");
});

test("Option accepts", () => {
	const opt = new Option("opt");
	opt.accepts("string");
	expect(opt.accepts()).toBe("string");
	opt.accepts("integer");
	expect(opt.accepts()).toBe("integer");
	opt.accepts("float");
	expect(opt.accepts()).toBe("float");

	expect(() => {
		opt.accepts("bogus");
	}).toThrow();
});

test("Option required", () => {
	const opt = new Option("opt");
	opt.required(true);
	expect(opt.required()).toBe(true);
	opt.required(false);
	expect(opt.required()).toBe(false);
});

test("Option match success", () => {
	const opt = new Option("opt", "o");
	expect(opt.match("--opt")).toBe(true);
	expect(opt.match("-o")).toBe(true);
});

test("Option match failure", () => {
	const opt = new Option("opt", "o");
	expect(opt.match("--opt2")).toBe(false);
	expect(opt.match("-o2")).toBe(false);
});