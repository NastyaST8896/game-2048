const board = document.querySelector("#board");

const cellСontents = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

function getNumber() {
    return Math.round(Math.random() * 100) >= 10 ? 2 : 4;
}

function getCell(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function createNewCellsBoard() {

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
            addCellNumber()
        }
    }
    
    addCellNumber()

    for(let i = 1; i < 17; i++) {
        let cell = document.createElement('div');
        cell.classList = 'cell'
        cell.id = i



        if(cellNumber.includes(i) && !cell.textContent) {
            let freeNumber = number.find((item) => {
                return item.use === false
            });

            cellСontents[i-1] = freeNumber.num

            cell.textContent = freeNumber.num;
            freeNumber.use = !freeNumber.use
        }

        board.append(cell);
    }
}

createNewCellsBoard();
console.log(cellСontents)