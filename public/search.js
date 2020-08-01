let nodesCount;
let bestValue;
function search(input) {
    nodesCount = 0;
    bestValue = 0;
    let board = createBoard(input);
    let state = {
        curSq: find('K', board),
        board: board,
        checkBoard: createFalseBoard(input),
        value: 0,
    };
    node(state);
}

function node(state) {
    state.checkBoard[state.curSq] = true;
    let ways = genMove(state);
    // alert(`ways.length=${ways.length}`);
    if (ways.length === 0) {
        // TODO Evaluation.
        nodesCount++;
        if (bestValue < state.value) {
            bestValue = state.value;
        }
    }
    for (nextSq of ways) {
        switch (state.board[nextSq]) {
            case 'G':
                node(state);
                break;
            case 'S':
                node(state);
                break;
            default:
                break;
        }
    }
    state.checkBoard[state.curSq] = false;
}

/**
 * Generation move.
 */
function genMove(state) {
    let ways = [];

    switch (state.board[state.sq]) {
        case 'K':
            pushWay(- 10, ways, state);
            pushWay(- 11, ways, state);
            pushWay(- 1, ways, state);
            pushWay(9, ways, state);
            pushWay(10, ways, state);
            pushWay(11, ways, state);
            pushWay(1, ways, state);
            pushWay(- 9, ways, state);
            break;
        case 'G':
            pushWay(- 10, ways, state);
            pushWay(- 11, ways, state);
            pushWay(- 1, ways, state);
            pushWay(9, ways, state);
            pushWay(10, ways, state);
            pushWay(1, ways, state);
            break;
        case 'S':
            pushWay(- 11, ways, state);
            pushWay(- 1, ways, state);
            pushWay(9, ways, state);
            pushWay(11, ways, state);
            pushWay(- 9, ways, state);
            break;
        default:
            break;
    }
    return ways;
}
function pushWay(offset, ways, state) {
    nextSq = state.curSq + offset;
    if (!state.checkBoard[nextSq] && (state.board[nextSq] === 'G' || state.board[nextSq] === 'S')) {
        ways.push(nextSq);
    }
}
function find(piece, board) {
    for (const [i, sq] of board.entries()) {
        /*
        if (70 < i) {
            alert(`i=${i} sq=${sq}`);
        }
        */
        if (sq === piece) {
            return i;
        }
    }
}

function createBoard(input) {
    board = [];

    for (rank = 1; rank < 10; rank++) {
        for (file = 9; 0 < file; file--) {
            board[file * 10 + rank] = '';
        }
    }

    for (entry of input.board) {
        // alert(`entry[${entry[0]}][${entry[1]}]`);
        switch (entry[1]) {
            case 'pc_k':
                board[entry[0]] = 'K';
                break;
            case 'pc_g':
                board[entry[0]] = 'G';
                break;
            case 'pc_s':
                board[entry[0]] = 'S';
                break;
            default:
                // alert(`default entry[${entry[0]}][${entry[1]}]`);
                break;
        }
    }

    return board;
}

function createFalseBoard() {
    board = [];

    for (rank = 1; rank < 10; rank++) {
        for (file = 9; 0 < file; file--) {
            board[file * 10 + rank] = false;
        }
    }

    return board;
}
