// Game state variables
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameStarted = false;
let gameActive = false;
let startTime;
let timerInterval;
let difficulty = 'easy'; // Default difficulty
let totalPairs = 6; // Default for easy mode
let colorPalettes = {
    easy: [
        '#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33', '#33FFF5',
    ],
    medium: [
        '#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33', '#33FFF5',
        '#FF8C33', '#33FF8C'
    ],
    hard: [
        '#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33', '#33FFF5',
        '#FF8C33', '#33FF8C', '#8C33FF', '#FF338C', '#8CFF33', '#338CFF'
    ]
};

// DOM elements
const gameBoard = document.getElementById('game-board');
const movesElement = document.getElementById('moves');
const matchesElement = document.getElementById('matches');
const timeElement = document.getElementById('time');
const restartBtn = document.getElementById('restart-btn');
const easyBtn = document.getElementById('easy-btn');
const mediumBtn = document.getElementById('medium-btn');
const hardBtn = document.getElementById('hard-btn');
const winModal = document.getElementById('win-modal');
const playAgainBtn = document.getElementById('play-again-btn');
const finalMovesElement = document.getElementById('final-moves');
const finalTimeElement = document.getElementById('final-time');

// Initialize the game
function initGame() {
    clearInterval(timerInterval);
    gameBoard.innerHTML = '';
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    gameStarted = false;
    gameActive = true;
    
    updateStats();
    
    // Set grid columns based on difficulty
    if (difficulty === 'easy') {
        gameBoard.style.gridTemplateColumns = 'repeat(3, 1fr)';
        totalPairs = 6;
    } else if (difficulty === 'medium') {
        gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
        totalPairs = 8;
    } else {
        gameBoard.style.gridTemplateColumns = 'repeat(6, 1fr)';
        totalPairs = 12;
    }
    
    // Create cards
    const colors = colorPalettes[difficulty].slice(0, totalPairs);
    const cardColors = [...colors, ...colors];
    shuffleArray(cardColors);
    
    cardColors.forEach((color, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.color = color;
        card.dataset.index = index;
        card.style.backgroundColor = '#ffffff';
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
        cards.push(card);
    });
}

// Flip a card
function flipCard() {
    // Start the timer on first card flip
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }
    
    // Do nothing if the game isn't active or the card is already flipped or matched
    if (!gameActive || flippedCards.length >= 2 || this.classList.contains('flipped')) {
        return;
    }
    
    // Flip the card
    this.classList.add('flipped');
    this.style.backgroundColor = this.dataset.color;
    flippedCards.push(this);
    
    // If this is the second card flipped
    if (flippedCards.length === 2) {
        moves++;
        updateStats();
        
        // Check for a match
        if (flippedCards[0].dataset.color === flippedCards[1].dataset.color) {
            matchedPairs++;
            updateStats();
            flippedCards = [];
            
            // Check for win
            if (matchedPairs === totalPairs) {
                setTimeout(() => {
                    endGame();
                }, 500);
            }
        } else {
            // If not a match, flip back
            setTimeout(() => {
                flippedCards[0].classList.remove('flipped');
                flippedCards[1].classList.remove('flipped');
                flippedCards[0].style.backgroundColor = '#ffffff';
                flippedCards[1].style.backgroundColor = '#ffffff';
                flippedCards = [];
            }, 1000);
        }
    }
}

// Update stats display
function updateStats() {
    movesElement.textContent = moves;
    matchesElement.textContent = matchedPairs;
}

// Start the timer
function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}

// Update the timer display
function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    timeElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// End the game and show the win modal
function endGame() {
    clearInterval(timerInterval);
    gameActive = false;
    
    finalMovesElement.textContent = moves;
    finalTimeElement.textContent = timeElement.textContent;
    
    winModal.classList.add('show');
    createConfetti();
}

// Create confetti animation
function createConfetti() {
    const confettiColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33', '#33FFF5'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.setProperty('--color', confettiColors[Math.floor(Math.random() * confettiColors.length)]);
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        document.body.appendChild(confetti);
        
        // Remove confetti elements after animation
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

// Utility function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Event listeners
restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', () => {
    winModal.classList.remove('show');
    initGame();
});

easyBtn.addEventListener('click', () => {
    difficulty = 'easy';
    setActiveDifficultyButton(easyBtn);
    initGame();
});

mediumBtn.addEventListener('click', () => {
    difficulty = 'medium';
    setActiveDifficultyButton(mediumBtn);
    initGame();
});

hardBtn.addEventListener('click', () => {
    difficulty = 'hard';
    setActiveDifficultyButton(hardBtn);
    initGame();
});

function setActiveDifficultyButton(activeButton) {
    [easyBtn, mediumBtn, hardBtn].forEach(btn => {
        btn.classList.remove('active');
    });
    activeButton.classList.add('active');
}

// Initialize the game on load
window.addEventListener('load', initGame);