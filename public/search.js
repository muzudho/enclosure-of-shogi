let nodesCount;
let bestValue;
function search(input) {
    nodesCount = 0;
    bestValue = 0;
    let board = createBoard(input);
    let state = {
        board: board,
        checkBoard: createFalseBoard(input),
        value: 0,
    };
    node(find('K', board), state);
}

function node(currSq, state) {
    nodesCount++;
    state.checkBoard[currSq] = true;
    let ways = genMove(currSq, state);
    alert(`ways.length=${ways.length}`);
    if (ways.length === 0) {
        // TODO Evaluation.
        if (bestValue < state.value) {
            bestValue = state.value;
        }
    }
    for (nextSq of ways) {
        switch (state.board[nextSq]) {
            case 'G':
                node(nextSq, state);
                break;
            case 'S':
                node(nextSq, state);
                break;
            default:
                break;
        }
    }
    state.checkBoard[currSq] = false;
}

/**
 * Generation move.
 */
function genMove(currSq, state) {
    let ways = [];

    switch (state.board[currSq]) {
        case 'K':
            pushWay(- 10, ways, currSq, state);
            pushWay(- 11, ways, currSq, state);
            pushWay(- 1, ways, currSq, state);
            pushWay(9, ways, currSq, state);
            pushWay(10, ways, currSq, state);
            pushWay(11, ways, currSq, state);
            pushWay(1, ways, currSq, state);
            pushWay(- 9, ways, currSq, state);
            break;
        case 'G':
            pushWay(- 10, ways, currSq, state);
            pushWay(- 11, ways, currSq, state);
            pushWay(- 1, ways, currSq, state);
            pushWay(9, ways, currSq, state);
            pushWay(10, ways, currSq, state);
            pushWay(1, ways, currSq, state);
            break;
        case 'S':
            pushWay(- 11, ways, currSq, state);
            pushWay(- 1, ways, currSq, state);
            pushWay(9, ways, currSq, state);
            pushWay(11, ways, currSq, state);
            pushWay(- 9, ways, currSq, state);
            break;
        default:
            break;
    }
    return ways;
}
function pushWay(offset, ways, currSq, state) {
    nextSq = currSq + offset;
    let dstPc = state.board[nextSq];
    if (!state.checkBoard[nextSq] && (dstPc === 'G' || dstPc === 'S')) {
        let srcPc = state.board[currSq];
        if (srcPc === 'G' || srcPc === 'S') {
            /*
            // 点数計算
            let diffValue = letDiffValue(nextSq, currSq, state);
            alert(`nextSq=${nextSq} state.checkBoard[nextSq]=${state.checkBoard[nextSq]} dstPc=${dstPc} diffValue=${diffValue}`);
            state.value += diffValue;
            */
        }
        ways.push(nextSq);
    }
}
/**
 * 局面差分評価値算出
 * @param {*} state 
 */
function letDiffValue(nextSq, currSq, state) {
    let srcPc = state.board[currSq];
    let dstPc = state.board[nextSq];
    let diff = nextSq - currSq;
    alert(`letDiffValue: srcPc=${srcPc} dstPc=${dstPc} diff=${diff}`);
    switch (srcPc) {
        case 'G':
            switch (dstPc) {
                case 'G':
                    switch (diff) {
                        case 1: //thru
                        case -1: // thru
                        case 10: // thru
                        case -10:
                            // 金 金
                            // ↓  ↑
                            // 金 金
                            // 金←金, 金→金
                            return 4;
                        case 9: // thuru
                        case -11:
                            // 金ナナメ上
                            return 2;
                        default:
                            break;
                    }
                    break;
                case 'S':
                    switch (diff) {
                        case -11: // thru
                        case 9:
                            // ナナメ上
                            return 4;
                        case 1: //thru
                        case -1: // thru
                        case 10: // thru
                        case -10:
                            return 2;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
            break;
        case 'S':
            switch (dstPc) {
                case 'G':
                    switch (diff) {
                        case 11: // thru
                        case -9: // thru
                        case -1:
                            // ナナメ下, 真上
                            return 4;
                        case -11: // thru
                        case 9: // thru
                            // ナナメ上
                            return 2;
                        default:
                            break;
                    }
                    break;
                case 'S':
                    switch (diff) {
                        case -11: // thru
                        case 9: // thru
                        case 11: // thru
                        case -9: // thru
                            // ナナメ
                            return 4;
                        case -1:
                            // 真上
                            return 2;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }

    // Error.
    return 0;
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
