const fs = require("fs");

if (!fs.existsSync("dist")) {
    fs.mkdirSync("dist");
}

fs.copyFileSync("index.js", "dist/index.js");

console.log("Build complete.");