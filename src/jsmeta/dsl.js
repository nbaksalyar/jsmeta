// Domain specific language to define new JSMeta types.

(function () {
	var jsmeta = window.jsmeta || (window.jsmeta = {});

	function SetDSL() {
	}
	
	extend(SetDSL.prototype, {
		type: 'set',

		notEmpty: function () {
			return lengthConstraint.call(this, 1);
		},

		ofLength: lengthConstraint,

		notLongerThan: function (max) {
			return lengthConstraint.call(this, void 0, max);
		}
	});

	jsmeta.dsl = {
		Enum: function (choices) {
			var e = {};
			e.type = 'enum';
			e.choices = choices;
			return Object.freeze(e);
		},
		String: {
			type: 'string',
			ofLength: lengthConstraint,
			notEmpty: function () {
				return lengthConstraint.call(this, 1);
			},
			notLongerThan: function (max) {
				return lengthConstraint.call(this, void 0, max);
			}
		},
		Number: {
			type: 'number',
			ofRange: function (min, max) {
				
			},
			maxValue: function (max) {

			},
			minValue: function (min) {

			}
		},
		SetOf: function (t) {
			var set = new SetDSL();
			set.typeArgs = [t];
			return set;
		},
		ArrayOf: function () {
			this.type = 'array';
		},
		Date: function () {
			
		},
		Frame: function () {
			
		}
	};

	for (type in jsmeta.dsl) {
		jsmeta.dsl[type].withGuard = defineGuard;
	}

	function defineGuard(fn) {
		var newType = extend({}, this);
		newType.guards = extend([], newType.guards);
		newType.guards.push(fn);
		return Object.freeze(newType);
	}

	function lengthConstraint(min, max) {
		var newType = extend({}, this);
		newType.constraints = extend([], newType.constraints);
		if (typeof min !== 'undefined')
			newType.constraints.push({ minLength: min });
		if (typeof max !== 'undefined')
			newType.constraints.push({ maxLength: max });
		return Object.freeze(newType);
	}

	// Shallow copy.
	function extend(o1, o2) {
		for (var i in o2) {
			o1[i] = o2[i];
		}
		return o1;
	}
})();
