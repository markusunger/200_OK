class Response {
  constructor() {
    this._status = undefined;
    this._errors = [];
    // default header to send with every request get initialized right at the start
    this._headers = [
      ['X-Powered-By', '200 OK'],
    ];
    this._body = undefined;
  }

  set status(newStatus) {
    if (!this._status) this._status = newStatus;
  }

  get status() {
    return this._status || 200;
  }

  addError(errorMessage) {
    this._errors.push(errorMessage);
  }

  get errors() {
    return this._errors;
  }

  hasErrors() {
    return this._errors.length > 0;
  }

  addHeader(key, value) {
    this._headers.push([key, value]);
  }

  getHeaders() {
    return this._headers.reduce((headerObj, [key, value]) => {
      if (headerObj[key]) {
        // handle multiple vary values or allow-methods
        headerObj[key] += `, ${value}`; // eslint-disable-line no-param-reassign
      } else {
        headerObj[key] = value; // eslint-disable-line no-param-reassign
      }
      return headerObj;
    }, {});
  }

  get body() {
    return this._body;
  }

  set body(newBody) {
    this._body = newBody;
  }
}

module.exports = Response;
