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

// The current game state.
var state = {
    tries: 0,
    word: '',  // word: HOUSE
    letters: []  // Letters guessed: ['S', 'H', 'X']
}

var game = {
    start: function() {
        state.tries = 10;

        var rndWord = Math.floor(Math.random() * words.length);
        state.word = words[rndWord].toUpperCase();

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
            $('#fin h1').text('You won!');
            $('#fin').get(0).show();
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
            $('#fin h1').text('You lost!');
            $('#fin').get(0).show();
        } else {
            game.render();
        }
    }
};


$(function() {
    $('#home .button, #fin .button').click(function(e) {
        e.preventDefault();
        game.start();
        $('#game').get(0).show();
    });

    $('#keyboard').click(function(e) {
        var target = $(e.target);
        if (target.hasClass('ltr')) {
            game.checkLetter(target.data('ltr'));
        }
    
        e.preventDefault();
    });
});


})();
