module.exports = function devLogger(msg, type = 'info') {
  if (type === 'error') {
    console.error(msg);
  } else {
    console.log(msg);
  }
};
