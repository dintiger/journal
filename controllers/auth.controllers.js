const router = require("express").Router();
const passport = require("passport");
const User = require("../models/users.model");
const { upload } = require("../config/multer.config"); //multer upload for image upload

// rendering register.ejs , check for prefix before checking route in browser
router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.post("/register", upload.single("profilePicture"), async (req, res) => {
  try {
    const user = new User({
      ...req.body,
      profilePicture: `uploads/${req.file.filename}`,
    });
    //TODO: Allow user to register and upload image
    await user.save();
    res.redirect("/user/login");
  } catch (e) {
    console.log(e);
  }
});

router.get("/login", (req, res) => {
  req.flash("success", "Flash is back!");
  res.render("auth/login");
});

//-- handles the lgin
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    successFlash: "Successfully logged in",
  })
);

// deleting the session
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Successfully logged out!");
    res.redirect("/user/login");
  });
});

// deleting the entry
// router.post("/delete", function (req, res, next) {
//   req.logout(function (err) {
//     if (err) {
//       return next(err);
//     }
//     req.flash("success", "Successfully deleted entry");
//     res.redirect("/user/login");
//   });
// });







module.exports = router;
