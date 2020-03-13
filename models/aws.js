const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");
const path = require("path");

const s3 = new aws.S3({
  accessKeyId: "AKIA4RN7LHMEGMFFSNFO",
  secretAccessKey: "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",
  Bucket: "billing-portal-dev"
});
const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
};
const profileImgUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "billing-portal-dev",
    acl: "public-read",
    key: (req, file, cb) => {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          "-" +
          Date.now() +
          path.extname(file.originalname)
      );
    }
  }),
  limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single("profileImage");

module.exports = {
  upload: (req, res) => {
    profileImgUpload(req, res, error => {
      if (error) {
        console.log("errors", error);
        res.json({ error: error });
      } else {
        if (req.file === undefined) {
          console.log("Error: No File Selected!");
          res.json("Error: No File Selected");
        } else {
          const imageName = req.file.key;
          const imageLocation = req.file.location;
          res.status(201).json({
            image: imageName,
            location: imageLocation
          });
        }
      }
    });
  }
};
