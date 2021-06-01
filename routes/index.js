const resume = require("../models/resume");
const express = require('express');
const router = express.Router();

/** 이력서 프론트 메인 */
router.get("/", async (req, res, next) => {
  const data = await resume.get();
//console.log(data);
  res.render("main", data);
});

module.exports = router;
