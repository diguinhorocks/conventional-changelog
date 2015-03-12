#!/usr/bin/env node

var pkg = require('./package.json');
var fs = require('fs');
var changelog = require('./index.js');

console.log(process.argv)

changelog({
  version: pkg.version,
  subtitle: '"' + pkg.codename + '"',
  repository: process.argv[2]
}, function(err, log) {
  if (err) {
    throw new Error(err);
  }
  fs.writeFileSync('CHANGELOG.md', log);
});
