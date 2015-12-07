//Components are like Views
//Top level app view
var React = require('react');
var wordsApi = require('../api/wordsApi');
var $ = require('jquery');

var Words = React.createClass({

  getInitialState: function () {
    return {
      originalWord: '',
      scrambledWord: [],
      unscrambledWord: [],
      check: 'guessing',
      checkFlag: true
    };
  },

  componentDidMount: function () {
    this._getWord();
    window.addEventListener('keydown', this._unscrambleWord);
  },

  componentWillUnmount: function() {
     window.removeEventListener('keydown', this._unscrambleWord);
  },

  render: function() {
    if(this.state.scrambledWord) {
      var scrambled = this.state.scrambledWord;
      var letterScramble = scrambled.map(function(letter, i) {
        return (
          <span className="letter" key={i}>{letter}</span>
        )
      })
    }
    if(this.state.unscrambledWord) {
      var unscrambled = this.state.unscrambledWord;
      var letterUnscramble = unscrambled.map(function(letter, i) {
        return (
          <span className="letter" key={i + 1}><strong>{letter}</strong></span>
        )
      })
    }
    var check = this.state.check;


    return (
      <div id="game">
        <div id="word" className={check}>
          <span id="scrambled">
          {letterScramble}
          </span>
          <span id="unscrambled">
          {letterUnscramble}
          </span>
        </div>
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
    //returns an array
    return splitWord;
  },

  _getWord: function () {
    wordsApi.getRandomWord(function (word) {
      var lowerCase = word.word.toLowerCase();
      var shuffled = this._shuffle(lowerCase);
      this.setState({
        originalWord: word.word.toLowerCase(),
        scrambledWord: shuffled,
        unscrambledWord: []
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
        var removed = unscrambled.pop();
        scrambled.push(removed);
        this.setState({
          unscrambledWord: unscrambled,
          scrambledWord: scrambled
        });
      }
    }
    //iterate through array to see if letter is part of the word
    for(var j = 0; j < scrambled.length; j++) {
      if(character === scrambled[j]) {
        unscrambled.push(scrambled.splice(j,1)[0]);
        this.setState({
          unscrambledWord: unscrambled
        });
        break;
      }
    }
    //Check the word to see if it is correct
    if (scrambled.length === 0 && this.state.checkFlag) {
      if (unscrambled.join("") === original) {
        this.setState({
          check: 'correct',
          checkFlag: false
        });
        setTimeout(function () {
          this.setState({
            originalWord: '',
            scrambledWord: this._getWord(),
            unscrambledWord: [],
            check: 'guessing',
            checkFlag: true
          })
        }.bind(this), 1000 );
      } else {
          this.setState({
            check: 'wrong',
            checkFlag: false
          });
          setTimeout(function () {
            this.setState({
              scrambledWord: unscrambled,
              unscrambledWord: [],
              check: 'guessing',
              checkFlag: true
            })
          }.bind(this), 1000 );
        }
    }
  }
});

module.exports = Words;