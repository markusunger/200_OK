module.exports = function devLogger(message) {
  if (typeof message === typeof Error) {
    console.error(message.message);
    console.error(message.stack);
  } else {
    console.log(message);
  }
};
