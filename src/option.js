class Option {
	#name;
	#shorthand;
	#description;
	#default;
	#required;
	#accepts;
	
	constructor(name, shorthand = null, description = null, accepts = null, defaultValue = null, required = false) {
		if (required && defaultValue) {
			throw new Error("Cannot set a default value for a required option.");
		}

		this.#name = name;
		this.#shorthand = shorthand;
		this.#description = description;
		this.#default = defaultValue;
		this.#required = required;
		this.#accepts = accepts;
	}

	/**
	 * Sets the name of the option, or returns the name if no value is provided.
	 * @param {string} [name] The new name of the option.
	 * @returns {Option|string}
	 */
	name(name) {
		if (name) {
			this.#name = name;
			return this;
		}

		return this.#name;
	}

	/**
	 * Sets the shorthand name of the option, or returns the shorthand if no value is provided.
	 * @param {string} [shorthand] The new shorthand name of the option.
	 * @returns {Option|string}
	 */
	shorthand(shorthand) {
		if (shorthand) {
			this.#shorthand = shorthand;
			return this;
		}

		return this.#shorthand;
	}

	/**
	 * Sets the description of the option, or returns the description if no value is provided.
	 * @param {string} [description] The new description of the option.
	 * @returns {Option|string}
	 */
	description(description) {
		if (description) {
			this.#description = description;
			return this;
		}

		return this.#description;
	}

	/**
	 * Sets the default value of the option, or returns the default value if no value is provided.
	 * @param {any} defaultValue The default value of the option.
	 * @returns {Option|any}
	 */
	defaultsTo(defaultValue) {
		if (defaultValue) {
			if (this.#required) {
				throw new Error("Cannot set a default value for a required option.");
			}
			else if (this.#accepts && !this.validValue(defaultValue)) {
				throw new Error("Invalid default value for option.");
			}
			else if (!this.#accepts && typeof defaultValue !== "boolean") {
				throw new Error("Cannot use a non-boolean default value for a flag option.");
			}

			this.#default = defaultValue;
			return this;
		}

		return this.#default;
	}

	/**
	 * Sets the type of value that the option accepts, or returns the type if no value is provided.
	 * If `accepts()` is never called, the option will not accept any value, and will be treated as a boolean flag.
	 * @param {"string"|"integer"|"float"} [type] The new type of value that the option accepts.
	 * @returns {Option|string}
	 */
	accepts(type) {
		if (type) {
			if (type !== "string" && type !== "integer" && type !== "float") {
				throw new Error(`Invalid option type "${type}".`);
			}

			this.#accepts = type;
			return this;
		}

		return this.#accepts;
	}

	/**
	 * Sets whether or not the option is required, or returns whether or not the option is required if no value is provided.
	 * @param {boolean} [required] Whether or not the option is required.
	 * @returns {Option|boolean}
	 */
	required(required) {
		if (typeof required === "boolean") {
			if (required && this.#default) {
				throw new Error("Cannot set an option as required if it has a default value.");
			}

			this.#required = required;
			return this;
		}

		return this.#required;
	}

	/**
	 * Checks if the provided argument matches this option's full name.
	 * @param {string} arg The argument to check.
	 * @returns {boolean}
	 */
	matchLong(arg) {
		return arg === `--${this.#name}`;
	}

	/**
	 * Checks if the provided argument matches this option's shorthand name.
	 * @param {string} arg The argument to check.
	 * @returns {boolean}
	 */
	matchShort(arg) {
		return arg.indexOf(`${this.#shorthand}`) !== -1;
	}

	validValue(value) {
		if (this.#accepts === "string") {
			return typeof value === "string";
		}
		else if (this.#accepts === "integer") {
			if (typeof value === "string") {
				value = parseFloat(value);
			}
			return Number.isInteger(value);
		}
		else if (this.#accepts === "float") {
			if (typeof value === "string") {
				value = parseFloat(value);
			}
			return !Number.isNaN(value);
		}

		return false;
	}

	parseValue(value) {
		if (this.#accepts === "integer") {
			return parseInt(value);
		}
		else if (this.#accepts === "float") {
			return parseFloat(value);
		}

		return value;
	}
}

export default Option;