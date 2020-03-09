/*
  receives a boolean value and a router and invokes the router
  depending on whether the boolean indicates that the router
  should handle requests on subdomains (e.g. <api-name>.200ok.app)

  *****
  THIS IS FOR THE TIME BEING NO LONGER NEEDED
  subdomain extraction now happens inside of apiLookup middleware
  *****
*/

module.exports = function subdomain(handleSubdomains, router) {
  return (req, res, next) => {
    const { subdomains } = req;

    const apiName = subdomains[0] || null;
    req.apiName = apiName;

    if (handleSubdomains) {
      return (apiName && apiName !== 'www') ? router(req, res, next) : next();
    }
    return (!apiName || apiName === 'www') ? router(req, res, next) : next();
  };
};
