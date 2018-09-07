#!/usr/bin/env node

var shell = require('shelljs');
var pkg = require("../package.json");
var readline = require("readline");
var fs = require("fs");
var rl = readline.createInterface(process.stdin, process.stdout);
var t = "Ve6K9Hva-2qxBMj2z4Wh";
var r = "git+http://Git:Ve6K9Hva-2qxBMj2z4Wh@gitlab.consulting.redhat.com/rhte-api/api.git#";
rl.question("Please specify version (Current: " + pkg.version + "): ", function(v) {
  pkg.version = v || pkg.version;
  fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2));
  shell.exec("git commit -am 'Update version to " + pkg.version + "'");
  shell.exec("git tag " + pkg.version);
  shell.exec("git push origin master");
  shell.exec("git push origin " + pkg.version);
  shell.echo("SOS-api released successfully with version:", pkg.version);
  shell.echo("Install through 'npm install --save " + r + pkg.version + "'");
  rl.close();
})