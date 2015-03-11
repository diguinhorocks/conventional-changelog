var es = require('event-stream');
var Writer = require('./writer');
var config = require('../config');

var EMPTY_COMPONENT = '$$';

function writeLog(commits, options, done) {
  var log = '';
  var stream = es.through(function(data) {
    log += data;
  }, function() {
    done(null, log);
  });

  var writer = new Writer(stream, options);
  var sections = {
    fix: {},
    feat: {},
    breaks: {}
  };

  commits.forEach(function(commit) {
    var section = sections[commit.type];
    var component = commit.component || EMPTY_COMPONENT;

    if (section) {
      section[component] = section[component] || [];
      section[component].push(commit);
    }

    commit.breaks.forEach(function(breakMsg) {
      sections.breaks[EMPTY_COMPONENT] = sections.breaks[EMPTY_COMPONENT] || [];

      sections.breaks[EMPTY_COMPONENT].push({
        subject: breakMsg,
        hash: commit.hash,
        closes: []
      });
    });
  });

  if (!writer.header()) {
    return done('No version specified');
  }
  writer.section(config.log.bugfixes, sections.fix);
  writer.section(config.log.features, sections.feat);
  writer.section(config.log.updates, sections.breaks);
  writer.end();
}

module.exports = writeLog;
