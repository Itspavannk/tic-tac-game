function aiMove(boxes, winPatterns, checkWinner) {
  // Try to win
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    let values = [boxes[a], boxes[b], boxes[c]];

    let oCount = values.filter(v => v.innerText === "O").length;
    let empty = values.find(v => v.innerText === "");

    if (oCount === 2 && empty) {
      playO(empty);
      checkWinner();
      return;
    }
  }

  // Block X
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    let values = [boxes[a], boxes[b], boxes[c]];

    let xCount = values.filter(v => v.innerText === "X").length;
    let empty = values.find(v => v.innerText === "");

    if (xCount === 2 && empty) {
      playO(empty);
      checkWinner();
      return;
    }
  }

  // Random move
  let emptyBoxes = [...boxes].filter(b => b.innerText === "");
  if (emptyBoxes.length === 0) return;

  playO(emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)]);
  checkWinner();
}

function playO(box) {
  box.innerText = "O";
  box.classList.add("O");
  box.disabled = true;
}
