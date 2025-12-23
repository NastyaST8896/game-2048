const board = document.querySelector('#board');
const modal = document.querySelector('#modal');
const newGameBtn = document.querySelector('#newGameBtn');
const spanScore = document.querySelector('#score');
const spanBest = document.querySelector('#best');
const saveGameBtn = document.querySelector('#saveGameBtn');

const cellsContent = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
let saveCellsContent = JSON.parse(localStorage.getItem('cellsContent'));
const indexesOfCellsInColumns = [
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
];

const indexesOfCellsInRow = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
];

const twoRandomNumbersForCells = [];
const twoRandomCellsIndex = [];

const handleKeydown = (event) => {
    if (event.key.includes('Arrow')) {
        event.preventDefault();
    }

    const cellContentsBeforeChanges = Array.from(cellsContent); // [...cellsContent]

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
       columnsSearch()
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        rowsSearch()
    }

    const modifiedArrayElements = cellContentsBeforeChanges.filter((item, index) => {
        return cellsContent[index] !== item;
    });

    board.innerHTML = '';

    if (score > best) {
        best = score;
    }

    if (modifiedArrayElements.length > 0) {
        addOneNumberToBoard();
    }

    renderBoard();
    checkWin();
    checkGameOver();
};

let score = +JSON.parse(localStorage.getItem('score'));
let best = +JSON.parse(localStorage.getItem('best'));

function getRandomNumber() {
    return Math.round(Math.random() * 100) >= 10 ? 2 : 4;
}

