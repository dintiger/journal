const router = require("express").Router();
const Entry = require("../models/entry.model");
const User = require("../models/users.model");
const { upload } = require("../config/multer.config");
const secureUser = require("../config/securepage.config");
const entryModel = require("../models/entry.model");

// to render  entry by pecific user based on ID
router.get("/", secureUser, async (req, res) => {
  try {
    const entries = await Entry.find({ createdBy: req.user._id }).sort({
      uploadDate: -1,
    }); // sorting in database
    res.render("entry/entryList.ejs", { entries: entries });
  } catch (e) {
    console.log(e);
  }
});

// to show all journals
router.get("/exploreEntry", async (req, res) => {
  try {
    const entries = await Entry.find().sort({
      uploadDate: -1,
    }); // sorting in database ;
    res.render("entry/exploreEntry.ejs", { entries: entries });
  } catch (e) {
    console.log(e);
  }
});

router.get("/entryList/create", secureUser, async (req, res) => {
  try {
    res.render("entry/createEntry.ejs");
  } catch (e) {
    console.log(e);
  }
});

// to create entry
router.post(
  "/entryList/create",
  [secureUser, upload.single("entryImage")],
  async (req, res) => {
    console.log(req.user);
    try {
      const entry = new Entry({
        ...req.body,
        entryImage: req.file.filename,
        createdBy: req.user._id,
        creator: req.user.name,
        uploadDate: new Date(),
      });
      await entry.save();
      res.redirect("/");
    } catch (e) {
      console.log(e);
    }
  }
);

//to pick the specific entry(id) ,and redirect to relevent ejs file
router.get("/edit/:id", async (req, res) => {
  try {
    const entry = await Entry.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    res.render("entry/editList.ejs", { entry: entry });
  } catch (e) {
    console.log(e);
    res.redirect(`/edit/${req.params.id}`);
  }
});

// to send the edit of the specific entry detail by using entry id,
router.post("/edit/:id", async (req, res) => {
  try {
    await entryModel.updateOne(
      { _id: req.params.id },
      {
        title: req.body.title,
        description: req.body.description,
        uploadDate: req.body.uploadDate,
        entryImage: req.body.entryImage,
      }
    );
    res.redirect("/"); // if success redirect back to root!
  } catch (e) {
    console.log(e);
    res.redirect(`/edit/${req.params.id}`); // if failed redirect back to the entry that we wanted to edit
  }
});

// to delete
router.post("/delete/:entryID", async (req, res) => {
  try {
    await Entry.findOneAndDelete({
      _id: req.params.entryID,
      createdBy: req.user._id,
    });
    res.redirect("/");
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
});

module.exports = router;
