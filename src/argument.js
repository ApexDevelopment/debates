class Argument {
	#name;
	#description;
	#default;
	#required;

	constructor(name, description = null, defaultValue = null, required = false) {
		if (required && defaultValue) {
			throw new Error("Cannot set a default value for a required argument.");
		}

		this.#name = name;
		this.#description = description;
		this.#default = defaultValue;
		this.#required = required;
	}

	/**
	 * Sets the name of the argument, or returns the name if no value is provided.
	 * @param {string} [name] The new name of the argument.
	 * @returns {Argument|string}
	 */
	name(name) {
		if (name) {
			this.#name = name;
			return this;
		}

		return this.#name;
	}

	/**
	 * Sets the description of the argument, or returns the description if no value is provided.
	 * @param {string} [description] The new description of the argument.
	 * @returns {Argument|string}
	 */
	description(description) {
		if (description) {
			this.#description = description;
			return this;
		}

		return this.#description;
	}

	/**
	 * Sets the default value of the argument, or returns the default value if no value is provided.
	 * @param {any} defaultValue The default value of the argument.
	 * @returns {Argument|any}
	 */
	defaultsTo(defaultValue) {
		if (defaultValue) {
			if (this.#required) {
				throw new Error("Cannot set a default value for a required argument.");
			}

			this.#default = defaultValue;
			return this;
		}

		return this.#default;
	}

	/**
	 * Sets whether or not the argument is required, or returns whether or not the argument is required if no value is provided.
	 * @param {boolean} [required] Whether or not the argument is required.
	 * @returns {Argument|boolean}
	 */
	required(required) {
		if (typeof required === "boolean") {
			if (required && this.#default) {
				throw new Error("Cannot set an argument as required if it has a default value.");
			}

			this.#required = required;
			return this;
		}

		return this.#required;
	}
}

export default Argument;