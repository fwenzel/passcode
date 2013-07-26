"use strict";

(function() {

// Fallback word list. Will be replaced from JSON.
var words = [
    'question',
    'president',
    'something',
    'important',
    'opportunity',
    'international',
    'universe'
];

// Home page stories.
var stories = [
    'The night watchman accidentally locked you in at work. You need a passcode to get out!',
    'You want to go to the hottest club in town. But you need a passcode to get in!',
    'You found a suitcase full of money, but you need a passcode to open it!'
];

// The current game state.
var state = {
    tries: 0,  // Default: 10
    word: '',  // word: HOUSE
    letters: []  // Letters guessed: ['S', 'H', 'X']
}

var game = {
    init: function() {
        game.showRandomStory();

        // Render on-screen keyboard
        if (!($('#keyboard .ltr').length)) {
            var div = document.querySelector('div');
            for (var i = 0; i < 26; i++) {
                var ltr = String.fromCharCode(65 + i);
                $('#keys').append($('<button data-ltr="' + ltr + '" class="ltr">' + ltr + '</button>'));
            }
        }

        // Build word list
        for (var list of ['simple', 'awl']) {
            words = [];
            $.getJSON('../data/' + list + '.json', function(data) {
                words = words.concat(data);
            });
        }
    },

    start: function() {
        state.tries = $('#tries progress').get(0).max;
        state.letters = [];

        // Letters may previously have been hidden.
        $('.ltr').show();

        game.render();
        $('#game').get(0).show();
    },

    render: function() {
        $('#tries progress').get(0).value = state.tries;

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
    },

    showRandomStory: function() {
        var rndStory = Math.floor(Math.random() * stories.length);
        $('#story').text(stories[rndStory]);
    }
};


$(function() {
    game.init();

    $('#keyboard, .button').on('click', function(e) {
        e.preventDefault();
    })

    $('#home .button').on('click', function(e) {
        game.showWordpicker();
    });

    $('#startrnd').on('click', function(e) {
        game.chooseRandomWord();
        game.start();
    });

    $('#wordpicker input').on('keyup', function(e) {
        if (e.keyCode === 13) {
            $(this).blur();
            $('#pickthis').click();
        } else {
            this.value = this.value.toUpperCase().replace(/[^A-Z]/, '');
        }
    });

    $('#pickthis').on('click', function(e) {
        var word = $('#wordpicker input').get(0).value;
        if (word) {
            state.word = word;
            game.start();
        }
    });

    $('#fin .button').on('click', function(e) {
        game.showRandomStory();
        $('#home').get(0).show();
    });

    // Keyboard click or (on desktop) keyevent
    $('#keyboard').on('click', function(e) {
        var target = $(e.target);
        if (target.hasClass('ltr')) {
            game.checkLetter(target.data('ltr'));
        }
    });
    $(document).on('keyup', function(e) {
        var letter = String.fromCharCode(e.keyCode).toUpperCase();
        if (letter.match(/[A-Z]/)) {
            $('#keyboard .ltr[data-ltr=' + letter + ']').click();
        }
    });
});


})();
