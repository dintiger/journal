/**
 * This file handles multer file uploads
 */
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const splitName = file.originalname.split(".");
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}.${splitName[splitName.length - 1]}`
    );
  },
});
const upload = multer({ storage: storage });

module.exports = { upload: upload };
