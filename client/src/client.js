const sock = io();
const writeEvent = (text) => {
    const parent = document.querySelector('#conlist')

    const el = document.createElement('li');
    el.innerHTML = text;
    parent.appendChild(el);
}

writeEvent('[Server]Welcome to Ultimate Tic Tac Toe')

const onFormSubmitted = (event) => {
    event.preventDefault();

    const input = document.querySelector('#chatInput')
    const text = input.value;
    input.value = '';

    sock.emit('message', text)
}

document.querySelector('#typing').addEventListener('submit', onFormSubmitted)

sock.on('message', writeEvent);
sock.on('announcement', writeEvent);

sock.on('start', () => {
    sock.emit('announcement', 'Game has Begun')
    console.log('client side begins')
    new nineGame();
    console.log('game created')
})


class threeByThree {
    constructor(number) {
        console.log('three constructor ran')
        this.board = document.querySelector('#' + number + 'b');
        console.log(this.board)
        this.realBoard = [
            ['zero', 'one', 'two'],
            ['three', 'four', 'five'],
            ['six', 'seven', 'eight']
        ]
    }

    checkWin() {
        let win = true;
        for (i = 0; i < 3; i++) {
            let x = this.realBoard[i][1]
            for (j = 0; j < 3; j++) {
                if (this.realBoard[i][j] != x) {
                    win = false;
                }
            }
            if (win) {
                return win;
            }
            win = true;


        }
        for (i = 0; i < 3; i++) {
            let x = this.realBoard[1][i]
            for (j = 0; j < 3; j++) {
                if (this.realBoard[j][i] != x) {
                    win = false;
                }
            }
            if (win) {
                return win;
            }
            win = true;
        }

        if ((this.realBoard[0][0] == this.realBoard[1][1]) && (this.realBoard[1][1] == this.realBoard[2][2])) {
            return true;
        }
        if ((this.realBoard[0][2] == this.realBoard[1][1]) && (this.realBoard[1][1] == this.realBoard[2][0])) {
            return true;
        }


        return false;
    }

    checkDraw() {
        let check = true;
        for (i = 0; i < 3; i++) {
            for (j = 0; j < 3; j++) {
                if (this.realBoard[i][j] != 'red' && this.realBoard[i][j] != 'blue') {
                    check = false;
                }
            }
        }
        return check;
    }

}
class nineGame {
    constructor() {
        console.log('nine constructor ran')
        this._turn = '';
        this._selec = 'placeholder';
        this._nine = [
            ['zero', 'one', 'two'],
            ['three', 'four', 'five'],
            ['six', 'seven', 'eight']
        ]
        this._i = 0;
        this._j = 0;
        for (this._i = 0; this._i < 3; this._i++) {
            for (this._j = 0; this._j < 3; this._j++) {

                if (this._i == 0 && this._j == 0) {
                    console.log('0,0 case reached')
                    this._selec = 'zero'
                    console.log(this._selec)
                }
                if (this._i == 0 && this._j == 1) {
                    this._selec = 'one'
                }
                if (this._i == 0 && this._j == 2) {
                    this._selec = 'two'
                }
                if (this._i == 1 && this._j == 0) {
                    this._selec = 'three'
                }
                if (this._i == 1 && this._j == 1) {
                    this._selec = 'four'
                }
                if (this._i == 1 && this._j == 2) {
                    this._selec = 'five'
                }
                if (this._i == 2 && this._j == 0) {
                    this._selec = 'six'
                }
                if (this._i == 2 && this._j == 1) {
                    this._selec = 'seven'
                }
                if (this._i == 2 && this._j == 2) {
                    this._selec = 'eight'
                }
                this._nine[this._i][this._j] = new threeByThree(this._selec);
            }
        }

        this._overallBoard = [
            ['zero', 'one', 'two'],
            ['three', 'four', 'five'],
            ['six', 'seven', 'eight']
        ]

        this._x = 1;
        this._y = 1;
        this._tryx = 1;
        this._tryy = 1;
        this._oldx = 0;
        this._oldy = 0;
        this._n = document.querySelector('#board')
        this._pickNewLocation = false;
        this._oldColor = 'random';
        this._nine[this._x][this._y].board.parentNode.style.backgroundColor = 'lightyellow';
        this._messageBothPlayers('Game begins!')
        sock.on('turn', () => {
            this._n.addEventListener('click', sock.emit('selected'));
            sock.on('color', this._onTurn(color, event));
        })

    }

    get Selec() {
        return this._selec;
    }
    _messageBothPlayers(text) {
        sock.emit('message', text)
    }

