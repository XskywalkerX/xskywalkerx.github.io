const ROWS = 6;
const playerBoards = {
  1: [],
  2: []
};
const ships = {
  1: [],
  2: []
};
let placingPlayer = 1;
let currentPlayer = 1;
let gameStarted = false;

function binomial(n, k) {
  if (k > n || k < 0) return 0;
  let res = 1;
  for (let i = 0; i < k; i++) {
    res *= (n - i);
    res /= (i + 1);
  }
  return res;
}

function initBoard(player) {
  const table = document.getElementById(`player${player}-board`);
  playerBoards[player] = [];
  table.innerHTML = '';

  const header = document.createElement('tr');
  header.appendChild(document.createElement('th'));
  for (let k = 0; k <= ROWS; k++) {
    const th = document.createElement('th');
    th.textContent = k;
    header.appendChild(th);
  }
  table.appendChild(header);

  for (let n = 0; n <= ROWS; n++) {
    const row = document.createElement('tr');
    const rowHeader = document.createElement('th');
    rowHeader.textContent = n;
    row.appendChild(rowHeader);

    const boardRow = [];
    for (let k = 0; k <= ROWS; k++) {
      const cell = document.createElement('td');
      if (k > n) {
        cell.textContent = '';
        cell.style.pointerEvents = 'none';
      } else {
        cell.textContent = `(${n}/${k})`;
        cell.dataset.n = n;
        cell.dataset.k = k;
        cell.dataset.player = player;
        cell.addEventListener('click', handleCellClick);
      }
      row.appendChild(cell);
      boardRow.push(cell);
    }
    table.appendChild(row);
    playerBoards[player].push(boardRow);
  }
}

function handleCellClick() {
  const n = parseInt(this.dataset.n);
  const k = parseInt(this.dataset.k);
  const player = parseInt(this.dataset.player);

  if (!gameStarted && player === placingPlayer) {
    const shipKey = `${n},${k}`;
    if (!ships[placingPlayer].some(s => s.n === n && s.k === k)) {
      ships[placingPlayer].push({ n, k, hit: false });
      this.classList.add('ship');
    }
  }
}

function switchTurns() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  document.getElementById('turn-indicator').textContent = `Player ${currentPlayer}'s Turn`;
  updateBoardVisibility();
}

function updateBoardVisibility() {
  [1, 2].forEach(p => {
    const board = playerBoards[p];
    for (let n = 0; n <= ROWS; n++) {
      for (let k = 0; k <= ROWS; k++) {
        const cell = board[n][k];
        const isShip = ships[p].some(s => s.n === n && s.k === k);
        const isHit = ships[p].some(s => s.n === n && s.k === k && s.hit);

        cell.classList.remove('ship', 'hit', 'miss');
        if (!gameStarted) {
          cell.style.visibility = (p === placingPlayer) ? 'visible' : 'hidden';
        } else {
          cell.style.visibility = 'hidden';
          if (isHit) {
            cell.classList.add('hit');
          } else if (p === currentPlayer) {
            if (isShip) cell.classList.add('ship');
          }
        }
      }
    }
  });
}

function handleSubmit() {
  if (!gameStarted) return;

  const input = document.getElementById('binomial-input').value.trim();
  const match = input.match(/\((\d+)\/(\d+)\)/);
  if (!match) {
    showMessage("Enter binomial format like (3/2)");
    return;
  }

  const n = parseInt(match[1]);
  const k = parseInt(match[2]);
  const opponent = currentPlayer === 1 ? 2 : 1;

  if (n > ROWS || k > ROWS || k > n) {
    showMessage("Invalid position.");
    return;
  }

  const targetCell = playerBoards[opponent][n][k];
  const ship = ships[opponent].find(s => s.n === n && s.k === k);
  if (ship && !ship.hit) {
    ship.hit = true;
    targetCell.classList.add('hit');
    showMessage(`🔥 Hit on (${n}/${k})!`);
  } else {
    targetCell.classList.add('miss');
    showMessage(`💨 Miss at (${n}/${k}).`);
  }

  if (ships[opponent].every(s => s.hit)) {
    showMessage(`🎉 Player ${currentPlayer} wins the battle!`);
    document.getElementById('submit-answer').disabled = true;
    document.getElementById('binomial-input').disabled = true;
  } else {
    switchTurns();
  }
}

function showMessage(msg) {
  document.getElementById('message').textContent = msg;
}

// Start game after both players place ships
document.getElementById('start-game').addEventListener('click', () => {
  if (placingPlayer === 1) {
    if (ships[1].length === 0) {
      alert("Player 1 must place at least one ship.");
      return;
    }
    placingPlayer = 2;
    showMessage("Now Player 2 places ships.");
    updateBoardVisibility();
  } else if (placingPlayer === 2) {
    if (ships[2].length === 0) {
      alert("Player 2 must place at least one ship.");
      return;
    }
    gameStarted = true;
    currentPlayer = 1;
    document.getElementById('start-game').style.display = 'none';
    document.querySelectorAll('td').forEach(td => td.removeEventListener('click', handleCellClick));
    updateBoardVisibility();
    showMessage("Game started! Player 1's turn.");
  }
});

document.getElementById('submit-answer').addEventListener('click', handleSubmit);

initBoard(1);
initBoard(2);
updateBoardVisibility();
