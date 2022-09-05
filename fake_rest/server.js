var express = require("express");
var cors = require('cors')
var app = express();
app.listen(3456, () => {
  console.log("Server running on port 3456");
});

app.use(cors())

var fs = require("fs"),
  path = require("path");

let file_serve_url = "http://localhost/"

if (process.env.SIMPLE_FILE_SERVE_URL){
    file_serve_url = process.env.SIMPLE_FILE_SERVE_URL;
    console.log("SIMPLE_FILE_SERVE_URL =>", process.env.SIMPLE_FILE_SERVE_URL);
  }
  else console.log("no SIMPLE_FILE_SERVE_URL variable is set");

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
    info.url= file_serve_url +  path.basename(filename)
  }

  return info;
}

let folder_path = "C:/Users/Administrator/Desktop/SGS-Isolated";

if (process.env.FAKE_REST_TARGET_DIR){
  folder_path = process.env.FAKE_REST_TARGET_DIR;
  console.log("FAKE_REST_TARGET_DIR =>", process.env.FAKE_REST_TARGET_DIR);
}
else console.log("no FAKE_REST_TARGET_DIR variable is set");

app.get("/dataset/", (req, res, next) => {
  res.json([{ name: "dataset1" }, { name: "dataset2" }]);
});

app.get("/dataset/1", (req, res, next) => {
  res.json(dirTree(folder_path));
});

app.use(express.json())
app.use(express.urlencoded());

app.put("/dataset/1/file/1", (req, res, next) => {
  console.log(req.body)
  res.status(200).json({msje:"helaalo", kjj:req.body.file});

  const filepath = path.join(folder_path,"test3.py")
  fs.truncateSync(filepath);
  const fd = fs.openSync(filepath, "r+");
  const numberOfBytesWritten = fs.writeSync(fd, req.body.file, 0, 'utf8');
});

app.get("/dataset/1/file/1", (req, res, next) => {
  const buffer = fs.readFileSync(path.join(folder_path,"test3.py"));
  const fileContent = buffer.toString();
  console.log(fileContent);
  res.status(200).json({file:fileContent});
});
