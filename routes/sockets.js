"use strict";
/* jshint esversion : 6 */

const express = require('express');
const router  = express.Router();

module.exports = () => {

  // Socket testing page
  router.get("/", (req, res) => {
    res.render("socket-tester");
  });

  return router;
};
