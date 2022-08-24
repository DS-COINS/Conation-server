const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { Notification } = require("../models/Notification");
  

router.post("/confirmNotification", (req, res) => {
    Notification.updateOne({_id:req.body._id},
        {$set: {checked: true}})
      .exec((err, result) => {
        if (err) return res.status(400).send(err);
        return res.status(200).json({ success: true });
    });
});



module.exports = router;
  