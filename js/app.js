"use strict";

(function() {

// XXX need an actual word list
var words = [
    'question',
    'president',
    'something',
    'important',
    'opportunity',
    'international',
    'universe'
];

var stories = [
    'The night watchman accidentally locked you in at work. You need a passcode to get out!',
    'You want to go to the hottest club in town. But you need a passcode to get in!',
    'You found a suitcase full of money, but you need a passcode to open it!'
];

// The current game state.
var state = {
    tries: 0,
    word: '',  // word: HOUSE
    letters: []  // Letters guessed: ['S', 'H', 'X']
}

var game = {
    init: function() {
        var rndStory = Math.floor(Math.random() * stories.length);
        $('#story').text(stories[rndStory]);
    },

    start: function() {
        state.tries = 10;

        state.letters = [];

        console.log(state); // For dev

        if (!($('#keyboard .ltr').length)) {  // Render on-screen keyboard
            var div = document.querySelector('div');
            for (var i = 0; i < 26; i++) {
                var ltr = String.fromCharCode(65 + i);
                $('#keyboard').append($('<button data-ltr="' + ltr + '" class="ltr">' + ltr + '</button>'));
            }
        }
        $('#keyboard .ltr').show();

        game.render();

        $('#game').get(0).show();
    },

    render: function() {
        $('#tries').text(state.tries + ' tries left');

        var visible = '';  // visible word: H__S_
        for (var letter of state.word) {
            // Only reveal already guessed letters.
            visible += (state.letters.indexOf(letter) !== -1) ? letter : '_';
        }

        // End of game?
        if (visible.indexOf('_') === -1) {
            game.win();
        } else {
            $('#word').text(visible);
        }
    },

    checkLetter: function(ltr) {
        if (state.letters.indexOf(ltr) !== -1) return;
        state.letters.push(ltr);

        $('.ltr[data-ltr=' + ltr + ']').hide();

        // Failed try?
        if (state.word.indexOf(ltr) === -1) {
            state.tries -= 1;
        }
        if (state.tries === 0) {
            game.lose();
        } else {
            game.render();
        }
    },

    win: function() {
        $('#fin h1').text('You won!');
        $('#fin p b').text(state.word);
        $('#fin').get(0).show();
    },

    lose: function() {
        $('#fin h1').text('You lost!');
        $('#fin p b').text(state.word);
        $('#fin').get(0).show();
    },

    showWordpicker: function() {
        $('#wordpicker input').get(0).value = '';
        $('#wordpicker').get(0).show();
    },

    chooseRandomWord: function() {
        var rndWord = Math.floor(Math.random() * words.length);
        state.word = words[rndWord].toUpperCase();
    }
};


$(function() {
    game.init();

    // Hook up all buttons
    $('#home .button').on('click', function(e) {
        e.preventDefault();
        game.showWordpicker();
    });

    $('#startrnd').on('click', function(e) {
        e.preventDefault();
        game.chooseRandomWord();
        game.start();
    });

    $('#wordpicker input').on('keyup', function() {
        this.value = this.value.toUpperCase().replace(/[^A-Z]/, '');
    });

    $('#pickthis').on('click', function(e) {
        e.preventDefault();
        var word = $('#wordpicker input').get(0).value;
        if (word) {
            state.word = word;
            game.start();
        }
    });

    $('#fin .button').click(function(e) {
        e.preventDefault();
        game.init();
        $('#home').get(0).show();
    });

    $('#keyboard').click(function(e) {
        e.preventDefault();

        var target = $(e.target);
        if (target.hasClass('ltr')) {
            game.checkLetter(target.data('ltr'));
        }
    });
});


})();
