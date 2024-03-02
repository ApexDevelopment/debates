class Argument {
	#name;
	#description;
	#required;

	constructor(name, description = null, required = false) {
		this.#name = name;
		this.#description = description;
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
	 * Sets whether or not the argument is required, or returns whether or not the argument is required if no value is provided.
	 * @param {boolean} [required] Whether or not the argument is required.
	 * @returns {Argument|boolean}
	 */
	required(required) {
		if (typeof required === "boolean") {
			this.#required = required;
			return this;
		}

		return this.#required;
	}
}

export default Argument;