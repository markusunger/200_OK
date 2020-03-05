module.exports = function pathExtractor(req, res, next) {
  let { path } = req;
  if (path[0] === '/') path = path.slice(1);

  // remove trailing slashes if present (see https://restfulapi.net/resource-naming/)
  // but still treat request as valid
  if (path[path.length - 1] === '/') {
    path = path.slice(0, path.length - 1);
  }

  let segments = path.split('/');
  // no requests to root path allowed, so make segments invalid for later validation
  if (segments[0].length === 0) segments = null;

  // add endpoint segments as property to req for use later
  req.args = segments;
  next();
};
