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

    const memos = await Memo.find({})
    return res.status(200).json({
      memos,
    });
  } catch (err) {
    res.json({ success: false, err });
    next(err);
  }
});

module.exports = router;
