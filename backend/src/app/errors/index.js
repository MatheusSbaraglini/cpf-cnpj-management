class InvalidCpfError extends Error {
    constructor(message, status) {
      super();

      Error.captureStackTrace(this, this.constructor);

      this.name = this.constructor.name;

      this.message = message || 
          'CPF is invalid!';

      this.status = status || 400;
  }
};

class InvalidCnpjError extends Error {
    constructor(message, status) {
      super();

      Error.captureStackTrace(this, this.constructor);
      
      this.name = this.constructor.name;

      this.message = message || 
          'CNPJ is invalid!';

      this.status = status || 400;
  }
};

class DomainError extends Error {
    constructor(message, status) {
      super();

      Error.captureStackTrace(this, this.constructor);
      
      this.name = this.constructor.name;

      this.message = message || 
          'CNPJ is invalid!';

      this.status = status || 400;
  }
};

module.exports = {
    InvalidCpfError,
    InvalidCnpjError,
    DomainError
};