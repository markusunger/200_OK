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
