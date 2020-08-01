let nodesCount;
let allVariations = [];
let allVariationValues = [];
let bestValue;
let bestVariation;
let bestVariationValues;

function search(input) {
    nodesCount = 0;
    bestValue = 0;
    let board = createBoard(input);
    let state = {
        board: board,
        checkBoard: createFalseBoard(input),
        value: 0,
        // Principal variations.
        pv: [],
        pv_value: [],
    };
    node(0, find('K', board), state);

    // alert(`nodesCount=${nodesCount} allVariations=${JSON.stringify(allVariations, null, '\t')}  allVariationValues=${JSON.stringify(allVariationValues, null, '\t')}`);
    // alert(`bestValue=${bestValue} bestVariation=${JSON.stringify(bestVariation, null, '\t')}  bestVariationValues=${JSON.stringify(bestVariationValue, null, '\t')}`);
    // 矢印に変換。
    let arrows = [];
    for (i = 1; i < bestVariation.length; i++) {
        let bestSq = bestVariation[i - 1];
        let bestVarVal = bestVariationValue[i];
        let diff = bestVariation[i] - bestVariation[i - 1];
        let angle;
        let classText;
        // Angle 算出
        switch (diff) {
            case -10: // thru
            case 10:
                angle = 'w';
                break;
            case -1: // thru
            case 1:
                angle = 'h';
                break;
            case -11: // thru
            case -9: // thru
            case 9: // thru
            case 11:
                angle = 'd';
                break;
            case 0:
                angle = 'c';
                break;
        }
        // ドロップ・シャドウずらし
        switch (diff) {
            case 9:
                bestSq += 9;
                break;
            case -1: // thru
            case -11: // thru
                bestSq += -1;
                break;
            case 10:
            case 11:
                bestSq += 10;
                break;
            default:
                break;
        }
        // 線算出
        switch (bestVarVal) {
            case 0:
                // 玉からの矢印
                switch (diff) {
                    case -10:
                        classText = 'k51';
                        break;
                    case -11:
                        classText = 'k62';
                        break;
                    case -1:
                        classText = 'k73';
                        break;
                    case 9:
                        classText = 'k84';
                        break;
                    case 10:
                        classText = 'k15';
                        break;
                    case 11:
                        classText = 'k26';
                        break;
                    case 1:
                        classText = 'k37';
                        break;
                    case -9:
                        classText = 'k48';
                        break;
                }
                break;
            case 1:
                // 行き止まり
                classText = 'a1';
                break;
            case 2:
                // 一方通行
                switch (diff) {
                    case -10:
                        classText = 'a51';
                        break;
                    case -11:
                        classText = 'a62';
                        break;
                    case -1:
                        classText = 'a73';
                        break;
                    case 9:
                        classText = 'a84';
                        break;
                    case 10:
                        classText = 'a15';
                        break;
                    case 11:
                        classText = 'a26';
                        break;
                    case 1:
                        classText = 'a37';
                        break;
                    case -9:
                        classText = 'a48';
                        break;
                }
                break;
            case 4:
                // 双方向
                switch (diff) {
                    case -10:
                        classText = 'a1551';
                        break;
                    case -11:
                        classText = 'a2662';
                        break;
                    case -1:
                        classText = 'a3773';
                        break;
                    case 9:
                        classText = 'a4884';
                        break;
                    case 10:
                        classText = 'a1551';
                        break;
                    case 11:
                        classText = 'a2662';
                        break;
                    case 1:
                        classText = 'a3773';
                        break;
                    case -9:
                        classText = 'a4884';
                        break;
                }
                break;
        }
        arrows.push([bestSq, classText]);
    }
    // alert(`arrows=${JSON.stringify(arrows, null, '\t')}`);

    return arrows;
}

function node(preSq, currSq, state) {
    // 直前の点数計算
    let diffValue = letDiffValue(preSq, currSq, state);
    nodesCount++;
    state.checkBoard[currSq] = true;
    state.pv.push(currSq);
    state.pv_value.push(diffValue);
    let ways = genMove(currSq, state);
    // alert(`ways.length=${ways.length}`);
    if (ways.length === 0) {
        // Leaf
        if (diffValue != 4) {
            // 「行き止まり」を追加。
            state.value += 1;
            state.pv.push(currSq);
            state.pv_value.push(1);
        }
        if (bestValue < state.value) {
            bestValue = state.value;
            bestVariation = Array.from(state.pv);
            bestVariationValue = Array.from(state.pv_value);
        }
        // Record pv.
        allVariations.push(Array.from(state.pv));
        allVariationValues.push(Array.from(state.pv_value));
    }
    for (nextSq of ways) {
        switch (state.board[nextSq]) {
            case 'G':
                node(currSq, nextSq, state);
                break;
            case 'S':
                node(currSq, nextSq, state);
                break;
            default:
                break;
        }
    }
    state.pv_value.pop();
    state.pv.pop();
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
    if (existsPv(nextSq, state)) {
        // 既存の枝は作らない。
        return;
    }
    if (!state.checkBoard[nextSq] && (dstPc === 'G' || dstPc === 'S')) {
        let srcPc = state.board[currSq];
        if (srcPc === 'G' || srcPc === 'S') {
            // 点数計算
            let diffValue = letDiffValue(currSq, nextSq, state);
            // alert(`nextSq=${nextSq} state.checkBoard[nextSq]=${state.checkBoard[nextSq]} dstPc=${dstPc} diffValue=${diffValue}`);
            state.value += diffValue;
        }
        ways.push(nextSq);
    }
}
/**
 * 局面差分評価値算出
 * @param {*} state 
 */
function letDiffValue(currSq, nextSq, state) {
    let srcPc = state.board[currSq];
    let dstPc = state.board[nextSq];
    let diff = nextSq - currSq;
    // alert(`letDiffValue: srcPc=${srcPc} dstPc=${dstPc} diff=${diff}`);
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
function existsPv(newSq, state) {
    state.pv.push(newSq);
    let exists = false;
    for (exist_var in allVariations) {
        if (exist_var.length < state.pv.length) {
            // 一致しない
            continue;
        }
        for (i = 0; i < state.pv.length; i++) {
            if (exist_var[i] !== state.pv[i]) {
                // 一致しない
                continue;
            }
        }
        // 一致した
        exists = true;
        break;
    }
    state.pv.pop();
    return exists;
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
