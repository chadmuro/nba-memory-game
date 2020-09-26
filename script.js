const memoryBoard = document.querySelector('.memory-game');
const card = document.querySelector('.memory-card');
const newBtn = document.querySelector('.new-btn');
const win = document.querySelector('.win-text');
const settings = document.querySelector('.level-form');

const easyBtn = document.getElementById('easy');
const normalBtn = document.getElementById('normal');
const hardBtn = document.getElementById('hard');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let finalCount = 0;
let totalCount = 0;

const easy = ['lakers', 'mavericks', 'warriors'];
const normal = ['knicks', 'lakers', 'magic', 'mavericks', 'raptors', 'warriors'];
const hard = ['bucks', 'bulls', 'celtics', 'kings', 'knicks', 'lakers', 'magic', 'mavericks', 'raptors', 'warriors'];
let refresh;

// Set difficulty to value in local storage or normal
let difficulty =  localStorage.getItem('difficulty') !== null ? localStorage.getItem('difficulty') : 'normal';

// Set difficulty select value
settings.value = localStorage.getItem('difficulty') !== null ? localStorage.getItem('difficulty') : 'normal';

let checked = settings.value;
if (checked === 'easy') {
    easyBtn.checked = true;
    refresh = easy;
} else if (checked === 'hard') {
    hardBtn.checked = true;
    refresh = hard;
} else {
    normalBtn.checked = true;
    refresh = normal;
}

// Initialize new game
newGame(refresh);


//GAME FUNCTIONALITY
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

function checkWin() {
    finalCount += 1;

    if (finalCount === totalCount) {
        win.innerHTML = `
            <h1>Congratulations! You win!</h1>
            <p>Your final score is 100</p>
            <br>
            <button onclick="newGame(${difficulty})">New Game?</button>
        `;

        win.style.display = 'flex';
    }
}

//NEW GAME FUNCTIONALITY
function newGame(level) {
    memoryBoard.innerHTML = '';
    level.forEach(team => {
        let randomPos = Math.floor(Math.random() * 20);
        let randomPos2 = Math.floor(Math.random() * 20);
		
        const newDiv = document.createElement('div');
        const newDiv2 = document.createElement('div');

        newDiv.innerHTML = `
                <img src="img/nba.png" alt="NBA logo" class="front-face">
                <img src="img/${team}.png" alt="${team}" class="back-face">
        `;
        newDiv.classList.add('memory-card');
        newDiv.dataset.framework = `${team}`;
        newDiv.style.order = randomPos;

        newDiv2.innerHTML = `
                <img src="img/nba.png" alt="NBA logo" class="front-face">
                <img src="img/${team}.png" alt="${team}" class="back-face">
        `;
        newDiv2.classList.add('memory-card');
        newDiv2.dataset.framework = `${team}`;
        newDiv2.style.order = randomPos2;

        memoryBoard.appendChild(newDiv);
        memoryBoard.appendChild(newDiv2);
    });

    win.style.display = 'none';
    finalCount = 0;
    
    if (level === easy) {
            totalCount = easy.length;
            memoryBoard.style.gridTemplateRows = 'repeat(2, minmax(50px, 200px))';
            memoryBoard.style.gridTemplateColumns = 'repeat(3, minmax(50px, 200px))';

		} else if (level === hard) {
            totalCount = hard.length;
            memoryBoard.style.gridTemplateRows = 'repeat(4, minmax(50px, 200px))';
            memoryBoard.style.gridTemplateColumns = 'repeat(5, minmax(50px, 200px))';
		} else {
            totalCount = normal.length;
            memoryBoard.style.gridTemplateRows = 'repeat(3, minmax(50px, 200px))';
            memoryBoard.style.gridTemplateColumns = 'repeat(4, minmax(50px, 200px))';
		}

    resetBoard();

    for(let i = 0; i < memoryBoard.children.length; i++) {
        memoryBoard.children[i].addEventListener('click', flipCard);
        memoryBoard.children[i].classList.remove('flip');
    }

}



//SHUFFLE BOARD IIFE
// (function shuffle() {
//     cards.forEach(card => {
//         let randomPos = Math.floor(Math.random() * 16);
//         card.style.order = randomPos;
//     });
// })();


//EVENT LISTENERS
newBtn.addEventListener('click', function(){
    if (difficulty === 'easy') {
        newGame(easy);
    } else if (difficulty === 'hard') {
        newGame(hard);
    } else {
        newGame(normal);
    }
});

settings.addEventListener('change', e => {
    difficulty = e.target.value;
    localStorage.setItem('difficulty', difficulty);

    if(difficulty === 'easy') {
        newGame(easy);
    } else if(difficulty === 'hard') {
        newGame(hard);
    } else {
        newGame(normal);
    }
});