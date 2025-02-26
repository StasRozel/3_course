const express = require("express");
const crypto = require("crypto");
const fs = require("fs");

const app = express();



function getETag(filePath) {
    const content = fs.readFileSync(filePath);
    return crypto.createHash("md5").update(content).digest("hex");
  }

const settings_cache = {
  "Last-Modified": new Date().toUTCString(),
  "Expires": new Date(Date.now() + 20000).toUTCString(),
  "Cache-Control": "max-age=20"
};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/send_img", (req, res) => {
  const type_cache = req.query.cache_parm || "Last-Modified";
  const imgPath = __dirname + "/static/vinni.png";

  settings_cache["ETag"] = getETag(imgPath);
 
  if (type_cache == 'Expires') {
    res.set(type_cache, settings_cache[type_cache]);
    res.set("Cache-Control", settings_cache["Cache-Control"]);
  }
  res.sendFile(imgPath);
});

app.get('/send_script', (req, res) => {
    const type_cache = req.query.cache_parm || "Last-Modified";
    const scriptPath = __dirname + "/static/script.js";

    settings_cache["ETag"] = getETag(scriptPath);
    res.set(type_cache, settings_cache[type_cache]);
    res.sendFile(__dirname + '/static/script.js');
})

app.get('/send_style', (req, res) => {
    const type_cache = req.query.cache_parm || "Last-Modified";
    const stylePath = __dirname + "/static/style.css";
    settings_cache["ETag"] = getETag(stylePath);
    res.set(type_cache, settings_cache[type_cache]);
    res.sendFile(__dirname + '/static/style.css');
})

app.listen(3000, console.log("Server running on port 3000"));
/* */