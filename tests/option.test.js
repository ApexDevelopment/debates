import Option from "../src/option.js";

test("Option default constructor", () => {
	const opt = new Option("opt");
	expect(opt.name()).toBe("opt");
	expect(opt.shorthand()).toBe(null);
	expect(opt.description()).toBe(null);
	expect(opt.accepts()).toBe(null);
	expect(opt.defaultsTo()).toBe(null);
	expect(opt.required()).toBe(false);
});

test("Option constructor", () => {
	const opt = new Option("opt", "o", "description", "string", null, true);
	expect(opt.name()).toBe("opt");
	expect(opt.shorthand()).toBe("o");
	expect(opt.description()).toBe("description");
	expect(opt.accepts()).toBe("string");
	expect(opt.defaultsTo()).toBe(null);
	expect(opt.required()).toBe(true);
});

test("Option constructor failure", () => {
	expect(() => {
		const opt = new Option("opt", "o", "description", "string", "default", true);
	}).toThrow();
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

test("Option defaultsTo", () => {
	const opt = new Option("opt");
	opt.accepts("string");
	opt.defaultsTo("default");
	expect(opt.defaultsTo()).toBe("default");
});

test("Option defaultsTo required", () => {
	const opt = new Option("opt");
	opt.required(true);
	expect(() => {
		opt.defaultsTo("default");
	}).toThrow();
});

test("Option defaultsTo invalid type", () => {
	const opt = new Option("opt");
	opt.accepts("integer");
	expect(() => {
		opt.defaultsTo("default");
	}).toThrow();
});

test("Option defaultsTo when option is a flag", () => {
	const opt = new Option("opt");
	expect(() => {
		opt.defaultsTo("default");
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
	expect(opt.matchLong("--opt")).toBe(true);
	expect(opt.matchShort("-o")).toBe(true);
});

test("Option match failure", () => {
	const opt = new Option("opt", "o");
	expect(opt.matchLong("--opt2")).toBe(false);
	expect(opt.matchShort("-a")).toBe(false);
});

test("Option group match success", () => {
	const opt = new Option("opt", "o");
	expect(opt.matchShort("-oabc")).toBe(true);
	expect(opt.matchShort("-abco")).toBe(true);
});

test("Option group match failure", () => {
	const opt = new Option("opt", "o");
	expect(opt.matchShort("-abc")).toBe(false);
});