#!/usr/bin/env node

var langs = ["typescript-angular", "typescript-node"];
var compileExclude = [];
var shell = require('shelljs');
var fs = require("fs");
var commander = require("commander");
var SwaggerParser = require("swagger-parser");
var silent = true;
var P = require("bluebird");
var tmp = require("tempy");
var path = require("path");
var yaml = require("js-yaml");
var _ = require("lodash");
var paths = {
    src: "src/swaggers/",
    buildSwaggers: "build/swaggers/",
    dist: "dist/"
  }
  // shell.echo("Following components are available: \n");



var afterCompile = {
  "typescript-angular": compileTsAngular,
  "typescript-node": compileTsNode
}
var langMap = {
  "typescript-angular": "node-models",
  "typescript-node": "node"
}

function compileTsAngular(srcFolder, api, lang) {
  var targetFolder = paths.dist + langMap[lang] + "/" + api + "/";
  srcFolder += "model/";
  console.log("Compile typescript angular path: ", srcFolder, " to ", targetFolder);
  // shell.exec("tsc -d --target es6 --moduleResolution node  --sourceMap true  --experimentalDecorators  --rootDir " + srcFolder + " --outDir " + targetFolder + " " + srcFolder + "/*.ts ");
  shell.exec("tsc -d --types node --target es5 --moduleResolution node --sourceMap true  --experimentalDecorators  --rootDir " + srcFolder + " --outDir " + targetFolder + " " + srcFolder + "/*.ts ");
}

function compileTsNode(srcFolder, api, lang) {
  var targetFolder = paths.dist + langMap[lang] + "/" + api + "/";
  console.log("Compile typescript node path: ", srcFolder, " to ", targetFolder);
  shell.exec("tsc -d --types node --target es5 --moduleResolution node --sourceMap true  --experimentalDecorators  --rootDir " + srcFolder + " --outDir " + targetFolder + " " + srcFolder + "/*.ts ");
}

function exists(path) {
  return fs.existsSync(path);
}

function getAllApis() {
  var apis = []
  shell.ls(paths.src).forEach(function(f) {
    var s = f.replace(".yaml", "");
    apis.push(s);
  });
  console.log("API found: ", apis.length);
  return apis;
}

function validateSwagger(file) {
  if (exists(file)) {
    console.log("Validating: ", file);
    var rs = shell.exec("swagger validate -j " + file + " ", { silent: silent });
    if (rs.toString() === "done\n") {
      return true;
    }
    var d = JSON.parse(rs);
    if (d.errors && d.errors.length > 0) {
      console.error("Validation failed for file: ", file);
      console.error(JSON.stringify(d, null, 2));
      return false;
    }
    return true;
  }
  return false;
}
var phReg = /#!-.*!#/;

function build(api) {
  shell.mkdir("-p", paths.buildSwaggers);
  var srcPath = paths.src + api + ".yaml";
  if (!exists(srcPath)) {
    console.log("File not found: ", srcPath);
    return Promise.reject("Build failed");
  }
  var builtSwaggerPath = paths.buildSwaggers + api + ".yaml";
  console.log("Open src: ", srcPath);
  var content = fs.readFileSync(srcPath, { encoding: "utf8" });
  var m = null;
  var indent = "  ";
  while (m = content.match(phReg)) {
    var idx = m.index;
    var edx = m.index + m.toString().length;
    var urlFull = path.resolve(path.dirname(srcPath), m.toString().replace("#!-", "").replace("!#", ""))
    var url = urlFull.split("#")[0];
    var node = urlFull.split("#")[1];
    console.log("Open partial file: ", url);
    var c1 = fs.readFileSync(url);
    if (node) {
      var doc = yaml.safeLoad(c1);
      var indentFull = ""
      for (var i = 0; i < node.split(".").length; i++) {
        indentFull += indent;
      }
      c1 = yaml.safeDump(_.get(doc, node, doc)).replace(/\n/g, "\n" + indentFull);
    }
    content = content.substring(0, idx) + c1 + content.substring(edx);
  }
  // console.log(content);
  var tmpFile = path.resolve(path.dirname(srcPath), path.basename(srcPath) + ".tmp");
  fs.writeFileSync(tmpFile, yaml.safeDump(yaml.safeLoad(content, { json: true })), { encoding: "utf8" });
  console.log("Build tmp file: ", tmpFile);
  console.log("Build swagger file: ", builtSwaggerPath);

  // return SwaggerParser.dereference(srcPath)
  //   .then(function (api) {
  //     fs.writeFileSync(builtSwaggerPath, SwaggerParser.YAML.stringify(api), { encoding: "utf8" });
  //     return builtSwaggerPath;
  //   });

  shell.exec("json-refs resolve -y -I relative -I remote " + tmpFile + " > " + builtSwaggerPath + " ");
  fs.unlinkSync(tmpFile);
  if (exists(builtSwaggerPath)) {
    return Promise.resolve(builtSwaggerPath);
  } else {
    console.log("Build swagger file failed..");
    return Promise.reject("Build failed");
  }


}


