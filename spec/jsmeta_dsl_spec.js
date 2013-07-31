describe('JsMeta DSL', function () {
	var j = jsmeta.dsl;

	describe('Guards', function () {
		it('should be supported for all types', function () {
			var guard = j.String.withGuard;
			for (var type in j) {
				expect(j[type].withGuard).toBe(guard);
			}
		});

		it('should not modify original type definition', function () {
			var t = j.String.notEmpty();
			var u = t.withGuard(function (a) { return a == "hello"; });
			expect(t).not.toBe(u);
		});
	});

	// Tests common helpers for strings and sets.
	describe('Sets and Strings', function () {
		it('should correctly define length ranges on type', function () {
			expect(j.String.ofLength(1, 10).constraints)
				.toEqual([{ minLength: 1 }, { maxLength: 10 }]);
		});

		it('should contain shorthands for length range definitions', function () {
			expect(j.String.notEmpty().constraints)
				.toEqual([{ minLength: 1}]);

			expect(j.String.notLongerThan(5).constraints)
				.toEqual([{ maxLength: 5 }]);
		});

		it('helpers shouldn\'t modify the original type', function () {
			var str = j.String.notEmpty();
			var str2 = str.notLongerThan(5);
			var str3 = str.ofLength(1, 5);

			expect(str).not.toBe(str2);
			expect(str3).not.toBe(str2);
		});
	});

	describe('String', function () {
		it('should produce correct string type definition', function () {
			expect(j.String.type).toBe('string');
		});
	});

	describe('Number', function () {
		it('should produce correct number type definition', function () {
			expect(j.Number.type).toBe('number');
		});
	});

	describe('SetOf', function () {
		it('should produce correct set type definition', function () {
			var set = j.SetOf(j.Number);
			expect(set.type).toBe('set');
			expect(set.typeArgs[0]).toBe(j.Number);
		});
	});
	
	describe('Enum', function () {
		it('should produce correct enum type definition', function () {
			var animals = j.Enum(['dog', 'cat', 'fish']);
			expect(animals.type).toBe('enum');
			expect(animals.choices.length).toBe(3);
		});
	});
});
