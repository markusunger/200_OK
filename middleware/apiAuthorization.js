// middleware to check if an API requires Authorization
// if so, the bearer token is checked against its hashed counterpart to either
// allow further request processing or to reject the request

const bcrypt = require('bcrypt');

module.exports = async function apiAuthorization(req, res, next) {
  const { isPrivate, bearerToken } = req.apiDetails;

  // continue middleware stack execution when API is not in private mode
  if (!isPrivate) return next();

  const { response } = res.locals;

  // reject request if no Authorization header is present and send WWW-Authenticate header
  // with correct authorization type
  if (!req.get('authorization')) {
    response.status = 401;
    response.addHeader('WWW-Authenticate', 'Bearer');
    response.addError('NO_AUTHORIZATION');
    return response.send(req, res);
  }

  const authHeader = req.get('authorization');

  // reject request if Authorization header does not specify the bearer token type
  if (!authHeader.startsWith('Bearer ')) {
    response.status = 401;
    response.addHeader('WWW-Authenticate', 'Bearer');
    response.addError('NO_AUTHORIZATION_BEARER');
    return response.send(req, res);
  }

  const submittedToken = authHeader.split(' ')[1];
  const tokenMatch = await bcrypt.compare(submittedToken, bearerToken);

  // reject request if the submitted bearer token does not match the hashed one
  if (!tokenMatch) {
    response.status = 401;
    response.addError('WRONG_AUTHORIZATION');
    return response.send(req, res);
  }

  return next();
};
