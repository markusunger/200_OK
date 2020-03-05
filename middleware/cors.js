module.exports = function cors(allowOrigin = '*') {
  const options = {
    preflightStatus: 204,
    supportedMethods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
    sendPreflightResponse: true,
    preflightValidFor: 3600,
  };

  return function corsHandler(req, res, next) {
    const { apiDetails } = req || {};
    const { response } = res.locals;

    response.addHeader('Access-Control-Allow-Origin', allowOrigin);

    // expose all response headers with a wildcard (does not affect Authorization, needs to be added
    // explicitly after the wildcard if it ever becomes necessary!)
    response.addHeader('Access-Control-Expose-Headers', '*');

    // don't let the CORS request fail for any unimportant present headers
    response.addHeader('Access-Control-Allow-Headers', 'Accept, *');

    // handle OPTIONS preflight request
    if (req.method === 'OPTIONS') {
      // retrieve allowed endpoint methods from apiDetails or allow all
      const { allowedMethods } = apiDetails || {
        allowedMethods: options.supportedMethods,
      };
      options.supportedMethods
        .filter(method => allowedMethods.includes(method))
        .forEach(supportedMethod => response.addHeader(
          'Access-Control-Allow-Methods', supportedMethod,
        ));

      // set maximum value in seconds that this preflight response is valid without another
      response.addHeader('Access-Control-Max-Age', options.preflightValidFor);

      if (options.sendPreflightResponse) {
        res.set(response.getHeaders());
        res.status(options.preflightStatus).end();
      } else {
        next();
      }
    } else {
      next();
    }
  };
};
