const express = require('express');

const internal = express.Router();

internal.use((req, res) => {
  res.json({
    ok: 'it works',
  });
});

module.exports = internal;