function getRandomCellIndex(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getTheFirstTwoIndexes() {
    for (let i = 0; i < 2; i++) {
        twoRandomCellsIndex[i] = getRandomCellIndex(0, 15);
    }

    if (twoRandomCellsIndex[0] === twoRandomCellsIndex[1]) {
        return getTheFirstTwoIndexes();
    }
}

function addFirstTwoNumbersToBoard() {
    cellsContent.forEach((item, index) => {
        twoRandomCellsIndex.forEach((cell) => {
            if (index === cell) {
                cellsContent[index] = twoRandomNumbersForCells.shift();
            }
        });
    });
    score = 0;
}

function addOneNumberToBoard() {
    const freeCells = cellsContent
        .map((item, index) => {
            if (item === 0) return index;
        })
        .filter((item) => item !== undefined);
    let randomCellPosition;
    if (freeCells.length > 1) {
        randomCellPosition = getRandomCellIndex(1, freeCells.length - 1);

        cellsContent[freeCells[randomCellPosition]] = getRandomNumber();
    } else {
        cellsContent[freeCells[0]] = getRandomNumber();
    }
}

function checkWin() {
    const isWin = cellsContent.includes(2048);
     
    if (isWin) {
        modal.classList.add('modal--active');
        modal.textContent = 'You win!';
        document.removeEventListener('keydown', handleKeydown);
    }
}

function checkGameOver() {
    const hasEmptyCells = cellsContent.includes(0);
    let hasRepeatCells;

    if (!hasEmptyCells) {
        repeat: for (let i = 0; i < indexesOfCellsInColumns.length; i++) {
            for (let j = 0; j < indexesOfCellsInColumns[i].length; j++) {
                if (
                    (cellsContent[indexesOfCellsInColumns[i][j]] === cellsContent[indexesOfCellsInColumns[i][j + 1]]) 
                 || (cellsContent[indexesOfCellsInRow[i][j]] === cellsContent[indexesOfCellsInRow[i][j + 1]])
                ) {
                    hasRepeatCells = true;
                    break repeat;
                } else {
                    hasRepeatCells = false;
                }
            }
        }
        if (!hasRepeatCells) {
            modal.classList.add('modal--active');
            modal.textContent = 'Game Over!';
            document.removeEventListener('keydown', handleKeydown);
        }
    }
}

function renderBoard() {

    for (let i = 0; i < 16; i++) {
        let cell = document.createElement('div');
        cell.className = 'cell';
        const colors = {
            "2": "aquamarine",
            "4": "aqua",
            "8": "lightSteelBlue",
            "16": "lightSkyBlue",
            "32": "deepSkyBlue",
            "64": "dodgerBlue",
            "128": "cornflowerBlue",
            "256": "mediumSlateBlue",
            "512": "cadetBlue",
            "1024": "steelBlue",
            "2048": "royalBlue"
        }


        if (cellsContent[i] !== 0) {
            cell.textContent = `${cellsContent[i]}`;
            cell.classList.add(colors[cellsContent[i]]);
        }
        spanScore.innerText = `${score}`;
        spanBest.innerText = `${best}`;
        board.append(cell);

    }

    localStorage.setItem('score', JSON.stringify(score));
    localStorage.setItem('best', JSON.stringify(best));
}

function columnsSearch() {
    indexesOfCellsInColumns.forEach((cellsColumn) => {
        const cellsPositionsWithValue = cellsColumn.filter((item) => {
            return cellsContent[item] !== 0;
        });
        const values = cellsPositionsWithValue.map((numItem) => {
            return cellsContent[numItem];
        });

        if (cellsPositionsWithValue.length === 1) {

            if (event.key === 'ArrowUp' && cellsPositionsWithValue[0] !== cellsColumn[0]) {
                cellsContent[cellsColumn[0]] = cellsContent[cellsPositionsWithValue[0]];
                cellsContent[cellsPositionsWithValue[0]] = 0;
            }

            if (event.key === 'ArrowDown' && cellsPositionsWithValue[0] !== cellsColumn[3]) {
                cellsContent[cellsColumn[3]] = cellsContent[cellsPositionsWithValue[0]];
                cellsContent[cellsPositionsWithValue[0]] = 0;
            }
        }

        if (cellsPositionsWithValue.length === 2) {
            if (values[0] === values[1]) {
                for (let i = 0; i < cellsColumn.length; i++) {
                    if (event.key === 'ArrowUp' && i === 0) {
                        cellsContent[cellsColumn[i]] = values[0] + values[1];
                    } else if (event.key === 'ArrowDown' && i === 3) {
                        cellsContent[cellsColumn[i]] = values[0] + values[1];
                    } else {
                        cellsContent[cellsColumn[i]] = 0;
                    }
                }
                score += (values[0] + values[1]);
            } else {
                for (let i = 0; i < cellsColumn.length; i++) {
                    if (event.key === 'ArrowUp' && (i === 0 || i === 1)) {
                        cellsContent[cellsColumn[0]] = values[0];
                        cellsContent[cellsColumn[1]] = values[1];
                    } else if (event.key === 'ArrowDown' && i === 2) {
                        cellsContent[cellsColumn[i]] = values[0];
                    } else if (event.key === 'ArrowDown' && i === 3) {
                        cellsContent[cellsColumn[i]] = values[1];
                    } else {
                        cellsContent[cellsColumn[i]] = 0;
                    }
                }
            }
        }

        if (cellsPositionsWithValue.length === 3) {
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
                        cellsContent[cellsColumn[0]] = newValues[0];
                        cellsContent[cellsColumn[1]] = newValues[1];
                    } else if (newValues.length === 3 && (i === 0 || i === 1 || i === 2)) {
                        cellsContent[cellsColumn[0]] = newValues[0];
                        cellsContent[cellsColumn[1]] = newValues[1];
                        cellsContent[cellsColumn[2]] = newValues[2];
                    } else {
                        cellsContent[cellsColumn[i]] = 0;
                    }
                }
                if (event.key === 'ArrowDown') {
                    if (newValues.length === 2 && (i === 2 || i === 3)) {
                        cellsContent[cellsColumn[2]] = newValues[1];
                        cellsContent[cellsColumn[3]] = newValues[0];
                    } else if (newValues.length === 3 && (i === 1 || i === 2 || i === 3)) {
                        cellsContent[cellsColumn[1]] = newValues[2];
                        cellsContent[cellsColumn[2]] = newValues[1];
                        cellsContent[cellsColumn[3]] = newValues[0];
                    } else {
                        cellsContent[cellsColumn[i]] = 0;
                    }
                }
            }
        }

        if (cellsPositionsWithValue.length === 4) {
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
                    if (newValues.length === 2 && [0,1].includes(i)) {
                        cellsContent[cellsColumn[0]] = newValues[0];
                        cellsContent[cellsColumn[1]] = newValues[1];
                        cellsContent[cellsColumn[2]] = 0;
                        cellsContent[cellsColumn[3]] = 0;
                    } else if (newValues.length === 3 && [0,1,2].includes(i)) {
                        cellsContent[cellsColumn[0]] = newValues[0];
                        cellsContent[cellsColumn[1]] = newValues[1];
                        cellsContent[cellsColumn[2]] = newValues[2];
                        cellsContent[cellsColumn[3]] = 0;
                    }
                }
                if (event.key === 'ArrowDown') {
                    if (newValues.length === 2 && [2,3].includes(i)) {
                        cellsContent[cellsColumn[0]] = 0;
                        cellsContent[cellsColumn[1]] = 0;
                        cellsContent[cellsColumn[2]] = newValues[1];
                        cellsContent[cellsColumn[3]] = newValues[0];
                    } else if (newValues.length === 3 && [1,2,3].includes(i)) {
                        cellsContent[cellsColumn[0]] = 0;
                        cellsContent[cellsColumn[1]] = newValues[2];
                        cellsContent[cellsColumn[2]] = newValues[1];
                        cellsContent[cellsColumn[3]] = newValues[0];
                    }
                }
            }
        }
    });
}

