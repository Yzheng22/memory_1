$(document).ready(function() {
    // turn didsplay to tabs form
    $("#tabs").tabs();

    $(function() {
        //array of images path
        const imagePaths = ['images/card_1.png', 'images/card_2.png', 'images/card_3.png', 'images/card_4.png', 'images/card_5.png','images/card_6.png', 'images/card_7.png','images/card_8.png', 'images/card_9.png','images/card_10.png', 'images/card_11.png','images/card_12.png', 'images/card_13.png','images/card_14.png', 'images/card_15.png','images/card_16.png', 'images/card_17.png','images/card_18.png', 'images/card_19.png','images/card_20.png', 'images/card_21.png','images/card_22.png', 'images/card_23.png', 'images/card_24.png'];
        const backOfcard_ = 'images/back.png'; //back of card
        //iterate path of cards images
    imagePaths.forEach(function(path) {
        const img = new Image();
        img.src = path;
    });
    //default all variables set
    let cards = []; 
    let matchesFound = 0;
    let attempts = 0;
    let playerScore = 0;
    const backOfCard = 'images/back.png'; // Path to the back of the card image

  
    let highScore = localStorage.getItem('highScore') || 0;

    $('#high_score').text(`High Score: ${highScore}`);

    // Load player settings or use defaults
    let playerName = sessionStorage.getItem('playerName') || 'Player';

    let numCards = parseInt(sessionStorage.getItem('numCards')) || 48; // Default to 48 cards 
//load data of playerName and cards
    $('#player_name').val(playerName);
    $('#num_cards').val(numCards);

    function shuffleSet(numCards) {
        // even numver of cards 
        numCards = Math.min(numCards, imagePaths.length * 2);
        if (numCards % 2 !== 0) {
            numCards -= 1; 
        }
    
        let selectedImages = imagePaths.slice(0, numCards / 2); 
        selectedImages = selectedImages.concat(selectedImages); 
        shuffleArray(selectedImages); 
        cards = selectedImages; 
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap and shuffle array
        }
    }

    function startGame() {
        $('#cards').empty(); //remove card elements
        let cardHtml = '';
        for (let i = 0; i < cards.length; i++) {
            cardHtml += `<div class="card">
                            <a href="#" id="${cards[i]}">
                                <img src="${backOfCard}" alt="" data-index="${i}" class="back">
                            </a>
                        </div>`;
        }
        $('#cards').html(cardHtml);

        //cllickerevent
        $('.card > a').click(function(e) {
            e.preventDefault(); 
            let index = $(this).find('img').data('index');
            flipCard($(this), index);
        });
    }

    let firstCard = null, secondCard = null;
    let wait = false;
//flip card first and second cards
    function flipCard(card, index) {
        if (wait) return;
        if (card.find('img').hasClass('front')) return; // Ignore clicks on already flipped cards

        card.find('img').attr('src', cards[index]).addClass('front').removeClass('back');

        if (!firstCard) {
            firstCard = { card, index };
            return;
        }
        //check index
        secondCard = { card, index };
        checkMatch();
    }

    function checkMatch() {
        // Check if the two flipped cards match by comparing their src attributes
        let isMatch = firstCard.card.find('img').attr('src') === secondCard.card.find('img').attr('src');
    
        if (isMatch) {
            setTimeout(() => {
                // Replace matched cards with blank.png
                firstCard.card.find('img').attr('src', 'images/blank.png').removeClass('front');
                secondCard.card.find('img').attr('src', 'images/blank.png').removeClass('front');
    
               //off lick first and second cards
                firstCard.card.off('click');
                secondCard.card.off('click');
    
                matchesFound++;
                updateScore();
                restart();
    
                if (matchesFound * 2 === numCards) {
                    gameOver();
                }
            }, 1000);
        } else {
        //wait for timing
            wait = true;
            setTimeout(() => {
                flipBack(firstCard.card);
                flipBack(secondCard.card);
                restart();
            }, 1500);
        }
        attempts++;
    }
    
//flip back the card action
    function flipBack(card) {
        card.find('img').attr('src', backOfCard).addClass('back').removeClass('front');
    }

    function restart() {
        [firstCard, secondCard] = [null, null];
        wait = false;
    }

    function updateScore() {
        playerScore = (matchesFound / attempts) * 100;
        $('#correct').text(`Accuracy: ${playerScore.toFixed(2)}%`);
        if (playerScore > highScore) {
            highScore = playerScore;
            localStorage.setItem('highScore', playerScore);
            $('#high_score').text(`High Score: ${playerScore.toFixed(2)}%`);
        }
    }

    function gameOver() {
        alert('Game Ended Your accuracy: ' + playerScore.toFixed(2) + '%');
        
    }
//save settings in session and local storage
    $('#save_settings').click(function() {
        playerName = $('#player_name').val();
        numCards = parseInt($('#num_cards').val());
        sessionStorage.setItem('playerName', playerName);
        sessionStorage.setItem('numCards', numCards);
        location.reload(); 
    });

    // Initialize game 
    shuffleSet(numCards);
    startGame();
    $('#player').text(`Player: ${playerName}`);
    $('#high_score').text(`High Score: ${highScore}`);
});
});