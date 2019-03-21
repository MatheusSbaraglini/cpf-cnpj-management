const { InvalidCpfError, InvalidCnpjError, DomainError } = require('../errors');

function validateCpf (cpf) {
	cpf = cpf.replace(/\D/g, '');

	if (cpf === '' || cpf.length !== 11 || !/^\d{11}$/.test(cpf)) {
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

  if((cnpj = cnpj.replace(/[^\d]/g,"")).length != 14)
      return false;

  if(/0{14}/.test(cnpj))
      return false;

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
			throw new InvalidCpfError('CPF is invalid!');
	} else if (cnpj) {
		if (!validateCnpj(cnpj))
			throw new InvalidCnpjError('CNPJ is invalid!');
	} else {
		throw new DomainError('CPF or CNPJ is required!');
	};

	return true;
}

module.exports = { validateCpfCnpj };