const cell2dArr = [];

initialize2dArray();
resetGame();

function initialize2dArray() {
    const cellInputs = document.getElementsByClassName('cell');
    let i = 1;
    let cellRow = [];
    for(let ci of cellInputs) {
        cellRow.push(ci);
        if (i % 3 === 0) {
            cell2dArr.push(cellRow);
            cellRow = [];
        }
        i++;
    }
}

function resetGame() {
    for (let cellRow of cell2dArr) {
        for (let cell of cellRow) {
            cell.textContent = '';
            cell.disabled = false;
            cell.classList.add('btn-light');
            cell.classList.remove('btn-dark');
        }
    }
}

function humanTurn(cell) {
    const hasWinner = playerTurn(cell, 'X');

    const emptyCells = getEmptyCells();
    if(emptyCells.length > 0 && !hasWinner) {
        setTimeout( () => {
            computerTurn(emptyCells);
        }, 300);
    }
}

function computerTurn(emptyCells) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    playerTurn(emptyCells[randomIndex], 'O');
}

function playerTurn(cell, value) {
    cell.textContent = value;
    cell.disabled = true;
    cell.classList.add('btn-dark');
    cell.classList.remove('btn-light');

    return checkWinner();
}

function compareCells(...cells) {
    if (cells[0].textContent !== '' &&
        cells[0].textContent === cells[1].textContent &&
        cells[0].textContent === cells[2].textContent) {
        markCorrect(cells[0]);
        markCorrect(cells[1]);
        markCorrect(cells[2]);

        scoreWinner(cells[0]);

        return true;
    }

    return false;
}

function checkWinner() {
    let hasWinner = false;

    // check if 1st row has same values
    hasWinner = hasWinner || compareCells(cell2dArr[0][0], cell2dArr[0][1], cell2dArr[0][2]);

    // check if 2nd row has same values
    hasWinner = hasWinner || compareCells(cell2dArr[1][0], cell2dArr[1][1], cell2dArr[1][2]);

    // check if 3rd row has same values
    hasWinner = hasWinner || compareCells(cell2dArr[2][0], cell2dArr[2][1], cell2dArr[2][2]);

    // check if 1st column has same values
    hasWinner = hasWinner || compareCells(cell2dArr[0][0], cell2dArr[1][0], cell2dArr[2][0]);

    // check if 2nd column has same values
    hasWinner = hasWinner || compareCells(cell2dArr[0][1], cell2dArr[1][1], cell2dArr[2][1]);

    // check if 3rd column has same values
    hasWinner = hasWinner || compareCells(cell2dArr[0][2], cell2dArr[1][2], cell2dArr[2][2]);

    // check if topleft-to-bottomright diagonal has same values
    hasWinner = hasWinner || compareCells(cell2dArr[0][0], cell2dArr[1][1], cell2dArr[2][2]);

    // check if bottomleft-to-topright diagonal has same values
    hasWinner = hasWinner || compareCells(cell2dArr[2][0], cell2dArr[1][1], cell2dArr[0][2]);

    if (!hasWinner) {
        const emptyCells = getEmptyCells();

        if (emptyCells.length === 0) {
            scoreWinner(undefined);
            hasWinner = true;
        }
    }
    return hasWinner;
}

function markCorrect(cell) {
    cell.classList.add('btn-success');
    cell.classList.remove('btn-light');
    cell.classList.remove('btn-dark');
}

function scoreWinner(cell) {
    let winnerScoreInput;
    if (!cell) {
        showWinnerModal('DRAW');
        return;
    } else if (cell.textContent === 'X') {
        winnerScoreInput = document.getElementById('player-score');
        showWinnerModal('X');
    } else {
        winnerScoreInput = document.getElementById('computer-score');
        showWinnerModal('O');
    }

    winnerScoreInput.value = parseInt(winnerScoreInput.value) + 1;
}

function showWinnerModal(winnerResult) {
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    if (winnerResult === 'X') {
        modalTitle.textContent = 'Congratulations! You Won!';
        modalBody.textContent = 'Player Human won this game.';
    } else if (winnerResult === 'O') {
        modalTitle.textContent = 'Sorry! You Lose :(';
        modalBody.textContent = 'Player Computer won this game.';
    } else {
        modalTitle.textContent = 'It is a DRAW';
        modalBody.textContent = 'No one won this game.';
    }
    
    const winnerModal = new bootstrap.Modal(document.getElementById("winner-modal"), {});
    winnerModal.show();
}

function getEmptyCells() {
    const emptyCells = [];

    for (let cellRow of cell2dArr) {
        for (let cell of cellRow) {
            if (cell.textContent === '') {
                emptyCells.push(cell);
            }
        }
    }

    return emptyCells;
}