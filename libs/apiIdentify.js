module.exports = function apiIdentify(req, res, next) {
  const { subdomains } = req;
  /*
    TODO:
    if 1 subdomain (not www): fetch API metadata and determine validity
    if API not found or invalid: send error (404?)
  */
  next();
};
