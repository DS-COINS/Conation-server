const express = require("express");
const router = express.Router();
const { Memo } = require("../models/Memo");

router.post("/postMemo", (req, res) => {
  const memo = new Memo({
    text: req.body.text,
  });

  memo
    .save()
    .then((result) => {
      res.status(200).json({
        success: true,
        result: result,
      });
    })
    .catch((err) => {
      res.json({ success: false, err });
    });
});

router.get("/getMemos", async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const perPage = 8;

    const memos = await Memo.find({})
      .limit(perPage * 1)
      .skip((page - 1) * perPage);

    const total = await Memo.countDocuments({});
    return res.status(200).json({
      success: true,
      memos,
      totalPages: Math.ceil(total / perPage),
      currentPage: page,
    });
  } catch (err) {
    res.json({ success: false, err });
    next(err);
  }
});

module.exports = router;
