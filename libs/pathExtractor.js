module.exports = function pathExtractor(req, res, next) {
  let { path } = req;
  if (path[0] === '/') path = path.slice(1);
  const segments = path.split('/');

  // add endpoint segments as property to req for use later
  req.args = segments;
  next();
};
