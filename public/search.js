let nodes_count;
function search(input) {
    nodes_count = 0;
    let board = createBoard(input);
    let checkBoard = createFalseBoard(input);
    let curSq = find('K', board);
    node(curSq, board, checkBoard);
}

function node(curSq, board, checkBoard) {
    checkBoard[curSq] = true;
    let ways = genMove(curSq, board, checkBoard);
    alert(`ways.length=${ways.length}`);
    if (ways.length === 0) {
        // TODO Evaluation.
        nodes_count++;
    }
    for (nextSq of ways) {
        switch (board[nextSq]) {
            case 'G':
                node(nextSq, board, checkBoard);
                break;
            case 'S':
                node(nextSq, board, checkBoard);
                break;
            default:
                break;
        }
    }
    checkBoard[curSq] = false;
}

/**
 * Generation move.
 */
function genMove(sq, board, checkBoard) {
    let ways = [];

    switch (board[sq]) {
        case 'K':
            pushWay(sq - 10, ways, board, checkBoard);
            pushWay(sq - 11, ways, board, checkBoard);
            pushWay(sq - 1, ways, board, checkBoard);
            pushWay(sq + 9, ways, board, checkBoard);
            pushWay(sq + 10, ways, board, checkBoard);
            pushWay(sq + 11, ways, board, checkBoard);
            pushWay(sq + 1, ways, board, checkBoard);
            pushWay(sq - 9, ways, board, checkBoard);
            break;
        case 'G':
            pushWay(sq - 10, ways, board, checkBoard);
            pushWay(sq - 11, ways, board, checkBoard);
            pushWay(sq - 1, ways, board, checkBoard);
            pushWay(sq + 9, ways, board, checkBoard);
            pushWay(sq + 10, ways, board, checkBoard);
            pushWay(sq + 1, ways, board, checkBoard);
            break;
        case 'S':
            pushWay(sq - 11, ways, board, checkBoard);
            pushWay(sq - 1, ways, board, checkBoard);
            pushWay(sq + 9, ways, board, checkBoard);
            pushWay(sq + 11, ways, board, checkBoard);
            pushWay(sq - 9, ways, board, checkBoard);
            break;
        default:
            break;
    }
    return ways;
}
function pushWay(nextSq, ways, board, checkBoard) {
    if (!checkBoard[nextSq] && (board[nextSq] === 'G' || board[nextSq] === 'S')) {
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
