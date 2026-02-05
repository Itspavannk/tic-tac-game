// ===== ELEMENTS =====
const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#reset-btn");
const newGameBtn = document.querySelector("#new-btn");
const resetScoreBtn = document.querySelector("#reset-score");
const msgContainer = document.querySelector(".msg-container");
const msg = document.querySelector("#msg");

// Mode buttons
const pvpBtn = document.querySelector("#pvp-btn");
const aiBtn = document.querySelector("#ai-btn");

// Sound
const soundBtn = document.querySelector("#sound-toggle");
const clickSound = new Audio("sounds/click.mp3");
const winSound = new Audio("sounds/win.mp3");
const drawSound = new Audio("sounds/draw.mp3");

// ===== SOUND STATE =====
let isMuted = localStorage.getItem("muted") !== "false";
soundBtn.innerText = isMuted ? "🔇" : "🔊";

soundBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  localStorage.setItem("muted", isMuted);
  soundBtn.innerText = isMuted ? "🔇" : "🔊";
});

// ===== GAME STATE =====
let turnO = true;        // PvP: O starts | PvAI: X is player
let gameOver = false;
let isAI = false;

// ===== SCOREBOARD =====
let scoreO = Number(localStorage.getItem("scoreO")) || 0;
let scoreX = Number(localStorage.getItem("scoreX")) || 0;
let scoreDraw = Number(localStorage.getItem("scoreDraw")) || 0;

const scoreOEl = document.querySelector("#score-o");
const scoreXEl = document.querySelector("#score-x");
const scoreDrawEl = document.querySelector("#score-draw");

const updateScoreUI = () => {
  scoreOEl.innerText = `O : ${scoreO}`;
  scoreXEl.innerText = `X : ${scoreX}`;
  scoreDrawEl.innerText = `Draws : ${scoreDraw}`;
};
updateScoreUI();

// ===== WIN PATTERNS =====
const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// ===== RESET GAME =====
const resetGame = () => {
  turnO = true;
  gameOver = false;
  boxes.forEach(box => {
    box.innerText = "";
    box.disabled = false;
    box.classList.remove("X","O","win");
  });
  msgContainer.classList.add("hide");
};

// ===== BOX CLICK =====
boxes.forEach(box => {
  box.addEventListener("click", () => {
    if (gameOver) return;

    // PvAI → player is always X
    if (isAI) {
      if (!turnO) return;

      box.innerText = "X";
      box.classList.add("X");
      box.disabled = true;
      turnO = false;

      if (!isMuted) {
        clickSound.currentTime = 0;
        clickSound.play();
      }

      checkWinner();

      if (!gameOver) {
        setTimeout(() => {
          aiMove(boxes, winPatterns, checkWinner);
          turnO = true;
        }, 500);
      }
    }

    // PvP → alternate turns
    else {
      if (turnO) {
        box.innerText = "O";
        box.classList.add("O");
      } else {
        box.innerText = "X";
        box.classList.add("X");
      }

      box.disabled = true;
      turnO = !turnO;

      if (!isMuted) {
        clickSound.currentTime = 0;
        clickSound.play();
      }

      checkWinner();
    }
  });
});

// ===== SHOW WINNER =====
const showWinner = (winner) => {
  gameOver = true;
  msg.innerText = `🎉 Winner is ${winner}`;
  msgContainer.classList.remove("hide");

  if (winner === "O") scoreO++;
  else scoreX++;

  localStorage.setItem("scoreO", scoreO);
  localStorage.setItem("scoreX", scoreX);
  updateScoreUI();

  boxes.forEach(box => box.disabled = true);

  for (let [a,b,c] of winPatterns) {
    if (
      boxes[a].innerText === winner &&
      boxes[b].innerText === winner &&
      boxes[c].innerText === winner
    ) {
      boxes[a].classList.add("win");
      boxes[b].classList.add("win");
      boxes[c].classList.add("win");
      break;
    }
  }

  if (!isMuted) winSound.play();
};

// ===== CHECK WIN / DRAW =====
const checkWinner = () => {
  for (let [a,b,c] of winPatterns) {
    if (
      boxes[a].innerText &&
      boxes[a].innerText === boxes[b].innerText &&
      boxes[a].innerText === boxes[c].innerText
    ) {
      showWinner(boxes[a].innerText);
      return;
    }
  }

  const isDraw = [...boxes].every(box => box.innerText !== "");
  if (isDraw && !gameOver) {
    gameOver = true;
    scoreDraw++;
    localStorage.setItem("scoreDraw", scoreDraw);
    updateScoreUI();
    msg.innerText = "🤝 It's a Draw!";
    msgContainer.classList.remove("hide");
    if (!isMuted) drawSound.play();
  }
};

// ===== RESET SCOREBOARD =====
const resetScoreboard = () => {
  scoreO = scoreX = scoreDraw = 0;
  localStorage.setItem("scoreO", 0);
  localStorage.setItem("scoreX", 0);
  localStorage.setItem("scoreDraw", 0);
  updateScoreUI();
};

// ===== MODE TOGGLE =====
pvpBtn.addEventListener("click", () => {
  isAI = false;
  pvpBtn.classList.add("active");
  aiBtn.classList.remove("active");
  resetGame();
});

aiBtn.addEventListener("click", () => {
  isAI = true;
  aiBtn.classList.add("active");
  pvpBtn.classList.remove("active");
  resetGame();
});

// ===== BUTTON EVENTS =====
newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
resetScoreBtn.addEventListener("click", resetScoreboard);
