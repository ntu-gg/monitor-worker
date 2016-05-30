var rp = require('request-promise');
var schedule = require('node-schedule');
var config = require('./config');

var rule = new schedule.RecurrenceRule();
rule.second = 0;

var jobs = [];

var headers = {
  'Accept': '*/*; q=0.01',
  'User-Agent': 'Mozilla/5.0 (Linux; U; Android 4.2.2; en-us; Google Nexus 4 - 4.2.2 - API 17 - 768x1280 Build/JDQ39E) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
};

var report = function(job_id, stime, rt, statusCode, msg) {
  return rp({
    url: config.api.endpoint + 'report',
    method: 'POST',
    json: true,
    auth: {
      user: config.api.worker_id,
      pass: config.api.secret
    },
    body: {
      job_id: job_id,
      slot: Math.round(stime/1000/60),
      stime: stime,
      rt: rt,
      statusCode: statusCode,
      msg: msg
    }
  });
};

var fetch = function() {
  return rp({
    url: config.api.endpoint + 'jobs',
    json: true,
  }).then(function(res) {
    jobs = res;
  });
}

var monitor = function() {
  jobs.forEach(function(entry) {
    new Promise(function() {
      var stime = new Date();
      rp({
        url: entry.url,
        method: 'GET',
        headers: headers,
        resolveWithFullResponse: true,
        timeout: 30000,
        simple: false
      }).then(function(res) {
        var rt = new Date() - stime;
        report(entry.id, stime, rt, res.statusCode, '');
      }).catch(function(err) {
        report(entry.id, stime, -1, -1, err.error.code);
      });
    });
  });
};

fetch().then(funciton() {
  var j = schedule.scheduleJob(rule, monitor);
});
