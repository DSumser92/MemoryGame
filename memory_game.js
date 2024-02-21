const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const CARD_SIZE = 100;
const PADDING = 20;
const GRID_SIZE = 4;
const NUM_PAIRS = GRID_SIZE ** 2 / 2;

const FONT_SIZE = 36;
const FONT_STYLE = `${FONT_SIZE}px Arial`;
const GAME_OVER_FONT_SIZE = 48;
const GAME_OVER_FONT_STYLE = `bold ${GAME_OVER_FONT_SIZE}px Arial`;

const symbols = Array.from({ length: NUM_PAIRS }, (_, i) => String.fromCharCode(65 + i)).flatMap(x => [x, x]);
shuffleArray(symbols);

const cards = [];
let selectedCards = [];
let matchedPairs = 0;
let gameOver = false;

canvas.addEventListener("click", handleClick);

function initializeCards() {
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const x = j * (CARD_SIZE + PADDING) + PADDING;
            const y = i * (CARD_SIZE + PADDING) + PADDING;
            cards.push({ x, y, symbol: symbols.pop(), revealed: false });
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    cards.forEach(card => {
        if (!card.revealed) {
            ctx.fillStyle = "black";
            ctx.fillRect(card.x, card.y, CARD_SIZE, CARD_SIZE);
        } else {
            ctx.fillStyle = "white";
            ctx.fillRect(card.x, card.y, CARD_SIZE, CARD_SIZE);
            ctx.font = FONT_STYLE;
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(card.symbol, card.x + CARD_SIZE / 2, card.y + CARD_SIZE / 2);
        }
    });

    if (gameOver) {
        ctx.font = GAME_OVER_FONT_STYLE;
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
    }
}

function handleClick(event) {
    if (!gameOver) {
        const clickX = event.clientX - canvas.getBoundingClientRect().left;
        const clickY = event.clientY - canvas.getBoundingClientRect().top;

        const clickedCard = cards.find(card =>
            clickX >= card.x && clickX <= card.x + CARD_SIZE &&
            clickY >= card.y && clickY <= card.y + CARD_SIZE
        );

        if (clickedCard && !clickedCard.revealed && selectedCards.length < 2) {
            selectedCards.push(clickedCard);
            clickedCard.revealed = true;
            if (selectedCards.length === 2) {
                if (selectedCards[0].symbol === selectedCards[1].symbol) {
                    selectedCards = [];
                    matchedPairs++;
                    if (matchedPairs === NUM_PAIRS) {
                        gameOver = true;
                    }
                } else {
                    setTimeout(() => {
                        selectedCards.forEach(card => card.revealed = false);
                        selectedCards = [];
                        draw();
                    }, 1000);
                }
            }
            draw();
        }
    }
}

initializeCards();
draw();

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

