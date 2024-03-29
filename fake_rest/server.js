require("dotenv").config();

let port;

if (process.env.FAKE_REST_PORT) {
  port = process.env.FAKE_REST_PORT;
  console.log("FAKE_REST_PORT =>", process.env.FAKE_REST_PORT);
} else {
  console.log("no FAKE_REST_PORT variable is set");
  process.exit(0);
}

let rest_serve_url = "";

if (process.env.FAKE_REST_URL) {
  rest_serve_url = process.env.FAKE_REST_URL;
  console.log("FAKE_REST_URL =>", process.env.FAKE_REST_URL);
} else {
  console.log("no FAKE_REST_URL variable is set");
  process.exit(0);
}

let folder_path;

if (process.env.FAKE_REST_TARGET_DIR) {
  folder_path = process.env.FAKE_REST_TARGET_DIR;
  console.log("FAKE_REST_TARGET_DIR =>", process.env.FAKE_REST_TARGET_DIR);
} else {
  console.log("no FAKE_REST_TARGET_DIR variable is set");
  process.exit(0);
}

var express = require("express");
var cors = require("cors");
var app = express();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use(cors());
app.use("/uploads", express.static("uploads"));

var fs = require("fs"),
  path = require("path");
const { exit } = require("process");

function dirTree(filename) {
  var stats = fs.lstatSync(filename),
    info = {
      path: filename,
      name: path.basename(filename),
    };

  console.log("filename", filename, path.extname(filename));

  if (stats.isDirectory()) {
    info.type = "folder";
    info.children = fs.readdirSync(filename).map(function (child) {
      return dirTree(filename + "/" + child);
    });
  } else {
    // Assuming it's a file. In real life it could be a symlink or
    // something else!

    const theFile = path.extname(filename)

    if (theFile == [".png", ".jpg", ".gif"].filter((value) => { return value==theFile;})[0]) info.type = "img";
    else if (theFile == [".html"].filter((value) => { return value==theFile;})[0]) info.type = "html";
    else if (theFile == ".py") info.type = "python";
    else if ([".txt", ".sgs", ".json", ".spec", ".log", ".bdf", ".dg1"].filter((value) => { return value==theFile;})[0]) info.type = "text";
    else info.type = "file";
    info.url = rest_serve_url + "dataset/1/" + path.basename(filename);
    info.id = path.basename(filename);
  }

  return info;
}

function filenamesFilter(folder_path, fileNameFilter)
{
  let files = []

  fs.readdirSync(folder_path).map(function (child) {
    console.log(child)
    const extName = path.extname(child)

    console.log("ext", extName)

    if(extName == fileNameFilter)
        files.push(child)
  });

  console.log(files)
  return files
}

app.get("/status/", (req, res, next) => {
  res.json({status:"ok" });
});

/**
 * So fake this one
 */
app.get("/dataset/", (req, res, next) => {
  res.json([{ name: "dataset1" }, { name: "dataset2" }]);
});

app.get("/dataset/1", (req, res, next) => {
  res.json(dirTree(folder_path));
});

app.get("/dataset/1/filter/:filenameFilter", (req, res) => {
  const fileNameFilter = req.params.filenameFilter
  console.log("fileNameFilter", fileNameFilter)
  res.json(filenamesFilter(folder_path, fileNameFilter));
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.put("/dataset/1/:fileId", (req, res, next) => {
  console.log(req.body);
  res.status(200).json({ fileType: path.extname(req.body.file), kjj: req.body.file });

  const filepath = path.join(folder_path, req.params.fileId);
  fs.truncateSync(filepath);
  const fd = fs.openSync(filepath, "r+");
  const numberOfBytesWritten = fs.writeSync(fd, req.body.file, 0, "utf8");
});

app.get("/dataset/1/:fileId", (req, res) => {

  const fileType = path.extname(req.params.fileId)

  const buffer = fs.readFileSync(path.join(folder_path, req.params.fileId));
  const fileContent = buffer.toString();
  const tag = `<img src="${rest_serve_url + "uploads/" + req.params.fileId}" alt="logo"/>`
  if (path.extname(req.params.fileId) == ".png")
  {
    const filepath = path.join(folder_path, req.params.fileId);
    const destFilePath = path.join("uploads", req.params.fileId);
    fs.copyFileSync(filepath, destFilePath);
    res.status(200).json({ fileType:fileType, view:tag});
  }
  else if(path.extname(req.params.fileId) == ".html")
  {
    const filepath = path.join(folder_path, req.params.fileId);
    const destFilePath = path.join("uploads", req.params.fileId);
    fs.copyFileSync(filepath, destFilePath);
    res.status(200).json({ fileType:fileType, url: rest_serve_url + "uploads/" + req.params.fileId });
  } 
  else res.status(200).json({ fileType:fileType, file: fileContent });
});
