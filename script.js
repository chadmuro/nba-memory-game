const cards = document.querySelectorAll('.memory-card');
const memoryBoard = document.querySelector('.memory-game');
const newBtn = document.querySelector('.new-btn');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let finalCount = 0;

function flipCard() {
    if (lockBoard)  return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if(!hasFlippedCard) {
        //first click
        hasFlippedCard = true;
        firstCard = this;

        return;
    }
    //second click
    secondCard = this;

    //do cards match
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

    isMatch ? disableCards() : unflipCards();

}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    checkWin();
    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1200);
}

function resetBoard() {
    [ hasFlippedCard, lockBoard ] = [ false, false ];
    [ firstCard, secondCard ] = [ null, null ];
}

function newGame() {
    cards.forEach(card => {
        card.classList.remove('flip');
    });

    finalCount = 0;
    resetBoard();
}

function checkWin() {
    finalCount += 2;

    if (finalCount === cards.length) {
        memoryBoard.innerHTML = 'Congratulations!';
    }
}

// (function shuffle() {
//     cards.forEach(card => {
//         let randomPos = Math.floor(Math.random() * 16);
//         card.style.order = randomPos;
//     });
// })();


//New Game Functionality
newBtn.addEventListener('click', newGame);

cards.forEach(card => card.addEventListener('click', flipCard));