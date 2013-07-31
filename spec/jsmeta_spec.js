describe('JsMeta', function () {
	var j = jsmeta.dsl;

	describe('mapping', function () {

	});

	describe('validation', function () {
		it('should validate types of the primitives', function () {
			expect(jsmeta.validate(123, j.Number)).toEqual({ result: true });
			expect(jsmeta.validate(123, j.String)).toEqual({ result: false, errors: [{ not_a: 'string' }] });
			expect(jsmeta.validate('hello', j.Number)).toEqual({ result: false, errors: [{ not_a: 'number' }] });
		});

		it('should validate strings', function () {
			expect(jsmeta.validate("hello", j.String.ofLength(3, 5))).toEqual({ result: true });
			expect(jsmeta.validate("helloow", j.String.ofLength(3, 5))).toEqual({ result: false, errors: [{ length: { '>': 5 } }] });
		});

		describe('of compound data types', function () {
			it('should validate sets', function () {
				expect(jsmeta.validate([1, 2, 3], j.SetOf(j.Number))).toEqual({ result: true });
				expect(jsmeta.validate([1, 2, 2], j.SetOf(j.Number))).toEqual({ result: false, errors: [{ not_a: 'set', duplicates_at: [2] }] });
				expect(jsmeta.validate([1, 2, 'hi'], j.SetOf(j.Number))).toEqual({ result: false, errors: [{ not_a: 'number', position: 2 }] });
			});

			it('should validate recursive types', function () {
				var type = j.SetOf(j.SetOf(j.Number));
				expect(jsmeta.validate([[1, 2], [3, 4]], type)).toEqual({ result: true });
				expect(jsmeta.validate([[1, 2], [3, 3]], type)).toEqual({ result: false, errors: [{ not_a: 'set', duplicates_at: [1], position: 1 }] });
			});
		});

		it('should validate guards', function () {
			expect(jsmeta.validate(4, j.Number.withGuard(function (n) { return n > 5; })))
				.toEqual({ result: false });

			expect(jsmeta.validate(8, j.Number.withGuard(function (n) { return n > 5; })
			                                           .withGuard(function (n) { return n < 10; })))
				.toEqual({ result: true });
		});
	});
});
