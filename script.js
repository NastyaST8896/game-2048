const board = document.querySelector("#board");

const cellContents = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

function getNumber() {
    return Math.round(Math.random() * 100) >= 10 ? 2 : 4;
}

function getCell(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const number = [];

  for(let i = 0; i < 2; i++) {
        number.push( { num: getNumber(), use: false } );
    }

const cellNumber = [];

function addCellNumber() {
    for(let i = 0; i < 2; i++) {
            cellNumber.push(getCell(1,16));
    }

    if(cellNumber[0] === cellNumber[1]) {
            addCellNumber();
    } 
}
    
addCellNumber();

function addFirstNumbers() {

    cellContents.forEach((item,index) => {
        cellNumber.forEach((cell) => {
            if(index+1 === cell) {
                let freeNumber = number.find((item) => {
                return item.use === false;
            });

            cellContents[index] = freeNumber.num
            item.use = !item.use;
            }
        })
    })
}

addFirstNumbers()

function renderBoard() {

    for(let i = 1; i < 17; i++) {
        let cell = document.createElement('div');
        cell.classList = 'cell';
        cell.id = i;

        if(cellContents[i-1] !== 0) {
            cell.textContent = cellContents[i-1];
        }
        
        board.append(cell);
    }
}

renderBoard()