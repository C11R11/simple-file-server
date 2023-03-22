var fs = require("fs")
path = require("path");

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
}

filenamesFilter("C:\\Users\\cristian.rodriguez\\Desktop\\Codelab\\data", ".bmf")

