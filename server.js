const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// create uploads folder if not exists
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve frontend
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

const USER_PIN = "434";
const ADMIN_PIN = "9550";

let posts = [];
let links = [];

// multer setup
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// homepage route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// user login
app.post("/login", (req, res) => {
  if (req.body.pin === USER_PIN) {
    res.json({ success: true, posts, links });
  } else {
    res.json({ success: false });
  }
});

// admin login
app.post("/admin-login", (req, res) => {
  if (req.body.pin === ADMIN_PIN) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// add post
app.post("/add-post", upload.single("image"), (req, res) => {
  posts.push({
    text: req.body.post,
    image: req.file ? "/uploads/" + req.file.filename : null
  });

  res.json({ success: true });
});

// add link
app.post("/add-link", (req, res) => {
  links.push({
    name: req.body.name,
    url: req.body.url
  });

  res.json({ success: true });
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("KINGDANIEL server running"));
