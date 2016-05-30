var rp = require('request-promise');
var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
rule.second = 0;

var urls = [
  'https://my.ntu.edu.tw/',
  'https://ceiba.ntu.edu.tw/',
  'https://mail.ntu.edu.tw/',
  'https://ifsel3.aca.ntu.edu.tw/', // 成績查詢
  'https://if163.aca.ntu.edu.tw/eportfolio/', // ePo
  'https://if192.aca.ntu.edu.tw/', // 選課系統
  'https://if177.aca.ntu.edu.tw/', // 選課系統 2
  'https://nol.ntu.edu.tw/nol/guest/index.php', // 課程網
  'https://nol2.aca.ntu.edu.tw/nol/guest/index.php', // 課程網 2
  'https://www.space.ntu.edu.tw/navigate/' // NTU Space
];

var headers = {
  'Accept': '*/*; q=0.01',
  'User-Agent': 'Mozilla/5.0 (Linux; U; Android 4.2.2; en-us; Google Nexus 4 - 4.2.2 - API 17 - 768x1280 Build/JDQ39E) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
};

var monitor = function() {
  urls.forEach(function(url) {
    new Promise(function() {
      var stime = new Date();
      rp({
        url: url,
        method: 'GET',
        headers: headers,
        resolveWithFullResponse: true,
        simple: false
      }).then(function(res) {
        var rt = new Date() - stime;
        console.log(Math.round(stime/1000/60), stime, url, res.statusCode, rt + 'ms');
      });
    });
  });
};

var j = schedule.scheduleJob(rule, monitor);
