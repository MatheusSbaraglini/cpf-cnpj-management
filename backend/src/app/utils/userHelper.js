const { InvalidCpfError, InvalidCnpjError, DomainError } = require('../errors');

function sameNumbers(valor) {
	let isSameNumbers = true;

	for(i = 0; i <= valor.length - 1; i++) {
		if (i === valor.length - 1)
			break;

		if (valor.charAt(i) != valor.charAt(i + 1)) {
			isSameNumbers = false;
			break;
		}
	}

	return isSameNumbers;
};

function validateCpf (cpf) {
	cpf = cpf.replace(/\D/g, '');

	if (cpf === '' || cpf.length !== 11) {
		return false;
	}

	if (sameNumbers(cpf)) {
		return false;
	}

	const digits = cpf.split('').map(x => parseInt(x));

	for (let j = 0; j < 2; j++) {
		let sum = 0;

		for (let i = 0; i < 9 + j; i++) {
			sum += digits[i] * (10 + j - i);
		}

		let checkDigit = 11 - (sum % 11);

		if (checkDigit === 10 || checkDigit === 11) {
			checkDigit = 0;
		}

		if (checkDigit !== digits[9 + j]) {
			return false;
		}
	}

	return true;
};

function validateCnpj(cnpj) {
	var b = [6,5,4,3,2,9,8,7,6,5,4,3,2];

	cnpj = cnpj.replace(/[^\d]/g,"");

	if (cnpj === '' || cnpj.length != 14) {
		return false;
	}

	if (sameNumbers(cnpj)) {
		return false;
	}

	for (var i = 0, n = 0; i < 12; n += cnpj[i] * b[++i]);
	if(cnpj[12] != (((n %= 11) < 2) ? 0 : 11 - n))
		return false;

	for (var i = 0, n = 0; i <= 12; n += cnpj[i] * b[i++]);
	if(cnpj[13] != (((n %= 11) < 2) ? 0 : 11 - n))
		return false;

	return true;
};

function validateCpfCnpj(cpf, cnpj) {
	if (cpf) {
		if (!validateCpf(cpf))
			throw new InvalidCpfError('CPF inválido.');
	} else if (cnpj) {
		if (!validateCnpj(cnpj))
			throw new InvalidCnpjError('CNPJ inválido.');
	} else {
		throw new DomainError('É necessário informar um CPF ou CNPJ');
	};

	return true;
}

module.exports = { validateCpfCnpj };