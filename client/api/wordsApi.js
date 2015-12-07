var $ = require('jquery');

exports.getRandomWord = function (callback) {
  $.ajax({
    url: 'http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&excludePartOfSpeech=proper-noun&minCorpusCount=50000&maxCorpusCount=-1&minDictionaryCount=5&maxDictionaryCount=-1&minLength=5&maxLength=8&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
    type: 'GET',
    success: function (data) {
      console.log(data);
      callback(data);
    },
    error: function (xhr, status, err) {
      console.log(status) ;
      console.log(err.toString());
      console.log(xhr)
    }
  });
};