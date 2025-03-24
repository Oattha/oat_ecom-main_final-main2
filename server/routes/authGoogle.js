const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login", session: false }), 
    (req, res) => {
      console.log("✅ Google Login User:", req.user); // 🔹 Debug
      if (!req.user) {
        return res.redirect("/login");
      }
  
      const token = jwt.sign(
        { id: req.user.id, email: req.user.email, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
  
      console.log("✅ Generated Token:", token); // 🔹 Debug
      res.redirect(`http://oken=${token}`);
    }
  );
  
  

module.exports = router;
