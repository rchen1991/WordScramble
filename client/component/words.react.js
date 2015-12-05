//Components are like Views
//Top level app view
var React = require('react');
var wordsApi = require('../api/wordsApi');
var $ = require('jquery');

var Words = React.createClass({

  getInitialState: function () {
    return {
      originalWord: '',
      scrambledWord: this._getWord(),
      unscrambledWord: '',
      check: 'unscrambling'
    };
  },

  componentDidMount: function () {
    window.addEventListener('keydown', this._unscrambleWord);
  },

  componentWillUnmount: function() {
     window.removeEventListener('keydown', this._unscrambleWord);
  },

  render: function() {

    var scrambled = this.state.scrambledWord;
    var unscrambled = this.state.unscrambledWord;
    var check = this.state.check;

    return (
      <div className="words" >
        <span id="scrambled">{scrambled}</span>
        <span id="unscrambled" className={check}><strong>{unscrambled}</strong></span>
      </div>
    );
  },

  _shuffle: function (word) {
    var splitWord = word.split("");

    var swap = function (a,b) {
      var temp = splitWord[a];
      splitWord[a] = splitWord[b];
      splitWord[b] = temp;
    };

    for (var i = 0; i < splitWord.length; i++) {
      var pick = i + Math.floor(Math.random() * (splitWord.length - i));
      swap(i, pick);
    };

    return splitWord;
  },

  _getWord: function () {
    wordsApi.getRandomWord(function (word) {
      var shuffled = this._shuffle(word.word);
      this.setState({
        originalWord: word.word,
        scrambledWord: shuffled,
        unscrambledWord: ''
      })
    }.bind(this));
  },

  _unscrambleWord: function (e) {

    var original = this.state.originalWord;
    var scrambled = this.state.scrambledWord;
    var unscrambled = this.state.unscrambledWord;
    var character = String.fromCharCode(e.keyCode).toLowerCase();


    //Spacebar to get a new word
    if(e.keyCode === 32) {
      this._getWord();  
    }
    //Backspace
    if(e.keyCode === 8) {
      e.preventDefault();
      if(unscrambled.length !== 0 && scrambled.length > 0) {
        unscrambled = unscrambled.split("");
        var removed = unscrambled.pop();
        unscrambled = unscrambled.join("");
        scrambled.push(removed);
        console.log(unscrambled, 'join');
        this.setState({
          unscrambledWord: unscrambled,
          scrambledWord: scrambled
        });
      }
    }
    //iterate through array to see if letter is part of the word
    for(var j = 0; j < scrambled.length; j++) {
      if(character === scrambled[j]) {
        unscrambled += scrambled.splice(j,1)[0];
        this.setState({
          unscrambledWord: unscrambled
        });
        break;
      }
    }
    //Check the word to see if it is correct or not
    if (scrambled.length === 0) {
      setTimeout(function () {
        if (unscrambled === original) {
          this.setState({
            originalWord: '',
            scrambledWord: this._getWord(),
            unscrambledWord: ''
          })
          console.log('got it!')
        } else {
          this.setState({
            scrambledWord: unscrambled.split(""),
            unscrambledWord: '',
            check: 'wrong'
          });
        }
      }.bind(this), 1000);
    }
  }

});

module.exports = Words;