(function () {
	var jsmeta = window.jsmeta || (window.jsmeta = {});

	jsmeta.types || (jsmeta.types = {});

	jsmeta.types.string = function (value, typedfn) {
		if (typeof value !== 'string')
			return { result: false, errors: [{ not_a: 'string' }] };

		var errors = [];

		for (var c in typedfn.constraints) {
			var constraint = typedfn.constraints[c];

			if (constraint.maxLength !== undefined)
				if (value.length > constraint.maxLength)
					errors.push({ length: { '>': constraint.maxLength } });

			if (constraint.minLength !== undefined)
				if (value.length < constraint.minLength)
					errors.push({ length: { '<': constraint.minLength } });
		}

		return errors.length > 0 ? { result: false, errors: errors } : { result: true };
	};

	jsmeta.types.number = function (value, typedfn) {
		if (typeof value !== 'number')
			return { result: false, errors: [{ not_a: 'number' }]};

		var errors = [];

		return formatResult(errors);
	};


	// Validates that the provided data is conforms to the type definition.
	jsmeta.validate = function (data, typedfn) {
		var typeCheck = jsmeta.types[typedfn.type](data, typedfn);
		var result = {
			result: typeCheck.result && applyGuards(data, typedfn)
		};

		if (typeCheck.errors !== undefined)
			result.errors = typeCheck.errors;

		return result;
	};

	function applyGuards(data, typeFn) {
		for (var g in typeFn.guards) {
			if (!typeFn.guards[g](data))
				return false;
		}
		return true;
	}

	if (typeof define !== 'undefined') {
		define('jsmeta', function () { return jsmeta; });
	}

	// Helper functions
	function formatResult(errors) {
		if (errors.length > 0)
			return { result: false, errors: errors };
		else
			return { result: true };
	}
})();
