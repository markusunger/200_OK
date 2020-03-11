const errorMessage = require('../lib/errors');

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

  addError(errorIdentifier, ...variables) {
    const error = errorMessage(errorIdentifier, variables);
    this._errors.push(error);
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

  send(res) {
    res.set(this.getHeaders());
    res.status(this.status);
    if (this.hasErrors()) {
      res.json({ error: this.errors });
    } else if (this.body) {
      res.json(this.body);
    } else {
      res.end();
    }
  }
}

module.exports = Response;