function rowsSearch() {
    indexesOfCellsInRow.forEach((cellsRow) => {
        const cellsPositionsWithValueForRow = cellsRow.filter((item) => {
            return cellsContent[item] !== 0;
        });

        const valuesRow = cellsPositionsWithValueForRow.map((numItem) => {
            return cellsContent[numItem];
        });
        if (cellsPositionsWithValueForRow.length === 1) {

            if (event.key === 'ArrowLeft' && cellsPositionsWithValueForRow[0] !== cellsRow[0]) {
                cellsContent[cellsRow[0]] = cellsContent[cellsPositionsWithValueForRow[0]];
                cellsContent[cellsPositionsWithValueForRow[0]] = 0;
            }

            if (event.key === 'ArrowRight' && cellsPositionsWithValueForRow[0] !== cellsRow[3]) {
                cellsContent[cellsRow[3]] = cellsContent[cellsPositionsWithValueForRow[0]];
                cellsContent[cellsPositionsWithValueForRow[0]] = 0;
            }
        }

        if (cellsPositionsWithValueForRow.length === 2) {
            if (valuesRow[0] === valuesRow[1]) {
                for (let i = 0; i < cellsRow.length; i++) {
                    if (event.key === 'ArrowLeft' && i === 0) {
                        cellsContent[cellsRow[i]] = valuesRow[0] + valuesRow[1];
                    } else if (event.key === 'ArrowRight' && i === 3) {
                        cellsContent[cellsRow[i]] = valuesRow[0] + valuesRow[1];
                    } else {
                        cellsContent[cellsRow[i]] = 0;
                    }
                }
            score += valuesRow[0] + valuesRow[1];
            } else {
                for (let i = 0; i < cellsRow.length; i++) {
                    if (event.key === 'ArrowLeft' && (i === 0 || i === 1)) {
                        cellsContent[cellsRow[0]] = valuesRow[0];
                        cellsContent[cellsRow[1]] = valuesRow[1];
                    } else if (event.key === 'ArrowRight' && i === 2) {
                        cellsContent[cellsRow[i]] = valuesRow[0];
                    } else if (event.key === 'ArrowRight' && i === 3) {
                        cellsContent[cellsRow[i]] = valuesRow[1];
                    } else {
                        cellsContent[cellsRow[i]] = 0;
                    }
                }
            }
        }

        if (cellsPositionsWithValueForRow.length === 3) {
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
                        cellsContent[cellsRow[0]] = newValuesForRow[0];
                        cellsContent[cellsRow[1]] = newValuesForRow[1];
                    } else if (newValuesForRow.length === 3 && (i === 0 || i === 1 || i === 2)) {
                        cellsContent[cellsRow[0]] = newValuesForRow[0];
                        cellsContent[cellsRow[1]] = newValuesForRow[1];
                        cellsContent[cellsRow[2]] = newValuesForRow[2];
                    } else {
                        cellsContent[cellsRow[i]] = 0;
                    }
                }
                if (event.key === 'ArrowRight') {
                    if (newValuesForRow.length === 2 && (i === 2 || i === 3)) {
                        cellsContent[cellsRow[2]] = newValuesForRow[1];
                        cellsContent[cellsRow[3]] = newValuesForRow[0];
                    } else if (newValuesForRow.length === 3 && (i === 1 || i === 2 || i === 3)) {
                        cellsContent[cellsRow[1]] = newValuesForRow[2];
                        cellsContent[cellsRow[2]] = newValuesForRow[1];
                        cellsContent[cellsRow[3]] = newValuesForRow[0];
                    } else {
                        cellsContent[cellsRow[i]] = 0;
                    }
                }
            }
        }

        if (cellsPositionsWithValueForRow.length === 4) {
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
                    if (newValuesForRow.length === 2 && [0,1].includes(i)) {
                        cellsContent[cellsRow[0]] = newValuesForRow[0];
                        cellsContent[cellsRow[1]] = newValuesForRow[1];
                        cellsContent[cellsRow[2]] = 0;
                        cellsContent[cellsRow[3]] = 0;
                    } else if (newValuesForRow.length === 3 && [0,1,2].includes(i)) {
                        cellsContent[cellsRow[0]] = newValuesForRow[0];
                        cellsContent[cellsRow[1]] = newValuesForRow[1];
                        cellsContent[cellsRow[2]] = newValuesForRow[2];
                        cellsContent[cellsRow[3]] = 0;
                    }
                }
                if (event.key === 'ArrowRight') {
                    if (newValuesForRow.length === 2 && [2,3].includes(i)) {
                        cellsContent[cellsRow[0]] = 0;
                        cellsContent[cellsRow[1]] = 0;
                        cellsContent[cellsRow[2]] = newValuesForRow[1];
                        cellsContent[cellsRow[3]] = newValuesForRow[0];
                    } else if (newValuesForRow.length === 3 && [1,2,3].includes(i)) {
                        cellsContent[cellsRow[0]] = 0;
                        cellsContent[cellsRow[1]] = newValuesForRow[2];
                        cellsContent[cellsRow[2]] = newValuesForRow[1];
                        cellsContent[cellsRow[3]] = newValuesForRow[0];
                    }
                }
            }
        }
    });
}

function initializingTheGame() {
    
    if (saveCellsContent) {
        for(let i = 0; i < cellsContent.length; i++) {
        cellsContent[i] = saveCellsContent[i];
        }
        score = +JSON.parse(JSON.stringify(localStorage.getItem('saveScore')));
    } else {
        for (let i = 0; i < cellsContent.length; i++) {
        cellsContent[i] = 0;
        }

        for (let i = 0; i < 2; i++) {
        twoRandomNumbersForCells.push(getRandomNumber());
        }
        getTheFirstTwoIndexes();
        addFirstTwoNumbersToBoard();
    }
    
    renderBoard();
}

initializingTheGame();

document.addEventListener('keydown', handleKeydown);

newGameBtn.addEventListener('click', (event) => {
    modal.classList.remove('modal--active');
    document.addEventListener('keydown', handleKeydown);
    board.innerHTML = '';
    localStorage.setItem('cellsContent', JSON.stringify([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]));
    saveCellsContent = 0;
    localStorage.setItem('saveScore', JSON.stringify(0));
    initializingTheGame();
});

saveGameBtn.addEventListener('click', (event) => {
    localStorage.setItem('cellsContent', JSON.stringify(cellsContent));
    localStorage.setItem('saveScore', JSON.stringify(score));
})