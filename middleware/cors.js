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

    // handle OPTIONS preflight request
    if (req.method === 'OPTIONS') {
      // reflect all access-control-request-headers back because the API does not
      // care about any custom headers - explicitly allowing Accept circumvents some of the
      // CORS-safe header restrictions
      const allowHeaders = `Accept,${req.headers['access-control-request-headers']}`;
      response.addHeader('Vary', 'Access-Control-Request-Headers');
      response.addHeader('Access-Control-Allow-Headers', allowHeaders);

      // until further research and validation, allow all request methods specified in the options
      // and let the API send a NO_PREDEFINED_METHOD error if the method was disabled for a custom
      // route -> better allow the CORS request and send an explicit error than block the complete
      // response client-side

      // const { allowedMethods } = apiDetails || {
      //   allowedMethods: options.supportedMethods,
      // };

      options.supportedMethods
        // .filter(method => allowedMethods.includes(method))
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
