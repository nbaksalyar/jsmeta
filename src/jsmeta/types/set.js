(function () {
	var jsmeta = window.jsmeta || (window.jsmeta = {});

	jsmeta.types || (jsmeta.types = {});

	jsmeta.types.set = function (set, typedfn) {
		var errors = [];

		if (typeof set !== 'object')
			return { result: false, errors: [{ not_a: 'set' }] };

		// Check types of set contents.
		if (typedfn.typeArgs === undefined)
			return { result: false, errors: [{ type_definition: { type_args_required: true } }] };

		var typeErrors = checkSetTypes(set, typedfn.typeArgs[0]);
		errors = errors.concat(typeErrors);

		// Check uniquiness of the set.
		var dupes = checkSetUniqueness(set, []);
		if (dupes.length > 0)
			errors.push({ not_a: 'set', duplicates_at: dupes })

		return errors.length ? { result: false, errors: errors } : { result: true };
	};

	function checkSetUniqueness(set, duplicates, pos) {
		if (set.length == 0)
			return duplicates;
		else {
			var head = set[0], tail = set.slice(1);

			for (var i = 0, len = set.length; i < len; i++)
				if (tail[i] === head)
					duplicates.push((pos || 0) + (i + 1));

			return checkSetUniqueness(tail, duplicates, (pos || 0) + 1);
		}
	}

	function checkSetTypes(set, setType) {
		var errors = [];
		var setLength = set.length;

		for (var i = 0; i < setLength; i++) {
			var r = jsmeta.validate(set[i], setType);

			if (r.result === false) {
				// Setting positions for the errors.
				r.errors.map(function (e) { e.position = i; })
				errors = errors.concat(r.errors);
			}
		}

		return errors;
	}

})();
