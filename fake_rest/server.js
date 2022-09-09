require('dotenv').config()

let port;

if (process.env.FAKE_REST_PORT) {
  port = process.env.FAKE_REST_PORT;
  console.log("FAKE_REST_PORT =>", process.env.FAKE_REST_PORT);
} else {
  console.log("no FAKE_REST_PORT variable is set");
  process.exit(0)
}

let rest_serve_url = "";

if (process.env.FAKE_REST_URL) {
  rest_serve_url = process.env.FAKE_REST_URL;
  console.log("FAKE_REST_URL =>", process.env.FAKE_REST_URL);
} else {
  console.log("no FAKE_REST_URL variable is set");
  process.exit(0)
}

let folder_path;

if (process.env.FAKE_REST_TARGET_DIR) {
  folder_path = process.env.FAKE_REST_TARGET_DIR;
  console.log("FAKE_REST_TARGET_DIR =>", process.env.FAKE_REST_TARGET_DIR);
} else {
  console.log("no FAKE_REST_TARGET_DIR variable is set");
  process.exit(0)
}

var express = require("express");
var cors = require("cors");
var app = express();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use(cors());
app.use('/uploads', express.static('uploads'))

var fs = require("fs"),
  path = require("path");
const { exit } = require("process");

function dirTree(filename) {
  var stats = fs.lstatSync(filename),
    info = {
      path: filename,
      name: path.basename(filename),
    };

  if (stats.isDirectory()) {
    info.type = "folder";
    info.children = fs.readdirSync(filename).map(function (child) {
      return dirTree(filename + "/" + child);
    });
  } else {
    // Assuming it's a file. In real life it could be a symlink or
    // something else!
    info.type = "file";
    info.url = rest_serve_url + "dataset/1/" + path.basename(filename);
    info.id = path.basename(filename);
  }

  return info;
}

/**
 * So fake this one
 */
app.get("/dataset/", (req, res, next) => {
  res.json([{ name: "dataset1" }, { name: "dataset2" }]);
});

app.get("/dataset/1", (req, res, next) => {
  res.json(dirTree(folder_path));
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.put("/dataset/1/:fileId", (req, res, next) => {
  console.log(req.body);
  res.status(200).json({ msje: "helaalo", kjj: req.body.file });

  const filepath = path.join(folder_path, req.params.fileId);
  fs.truncateSync(filepath);
  const fd = fs.openSync(filepath, "r+");
  const numberOfBytesWritten = fs.writeSync(fd, req.body.file, 0, "utf8");
});

app.get("/dataset/1/:fileId", (req, res) => {
  const buffer = fs.readFileSync(path.join(folder_path, req.params.fileId));
  const fileContent = buffer.toString();
  console.log(fileContent);
  res.status(200).json({ file: fileContent });
});
