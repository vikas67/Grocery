const multer = require("multer");
const path = require("path");
var __dirname = path.resolve();

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")  ||file.mimetype.includes("excel") || file.mimetype.includes("spreadsheetml")  || file.mimetype.includes("pdf")   ) {
    cb(null, true);
  } else {
    cb("Please upload only images or file .", false);
  }
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/public/uploads/");
  },
  limits: {
    fieldSize: 8 * 1024 * 1024,
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-Grocery-${file.originalname}`);
  },
});

var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
var uploadFile = multer({ storage: storage  });
module.exports = uploadFile;