const board = document.querySelector('#board');
const modal = document.querySelector('#modal');
const newGameBtn = document.querySelector('#newGameBtn');
const spanScore = document.querySelector('#score');
const spanBest = document.querySelector('#best');

const cellContents = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

const groupCellsColumn = [
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
];

const groupCellsRow = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
];

let score = +JSON.parse(localStorage.getItem('score'));
let best = +JSON.parse(localStorage.getItem('best'));

function getNumber() {
    return Math.round(Math.random() * 100) >= 10 ? 2 : 4;
}

function getCell(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const number = [];

for (let i = 0; i < 2; i++) {
    number.push(getNumber());
}

const cellNumber = [];

function addCellNumber() {
    for (let i = 0; i < 2; i++) {
        cellNumber[i] = getCell(0, 15);
    }

    if (cellNumber[0] === cellNumber[1]) {
        return addCellNumber();
    }
}

addCellNumber();

function addFirstNumbers() {
    cellContents.forEach((item, index) => {
        cellNumber.forEach((cell) => {
            if (index === cell) {
                cellContents[index] = number.shift();
            }
        });
    });
    score = 0;
}

  addFirstNumbers();  

function addLastNumbers() {
    const freeCells = cellContents
        .map((item, index) => {
            if (item === 0) return index;
        })
        .filter((item) => item !== undefined);
    let randomNumber;
    if (freeCells.length > 1) {
        randomNumber = getCell(1, freeCells.length - 1);

        cellContents[freeCells[randomNumber]] = getNumber();
    } else {
        cellContents[freeCells[0]] = getNumber();
    }
}

function renderBoard() {

    for (let i = 0; i < 16; i++) {
        let cell = document.createElement('div');
        cell.className = 'cell';

        if (cellContents[i] !== 0) {
            cell.textContent = `${ cellContents[i] }`;
            if(cellContents[i] === 2) {
                cell.classList.add('aquamarine');
            } else if (cellContents[i] === 4) {
                cell.classList.add('aqua');
            } else if (cellContents[i] === 8) {
                cell.classList.add('lightSteelBlue');
            } else if (cellContents[i] === 16) {
                cell.classList.add('lightSkyBlue');
            } else if (cellContents[i] === 32) {
                cell.classList.add('deepSkyBlue');
            } else if (cellContents[i] === 64) {
                cell.classList.add('dodgerBlue');
            } else if (cellContents[i] === 128) {
                cell.classList.add('cornflowerBlue');
            } else if (cellContents[i] === 256) {
                cell.classList.add('mediumSlateBlue');
            } else if (cellContents[i] === 512) {
                cell.classList.add('cadetBlue');
            } else if (cellContents[i] === 1024) {
                cell.classList.add('steelBlue');
            } else if (cellContents[i] === 2048) {
                cell.classList.add('royalBlue');
            }
        }
        spanScore.innerText = `${ score }`;
        spanBest.innerText = `${ best }`;
        board.append(cell);

    }

    localStorage.setItem('score', JSON.stringify(score));
    localStorage.setItem('best', JSON.stringify(best));
}

renderBoard();

const handleKeydown = (event) => {
    const cellContentsBeforeChanges = Array.from(cellContents);

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        groupCellsColumn.forEach((cellsColumn) => {
            const cellNumbersWithValue = cellsColumn.filter((item) => {
                return cellContents[item] !== 0;
            });
            const values = cellNumbersWithValue.map((numItem) => {
                return cellContents[numItem];
            });

            if (cellNumbersWithValue.length === 1) {

                if (event.key === 'ArrowUp' && cellNumbersWithValue[0] !== cellsColumn[0]) {
                    cellContents[cellsColumn[0]] = cellContents[cellNumbersWithValue[0]];
                    cellContents[cellNumbersWithValue[0]] = 0;
                }

                if (event.key === 'ArrowDown' && cellNumbersWithValue[0] !== cellsColumn[3]) {
                    cellContents[cellsColumn[3]] = cellContents[cellNumbersWithValue[0]];
                    cellContents[cellNumbersWithValue[0]] = 0;
                }
            }

            if (cellNumbersWithValue.length === 2) {
                if (values[0] === values[1]) {
                    for (let i = 0; i < cellsColumn.length; i++) {
                        if (event.key === 'ArrowUp' && i === 0) {
                            cellContents[cellsColumn[i]] = values[0] + values[1];
                        } else if (event.key === 'ArrowDown' && i === 3) {
                            cellContents[cellsColumn[i]] = values[0] + values[1];
                        } else {
                            cellContents[cellsColumn[i]] = 0;
                        }
                    }
                    score += (values[0] + values[1]);
                } else {
                    for (let i = 0; i < cellsColumn.length; i++) {
                        if (event.key === 'ArrowUp' && (i === 0 || i === 1)) {
                            cellContents[cellsColumn[0]] = values[0];
                            cellContents[cellsColumn[1]] = values[1];
                        } else if (event.key === 'ArrowDown' && i === 2) {
                            cellContents[cellsColumn[i]] = values[0];
                        } else if (event.key === 'ArrowDown' && i === 3) {
                            cellContents[cellsColumn[i]] = values[1];
                        } else {
                            cellContents[cellsColumn[i]] = 0;
                        }
                    }
                }
            }

            if (cellNumbersWithValue.length === 3) {
                const newValues = [];
                let valuesFor3;

                if (event.key === 'ArrowUp') {
                    valuesFor3 = values;
                } else if (event.key === 'ArrowDown') {
                    valuesFor3 = values.reverse();
                }

                if (valuesFor3[0] === valuesFor3[1]) {
                    newValues.push(valuesFor3[0] + valuesFor3[1]);
                    newValues.push(valuesFor3[2]);
                    score += valuesFor3[0] + valuesFor3[1];
                }

                if (valuesFor3[0] !== valuesFor3[1]) {
                    newValues.push(valuesFor3[0]);
                }
                if (valuesFor3[0] !== valuesFor3[1] && valuesFor3[1] === valuesFor3[2]) {
                    newValues.push(valuesFor3[1] + valuesFor3[2]);
                    score += valuesFor3[1] + valuesFor3[2];
                }

                if (valuesFor3[0] !== valuesFor3[1] && valuesFor3[1] !== valuesFor3[2]) {
                    newValues.push(valuesFor3[1]);
                    newValues.push(valuesFor3[2]);
                }

                for (let i = 0; i < cellsColumn.length; i++) {
                    if (event.key === 'ArrowUp') {
                        if (newValues.length === 2 && (i === 0 || i === 1)) {
                            cellContents[cellsColumn[0]] = newValues[0];
                            cellContents[cellsColumn[1]] = newValues[1];
                        } else if (newValues.length === 3 && (i === 0 || i === 1 || i === 2)) {
                            cellContents[cellsColumn[0]] = newValues[0];
                            cellContents[cellsColumn[1]] = newValues[1];
                            cellContents[cellsColumn[2]] = newValues[2];
                        } else {
                            cellContents[cellsColumn[i]] = 0;
                        }
                    }
                    if (event.key === 'ArrowDown') {
                        if (newValues.length === 2 && (i === 2 || i === 3)) {
                            cellContents[cellsColumn[2]] = newValues[1];
                            cellContents[cellsColumn[3]] = newValues[0];
                        } else if (newValues.length === 3 && (i === 1 || i === 2 || i === 3)) {
                            cellContents[cellsColumn[1]] = newValues[2];
                            cellContents[cellsColumn[2]] = newValues[1];
                            cellContents[cellsColumn[3]] = newValues[0];
                        } else {
                            cellContents[cellsColumn[i]] = 0;
                        }
                    }
                }
            }

            if (cellNumbersWithValue.length === 4) {
                const newValues = [];
                let valuesFor4;
                if (event.key === 'ArrowUp') {
                    valuesFor4 = values;
                } else if (event.key === 'ArrowDown') {
                    valuesFor4 = values.reverse();
                }
                if (valuesFor4[0] === valuesFor4[1] && valuesFor4[2] !== valuesFor4[3]) {
                    newValues.push(valuesFor4[0] + valuesFor4[1], valuesFor4[2], valuesFor4[3]);
                    score += valuesFor4[0] + valuesFor4[1];
                }
                if (valuesFor4[0] === valuesFor4[1] && valuesFor4[2] === valuesFor4[3]) {
                    newValues.push(valuesFor4[0] + valuesFor4[1], valuesFor4[2] + valuesFor4[3]);
                    score += valuesFor4[0] + valuesFor4[1] + valuesFor4[2] + valuesFor4[3];
                }
                if (valuesFor4[0] !== valuesFor4[1] && valuesFor4[1] === valuesFor4[2]) {
                    newValues.push(valuesFor4[0], valuesFor4[1] + valuesFor4[2], valuesFor4[3]);
                    score += valuesFor4[1] + valuesFor4[2];
                }
                if (valuesFor4[0] !== valuesFor4[1] && valuesFor4[1] !== valuesFor4[2] && valuesFor4[2] === valuesFor4[3]) {
                    newValues.push(valuesFor4[0], valuesFor4[1], valuesFor4[2] + valuesFor4[3]);
                    score += valuesFor4[2] + valuesFor4[3];
                }

                for (let i = 0; i < cellsColumn.length; i++) {
                    if (event.key === 'ArrowUp') {
                        if (newValues.length === 2 && (i === 0 || i === 1)) {
                            cellContents[cellsColumn[0]] = newValues[0];
                            cellContents[cellsColumn[1]] = newValues[1];
                            cellContents[cellsColumn[2]] = 0;
                            cellContents[cellsColumn[3]] = 0;
                        } else if (newValues.length === 3 && (i === 0 || i === 1 || i === 2)) {
                            cellContents[cellsColumn[0]] = newValues[0];
                            cellContents[cellsColumn[1]] = newValues[1];
                            cellContents[cellsColumn[2]] = newValues[2];
                            cellContents[cellsColumn[3]] = 0;
                        }
                    }
                    if (event.key === 'ArrowDown') {
                        if (newValues.length === 2 && (i === 2 || i === 3)) {
                            cellContents[cellsColumn[0]] = 0;
                            cellContents[cellsColumn[1]] = 0;
                            cellContents[cellsColumn[2]] = newValues[1];
                            cellContents[cellsColumn[3]] = newValues[0];
                        } else if (newValues.length === 3 && (i === 1 || i === 2 || i === 3)) {
                            cellContents[cellsColumn[0]] = 0;
                            cellContents[cellsColumn[1]] = newValues[2];
                            cellContents[cellsColumn[2]] = newValues[1];
                            cellContents[cellsColumn[3]] = newValues[0];
                        }
                    }
                }
            }
        });
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {

        groupCellsRow.forEach((cellsRow) => {
            const cellNumbersWithValueForRow = cellsRow.filter((item) => {
                return cellContents[item] !== 0;
            });

            const valuesRow = cellNumbersWithValueForRow.map((numItem) => {
                return cellContents[numItem];
            });
            if (cellNumbersWithValueForRow.length === 1) {

                if (event.key === 'ArrowLeft' && cellNumbersWithValueForRow[0] !== cellsRow[0]) {
                    cellContents[cellsRow[0]] = cellContents[cellNumbersWithValueForRow[0]];
                    cellContents[cellNumbersWithValueForRow[0]] = 0;
                }

                if (event.key === 'ArrowRight' && cellNumbersWithValueForRow[0] !== cellsRow[3]) {
                    cellContents[cellsRow[3]] = cellContents[cellNumbersWithValueForRow[0]];
                    cellContents[cellNumbersWithValueForRow[0]] = 0;
                }
            }

            if (cellNumbersWithValueForRow.length === 2) {
                if (valuesRow[0] === valuesRow[1]) {
                    for (let i = 0; i < cellsRow.length; i++) {
                        if (event.key === 'ArrowLeft' && i === 0) {
                            cellContents[cellsRow[i]] = valuesRow[0] + valuesRow[1];
                        } else if (event.key === 'ArrowRight' && i === 3) {
                            cellContents[cellsRow[i]] = valuesRow[0] + valuesRow[1];
                        } else {
                            cellContents[cellsRow[i]] = 0;
                        }
                    }
                    score += valuesRow[0] + valuesRow[1];
                } else {
                    for (let i = 0; i < cellsRow.length; i++) {
                        if (event.key === 'ArrowLeft' && (i === 0 || i === 1)) {
                            cellContents[cellsRow[0]] = valuesRow[0];
                            cellContents[cellsRow[1]] = valuesRow[1];
                        } else if (event.key === 'ArrowRight' && i === 2) {
                            cellContents[cellsRow[i]] = valuesRow[0];
                        } else if (event.key === 'ArrowRight' && i === 3) {
                            cellContents[cellsRow[i]] = valuesRow[1];
                        } else {
                            cellContents[cellsRow[i]] = 0;
                        }
                    }
                }
            }

            if (cellNumbersWithValueForRow.length === 3) {
                const newValuesForRow = [];
                let rowValuesFor3;

                if (event.key === 'ArrowLeft') {
                    rowValuesFor3 = valuesRow;
                } else if (event.key === 'ArrowRight') {
                    rowValuesFor3 = valuesRow.reverse();
                }

                if (rowValuesFor3[0] === rowValuesFor3[1]) {
                    newValuesForRow.push(rowValuesFor3[0] + rowValuesFor3[1]);
                    newValuesForRow.push(rowValuesFor3[2]);
                    score += rowValuesFor3[0] + rowValuesFor3[1];
                }

                if (rowValuesFor3[0] !== rowValuesFor3[1]) {
                    newValuesForRow.push(rowValuesFor3[0]);
                }
                if (rowValuesFor3[0] !== rowValuesFor3[1] && rowValuesFor3[1] === rowValuesFor3[2]) {
                    newValuesForRow.push(rowValuesFor3[1] + rowValuesFor3[2]);
                    score += rowValuesFor3[1] + rowValuesFor3[2];
                }

                if (rowValuesFor3[0] !== rowValuesFor3[1] && rowValuesFor3[1] !== rowValuesFor3[2]) {
                    newValuesForRow.push(rowValuesFor3[1]);
                    newValuesForRow.push(rowValuesFor3[2]);
                }

                for (let i = 0; i < cellsRow.length; i++) {
                    if (event.key === 'ArrowLeft') {
                        if (newValuesForRow.length === 2 && (i === 0 || i === 1)) {
                            cellContents[cellsRow[0]] = newValuesForRow[0];
                            cellContents[cellsRow[1]] = newValuesForRow[1];
                        } else if (newValuesForRow.length === 3 && (i === 0 || i === 1 || i === 2)) {
                            cellContents[cellsRow[0]] = newValuesForRow[0];
                            cellContents[cellsRow[1]] = newValuesForRow[1];
                            cellContents[cellsRow[2]] = newValuesForRow[2];
                        } else {
                            cellContents[cellsRow[i]] = 0;
                        }
                    }
                    if (event.key === 'ArrowRight') {
                        if (newValuesForRow.length === 2 && (i === 2 || i === 3)) {
                            cellContents[cellsRow[2]] = newValuesForRow[1];
                            cellContents[cellsRow[3]] = newValuesForRow[0];
                        } else if (newValuesForRow.length === 3 && (i === 1 || i === 2 || i === 3)) {
                            cellContents[cellsRow[1]] = newValuesForRow[2];
                            cellContents[cellsRow[2]] = newValuesForRow[1];
                            cellContents[cellsRow[3]] = newValuesForRow[0];
                        } else {
                            cellContents[cellsRow[i]] = 0;
                        }
                    }
                }
            }

            if (cellNumbersWithValueForRow.length === 4) {
                const newValuesForRow = [];
                let rowValuesFor4;
                if (event.key === 'ArrowLeft') {
                    rowValuesFor4 = valuesRow;
                } else if (event.key === 'ArrowRight') {
                    rowValuesFor4 = valuesRow.reverse();
                }
                if (rowValuesFor4[0] === rowValuesFor4[1] && rowValuesFor4[2] !== rowValuesFor4[3]) {
                    newValuesForRow.push(rowValuesFor4[0] + rowValuesFor4[1], rowValuesFor4[2], rowValuesFor4[3]);
                    score += rowValuesFor4[0] + rowValuesFor4[1];
                }
                if (rowValuesFor4[0] === rowValuesFor4[1] && rowValuesFor4[2] === rowValuesFor4[3]) {
                    newValuesForRow.push(rowValuesFor4[0] + rowValuesFor4[1], rowValuesFor4[2] + rowValuesFor4[3]);
                    score += rowValuesFor4[0] + rowValuesFor4[1] + rowValuesFor4[2] + rowValuesFor4[3];
                }
                if (rowValuesFor4[0] !== rowValuesFor4[1] && rowValuesFor4[1] === rowValuesFor4[2]) {
                    newValuesForRow.push(rowValuesFor4[0], rowValuesFor4[1] + rowValuesFor4[2], rowValuesFor4[3]);
                    score += rowValuesFor4[1] + rowValuesFor4[2];
                }
                if (rowValuesFor4[0] !== rowValuesFor4[1] && rowValuesFor4[1] !== rowValuesFor4[2] && rowValuesFor4[2] === rowValuesFor4[3]) {
                    newValuesForRow.push(rowValuesFor4[0], rowValuesFor4[1], rowValuesFor4[2] + rowValuesFor4[3]);
                    score += rowValuesFor4[2] + rowValuesFor4[3];
                }

                for (let i = 0; i < cellsRow.length; i++) {
                    if (event.key === 'ArrowLeft') {
                        if (newValuesForRow.length === 2 && (i === 0 || i === 1)) {
                            cellContents[cellsRow[0]] = newValuesForRow[0];
                            cellContents[cellsRow[1]] = newValuesForRow[1];
                            cellContents[cellsRow[2]] = 0;
                            cellContents[cellsRow[3]] = 0;
                        } else if (newValuesForRow.length === 3 && (i === 0 || i === 1 || i === 2)) {
                            cellContents[cellsRow[0]] = newValuesForRow[0];
                            cellContents[cellsRow[1]] = newValuesForRow[1];
                            cellContents[cellsRow[2]] = newValuesForRow[2];
                            cellContents[cellsRow[3]] = 0;
                        }
                    }
                    if (event.key === 'ArrowRight') {
                        if (newValuesForRow.length === 2 && (i === 2 || i === 3)) {
                            cellContents[cellsRow[0]] = 0;
                            cellContents[cellsRow[1]] = 0;
                            cellContents[cellsRow[2]] = newValuesForRow[1];
                            cellContents[cellsRow[3]] = newValuesForRow[0];
                        } else if (newValuesForRow.length === 3 && (i === 1 || i === 2 || i === 3)) {
                            cellContents[cellsRow[0]] = 0;
                            cellContents[cellsRow[1]] = newValuesForRow[2];
                            cellContents[cellsRow[2]] = newValuesForRow[1];
                            cellContents[cellsRow[3]] = newValuesForRow[0];
                        }
                    }
                }
            }
        });
    }

    const modifiedArrayElements = cellContentsBeforeChanges.filter((item, index) => {
        return cellContents[index] !== item;
    });

    board.innerHTML = '';

    if (score > best) {
        best = score;
    }

    if (modifiedArrayElements.length > 0) {
        addLastNumbers();
    }

    renderBoard();

    const win = cellContents.includes(2048);
    if (win) {
        modal.classList.add('modal--active');
        modal.textContent = 'You win!';
        document.removeEventListener('keydown', handleKeydown);
    }

    const emptyCells = cellContents.includes(0);

    let columnsRepeatCells;
    let rowRepeatCells;

    if (!emptyCells) {
        repeatColumn:for (let i = 0; i < groupCellsColumn.length; i++) {
            for (let j = 0; j < groupCellsColumn[i].length; j++) {
                if (cellContents[groupCellsColumn[i][j]] === cellContents[groupCellsColumn[i][j + 1]]) {
                    columnsRepeatCells = true;
                    break repeatColumn;
                } else {
                    columnsRepeatCells = false;
                }
            }
        }

        repeatRow:for (let i = 0; i < groupCellsRow.length; i++) {
            for (let j = 0; j < groupCellsRow[i].length; j++) {
                if (cellContents[groupCellsRow[i][j]] !== cellContents[groupCellsRow[i][j + 1]]) {
                    rowRepeatCells = false;
                } else {
                    rowRepeatCells = true;
                    break repeatRow;
                }
            }
        }

        if (!columnsRepeatCells && !rowRepeatCells) {
            modal.classList.add('modal--active');
            modal.textContent = 'Game Over!';
            document.removeEventListener('keydown', handleKeydown);
        }
    }
};

document.addEventListener('keydown', handleKeydown);

newGameBtn.addEventListener('click', (event) => {
    modal.classList.remove('modal--active');
    document.addEventListener('keydown', handleKeydown);
    board.innerHTML = '';
    for (let i = 0; i < cellContents.length; i++) {
        cellContents[i] = 0;
    }
    for (let i = 0; i < 2; i++) {
        number.push(getNumber());
    }
    addCellNumber();
    addFirstNumbers();
    renderBoard();
});