    _squarePicked(event) {
        if (event.target.parentNode.id == 'zerob') {
            this._tryx = 0;
            this._tryy = 0;
        }
        if (event.target.parentNode.id == 'oneb') {
            this._tryx = 0;
            this._tryy = 1;
        }
        if (event.target.parentNode.id == 'twob') {
            this._tryx = 0;
            this._tryy = 2;
        }
        if (event.target.parentNode.id == 'threeb') {
            this._tryx = 1;
            this._tryy = 0;
        }
        if (event.target.parentNode.id == 'fourb') {
            this._tryx = 1;
            this._tryy = 1;
        }
        if (event.target.parentNode.id == 'fiveb') {
            this._tryx = 1;
            this._tryy = 2;
        }
        if (event.target.parentNode.id == 'sixb') {
            this._tryx = 2;
            this._tryy = 0;
        }
        if (event.target.parentNode.id == 'sevenb') {
            this._tryx = 2;
            this._tryy = 1;
        }
        if (event.target.parentNode.id == 'eightb') {
            this._tryx = 2;
            this._tryy = 2;
        }

        if (this._tryx == this._x && this._tryy == this._y) {
            this._nine[this._x][this._y].board.parentNode.style.backgroundColor = 'lightyellow';

            this._i = 4;
            this._j = 3;
            this._r = 2;

            r = event.target.id.slice(0, event.target.id.indexOf('-') + 1)

            if (event.target.id == '' + r + 'zero') {
                this._i = 0;
                this._j = 0;
            }
            if (event.target.id == '' + r + 'one') {
                this._i = 0;
                this._j = 1;
            }
            if (event.target.id == '' + r + 'two') {
                this._i = 0;
                this._j = 2;
            }
            if (event.target.id == '' + r + 'three') {
                this._i = 1;
                this._j = 0;
            }
            if (event.target.id == '' + r + 'four') {
                this._i = 1;
                this._j = 1;
            }
            if (event.target.id == '' + r + 'five') {
                this._i = 1;
                this._j = 2;
            }
            if (event.target.id == '' + r + 'six') {
                this._i = 2;
                this._j = 0;
            }
            if (event.target.id == '' + r + 'seven') {
                this._i = 2;
                this._ = 1;
            }
            if (event.target.id == '' + r + 'eight') {
                this._i = 2;
                this._j = 2;
            }
        }
    }

    _checkOverlap(event) {
        this._oldx = this._x;
        this._oldy = this._y;
        if (event.target.parentNode.parentNode.id == 'zero') {
            this._x = 0;
            this._y = 0;
        }
        if (event.target.parentNode.parentNode.id == 'one') {
            this._x = 0;
            this._y = 1;
        }
        if (event.target.parentNode.parentNode.id == 'two') {
            this._x = 0;
            this._y = 2;
        }
        if (event.target.parentNode.parentNode.id == 'three') {
            this._x = 1;
            this._y = 0;
        }
        if (event.target.parentNode.parentNode.id == 'four') {
            this._x = 1;
            this._y = 1;
        }
        if (event.target.parentNode.parentNode.id == 'five') {
            this._x = 1;
            this._y = 2;
        }
        if (event.target.parentNode.parentNode.id == 'six') {
            this._x = 2;
            this._y = 0;
        }
        if (event.target.parentNode.parentNode.id == 'seven') {
            this._x = 2;
            this._y = 1;
        }
        if (event.target.parentNode.parentNode.id == 'eight') {
            this._x = 2;
            this._y = 2;
        }

        this._nine[this._oldx][this._oldy].board.parentNode.style.backgroundColor = oldColor;
        this._pickNewLocation = false;
    }


    _onTurn(color, event) {
        if (this._pickNewLocation) {
            this._checkOverlap(event);
        } else {
            this._squarePicked(event);
            if (!(this._nine[x][y].realBoard[i][j] == 'red' || this._nine[x][y].realBoard[i][j] == 'blue')) {
                event.target.style.backgroundColor = color;
                this._nine[x][y].realBoard[i][j] = color;



                if (this._nine[x][y].checkWin()) {
                    this._nine[x][y].board.parentNode.style.backgroundColor = color;

                    this._overallBoard[x][y] = color;
                }
                if (this._nine[x][y].checkDraw() && !this._nine[x][y].checkWin()) {
                    this._messageBothPlayers('Draw!')
                }
                if (this._allCheckWin()) {
                    this._messageBothPlayers(color + ' has won the game!')
                }
                this._oldx = this._x;
                this._oldy = this._y;
                if (!this._nine[x][y].checkWin()) {
                    this._nine[oldx][oldy].board.parentNode.style.backgroundColor = 'white';
                }
                this._x = this._i;
                this._y = this._j;
                if (this._overallBoard[x][y] == 'red' || this._overallBoard[x][y] == 'blue') {
                    this._pickNewLocation = true;
                    this._oldColor = this._overallBoard[x][y];
                    if (!allCheckWin()) {
                        this._nine[x][y].board.parentNode.style.backgroundColor = 'purple'
                    }
                } else {
                    if (!allCheckWin()) {
                        this._nine[x][y].board.parentNode.style.backgroundColor = 'lightyellow'
                    }
                }

            }
        }
    }

    _allCheckWin() {
        let oxen = '';
        let win = true;
        for (i = 0; i < 3; i++) {
            oxen = this._overallBoard[i][1]
            for (j = 0; j < 3; j++) {
                if (this._overallBoard[i][j] != oxen) {
                    win = false;
                }
            }
            if (win) {
                return win;
            }
            win = true;


        }
        for (i = 0; i < 3; i++) {
            oxen = this._overallBoard[1][i]
            for (j = 0; j < 3; j++) {
                if (this._overallBoard[i][j] != oxen) {
                    win = false;
                }
            }
            if (win) {
                return win;
            }
            win = true;
        }

        if ((overallBoard[0][0] == 'red' && overallBoard[1][1] == 'red') && (overallBoard[2][2] == 'red')) {
            oxen = overallBoard[0][0];
            return true;
        }
        if ((overallBoard[0][0] == 'blue' && overallBoard[1][1] == 'blue') && (overallBoard[2][2] == 'blue')) {
            oxen = overallBoard[0][0];
            return true;

        }
        if ((overallBoard[2][0] == 'red' && overallBoard[1][1] == 'red') && (overallBoard[0][2] == 'red')) {
            oxen = overallBoard[1][1];
            return true;

        }
        if ((overallBoard[2][0] == 'blue' && overallBoard[1][1] == 'blue') && (overallBoard[0][2] == 'blue')) {
            oxen = overallBoard[1][1];
            return true;

        }


        return false;
    }

}