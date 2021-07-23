const grids = document.querySelector('.grids');
const scoreObj = document.querySelector('.score');
let score = 0; 
scoreObj.textContent = score;

//the 2D arr is our 2048 looks like, the view refreshes followeing gridsArr
let gridsArr = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
]

// to generate a 2 or 4 randomly, there are 2 numbers with the start
function generate() {
    let x = 0.5;
    let twoFour = (x > Math.random()) ? 4 : 2;
    let index1 = Math.floor(Math.random() * 4);
    let index2 = Math.floor(Math.random() * 4);
    if (gridsArr[index1][index2] === 0) {
        gridsArr[index1][index2] = twoFour;
    } else generate();
}

generate();
generate();


//refresher the view in browser and set CSS class here
function showGrids() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let grid = document.createElement('div');
            grid.setAttribute('id', 'grid');
            grid.textContent = gridsArr[i][j] || '';
            if (grid.textContent === '2') {
                grid.setAttribute('class', 'num2')
            } else if (grid.textContent === '4') {
                grid.setAttribute('class', 'num4')
            } else if (grid.textContent === '8') {
                grid.setAttribute('class', 'num8')
            } else if (grid.textContent === '16') {
                grid.setAttribute('class', 'num16')
            } else if (grid.textContent === '32') {
                grid.setAttribute('class', 'num32')
            } else if (grid.textContent === '64') {
                grid.setAttribute('class', 'num64')
            } else if (grid.textContent === '128') {
                grid.setAttribute('class', 'num128')
            } else if (grid.textContent === '256') {
                grid.setAttribute('class', 'num256')
            } else if (grid.textContent === '512') {
                grid.setAttribute('class', 'num512')
            } else if (grid.textContent === '1024') {
                grid.setAttribute('class', 'num1024')
            } else if (grid.textContent === '2048') {
                grid.setAttribute('class', 'num2048')
            } else if (parseInt(grid.textContent) > 2048) {
                grid.setAttribute('class', 'morethan2048')
            }
            grids.append(grid);
        }
    }

    scoreObj.textContent = score;
}


//slip to right
function toRight() {
    for (let i = 0; i < 4; i++) {
        let zeros = gridsArr[i].filter( x => x === 0);
        let notZero = gridsArr[i].filter( x => x); //(x => x !== 0)
        gridsArr[i] = [...zeros, ...notZero];
    }
}

//slip to left 
function toLeft() {
    for (let i = 0; i < 4; i++) {
        let zeros = gridsArr[i].filter( x => x === 0);
        let notZero = gridsArr[i].filter( x => x); //(x => x !== 0)
        gridsArr[i] = [...notZero, ...zeros];
    }
}

// !!! reserve the gridsArr in clockwise !!!  change slip up and down to slip left and right 
function clockwise() {
    let b = gridsArr;
    let c = [[], [], [], []];
    for (let i = 0; i < 4; i++) {
        c[i][0] = b[3][i];
        c[i][1] = b[2][i];
        c[i][2] = b[1][i];
        c[i][3] = b[0][i];
    }
    gridsArr = c;
}

//slip down
function toDown() {
    clockwise();
    toLeft();
    clockwise();
    clockwise();
    clockwise();
}

//slip up
function toUp() {
    clockwise();
    toRight();
    clockwise();
    clockwise();
    clockwise();
}


//combine the row for slip right
function toRightCombineRow() {
    for (let i = 0; i <4; i++) {
        for (let j = 3; j > 0; j--) {
            if (gridsArr[i][j] === gridsArr[i][j-1]) {
                score +=gridsArr[i][j];
                gridsArr[i][j] += gridsArr[i][j-1];
                gridsArr[i][j-1] = 0; 
            }
        }
    }
}


//combine the row for slip left
function toLeftCombineRow() {
    for (let i = 0; i <4; i++) {
        for (let j = 0; j < 3; j ++) {
            if (gridsArr[i][j] === gridsArr[i][j+1]) {
                score +=gridsArr[i][j];
                gridsArr[i][j] += gridsArr[i][j+1];
                gridsArr[i][j+1] = 0; 
            }
        }
    }
}

// combine the column for slip up
function toUpCombineColumn() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            if (gridsArr[i][j] === gridsArr[i+1][j]) {
                score +=gridsArr[i][j];
                gridsArr[i][j] += gridsArr[i+1][j];
                gridsArr[i+1][j] = 0;
            }
        }
    }

}

// combine the columu for slip down
function toDownCombineColumn() {
    for (let i = 3; i > 0; i--) {
        for (let j = 0; j < 4; j++) {
            if (gridsArr[i][j] === gridsArr[i-1][j]) {
                score +=gridsArr[i][j];
                gridsArr[i][j] += gridsArr[i-1][j];
                gridsArr[i-1][j] = 0;
            }
        }
    }
}





// handle event
window.addEventListener('load', () => {
    showGrids();
    document.addEventListener('keyup', control);
    
    function control(e) {
        let beforeArr = gridsArr.toString();
        if (e.keyCode === 37) {
            toLeft();
            toLeftCombineRow();
            toLeft();
            refreshAgain()
        } else if (e.keyCode === 39) {
            toRight();
            toRightCombineRow();
            toRight();
            refreshAgain()
        } else if (e.keyCode === 40) {
            toDown();
            toDownCombineColumn();
            toDown();
            refreshAgain()
        } else if (e.keyCode === 38) {
            toUp();
            toUpCombineColumn();
            toUp();
            refreshAgain()
        }

        function refreshAgain() {
            generateNew();
            grids.innerHTML = '';
            showGrids();
        }
    
        
        function generateNew() {
            let afterArr = gridsArr.toString();
    
            if (beforeArr !== afterArr) {
                generate();
            } 
        }
    
        checkOver();
    
    }

})



//check for if gameover
function checkOver() {
    let gameover = true;

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if (gridsArr[i][j] === gridsArr[i][j+1]  || gridsArr[j][i] === gridsArr[j+1][i]) {
                gameover = false;
            }
        }

    for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (gridsArr[i][j] === 0) {
                    gameover = false;
                }
            }
        }
    }
    //if gameover is not false(it is gameover in fact), then give react for gameover
    if (gameover) {
        const overRemainer = document.querySelector('.overRemainer');
        overRemainer.textContent = 'game over！';
        overRemainer.setAttribute('class', 'overInf');
        document.removeEventListener('keyup', control);
    }
}