function compile(swaggerPath, api, langs) {
  if (compileExclude.indexOf(api) > -1) {
    console.log("Excluded compiling component: ", api);
  } else {
    var path = swaggerPath;
    if (exists(path)) {
      langs.forEach(function(l) {
        var distPath = paths.dist + l + "/" + api + "/";
        console.log("Write sdk for ", l, " to ", distPath);
        shell.rm("-Rf", distPath);
        var cmd = "java -jar swagger-codegen-cli.jar generate -l " + l + " -i " + path + " -o " + distPath;
        shell.exec(cmd, { silent: silent });
        if (afterCompile[l]) {
          console.log("Execute after compile for lang: ", l);
          afterCompile[l](distPath, api, l);
        }
      })
    } else {
      console.log("File not found. skip.");
    }
  }
}

commander
  .option("-l, --list", "List all available components", function() { console.log(getAllApis()) })
  .option("-b, --build <com>", "Build a component", _buildCom)
  .option("--validate <com>", "Build and validate a component's swagger definition", _validate)
  .option("-c, --compile <com>", "Compile a built component", _compile)
  .option("--langs <lang1>,<lang2>,<lang3>", "Specify output languages default is 'typescript-angular,typescript-node' ", _lang)
  .option("--langs-list", "List possible languages", _langslist)
  .option("--bc <com>,<com1>,<com2>", "Build and compile a component", _bc)
  .option("--silent <true/false>", "Indicate if printing all outpus default is true", function(s) { silent = JSON.parse(s) })
  .option("--generate-all", "Remove the dist folder and re-generate all components", _generateAll)
  .option("--rm <com>", "Remove built swagger and generated code", _removeCom)
  .parse(process.argv)

function _bc(comStr) {
  var coms = comStr.split(",");
  coms.forEach(function(com) {
    _removeCom(com);
    _validate(com)
      .then(function() {
        _compile(com)
      })
  })


}

function _removeCom(com) {
  shell.rm("-r",
    paths.buildSwaggers + com + ".yaml",
    paths.dist + "**/" + com + "/"

  );
}

function _lang(_langs) {
  langs = _langs.split(",");
}

function _buildCom(com) {
  return build(com);
}

function _validate(com) {
  return build(com)
    .then(function(p) {
      if (validateSwagger(p)) {
        console.log("Validation passed!");
      }
    });

}

function _compile(com) {

  setTimeout(function() {
    var builtPath = paths.buildSwaggers + com + ".yaml";
    compile(builtPath, com, langs);
  })


}

function _langslist() {
  shell.exec("java -jar ./swagger-codegen-cli.jar langs");
}

function _generateAll() {
  setTimeout(function() {
    var apis = getAllApis();
    apis.forEach(function(api) {
      build(api)
        .then(function(builtPath) {
          validateSwagger(builtPath)
          compile(builtPath, api, langs);
        })

    })
  });
}