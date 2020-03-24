// provides an interface for the pub/sub Redis store
// to which the API backend will publish any request/response
// for usage as server-sent events in the frontend

const Redis = require('ioredis');

const cfg = require('../lib/config');

module.exports = (function createPublisher() {
  const redis = new Redis({
    host: cfg.redisHost,
    port: cfg.redisPort,
    password: cfg.redisPassword,
  });

  const prepareRequest = req => ({
    method: req.method,
    target: req.originalUrl,
    headers: req.headers,
    body: req.body,
  });

  const prepareResponse = res => ({
    sentAt: Date.now(),
    status: res.statusCode,
    headers: res.getHeaders(),
    body: res.body,
  });

  const stringifyMessage = (msg) => {
    try {
      return JSON.stringify(msg);
    } catch (error) {
      return msg;
    }
  };

  return {
    publish: function publish(req, res) {
      const payload = stringifyMessage({
        request: prepareRequest(req),
        response: prepareResponse(res),
      });

      redis.publish(req.apiName, payload);
    },
  };
}());
