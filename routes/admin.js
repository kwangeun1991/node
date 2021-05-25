/**
* 이력서 관리 페이지
*
*/
const express = require('express');
const router = express.Router();

router.get("/", (req, res, next) => {
  const params = {
    addClass : 'admin_page',
  };
  return res.render("admin/main", params);
});

module.exports = router;
