const store = require('../services/schemaless');

module.exports = async function validateParent(req, res, next) {
  const { apiName, args } = req;

  // skip middleware if target is not a nested collection/item
  if (args.length <= 2) return next();

  const { response } = res.locals;

  const targetIsCollection = args.length % 2 !== 0;
  const parent = targetIsCollection
    ? args.slice(0, args.length - 1)
    : args.slice(0, args.length - 2);
  const parentId = parseInt(parent.pop(), 10);
  const parentPath = parent.join('/');

  const hasValidParent = await store.verifyItem(apiName, parentId, parentPath);

  // send early error response if parent resource does not exist
  if (!hasValidParent) {
    response.status = 400;
    response.addError('NO_VALID_PARENT', args.join('/'), `${parentPath}/${parentId}`);
    response.send(req, res);
  } else {
    next();
  }

  return null;
};
