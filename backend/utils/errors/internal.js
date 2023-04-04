class InternalError extends Error {
  constructor() {
    super();
    this.name = 'InternalError';
    this.statusCode = 500;
  }
}

module.exports = { InternalError };
