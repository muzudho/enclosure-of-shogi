const INTERVAL_MSEC = 500;
const ANIMATION_FLAG = true;

/**
 * Playout.
 * @param {*} input 
 * @param {*} isBoard 
 */
async function playoutAll(input, isBoard) {
    let bestPath = new BestPath();

    let search = new Search();
    await search.search(input, isBoard, bestPath);
    clearArrowLayer();
    clearUiLayer();
    // alert(`search.js/playoutAll: [1] search.nodesCount=${search.nodesCount}`);
    await sleep(INTERVAL_MSEC);

    search = new Search();
    await search.search(input, isBoard, bestPath);
    clearArrowLayer();
    clearUiLayer();
    // alert(`search.js/playoutAll: [2] search.nodesCount=${search.nodesCount}`);
    await sleep(INTERVAL_MSEC);

    return bestPath.createArrows();
}

class BestPath {
    constructor() {
        this.value = 0;
        this.graphSq = undefined;
        this.graphValues = undefined;
        this.allGraphSq = [];
        this.arrows = [];
    }

    createArrows() {
        return this.arrows;
        /*
        // 矢印に変換。
        let arrows = [];
        let bestVarLen = 0;
        if (this.graphSq) {
            bestVarLen = this.graphSq.length;
        }
        for (let i = 1; i < bestVarLen; i++) {
            let srcSq = this.graphSq[i - 1];
            let edgeValueFromDst = this.graphValues[i];
            let sqDiff = this.graphSq[i] - this.graphSq[i - 1];
            arrows.push([adjustSrcSq(srcSq, sqDiff), createClassText(edgeValueFromDst, sqDiff)]);
        }

        return arrows;
        */
    }
}

/**
 * 矢の元側マスの位置調整（ドロップ・シャドウ）。
 * @param {*} sq 
 * @param {*} sqDiff 
 */
function adjustSrcSq(sq, sqDiff) {
    // ドロップ・シャドウずらし
    switch (sqDiff) {
        case 9:
            sq += 9;
            break;
        case -1: // thru
        case -11: // thru
            sq += -1;
            break;
        case 10:
        case 11:
            sq += 10;
            break;
        default:
            break;
    }
    return sq;
}
function createClassText(edgeValueFromDst, sqDiff) {
    let classText;

    // 線算出
    switch (edgeValueFromDst) {
        case 0:
            // 玉からの矢印
            switch (sqDiff) {
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
            switch (sqDiff) {
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
            switch (sqDiff) {
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

    return classText;
}

class Search {
    constructor() {
        this.nodesCount = undefined;
        this.board = undefined;
        this.checkBoard = undefined;
        this.value = undefined;
        this.isBoard = undefined;
        // Graph.
        this.graphSq = undefined;
        this.graphValue = undefined;
        // Search round trip path.
        this.pathSq = undefined;
        this.arrows = undefined;
    }

    async search(input, isBoard, bestPath) {
        this.nodesCount = 0;
        this.board = this.createBoard(input);
        this.checkBoard = this.createFalseBoard(input);
        this.value = 0;
        this.isBoard = isBoard;
        // Graph.
        this.graphSq = [];
        this.graphValue = [];
        // Search round trip path.
        this.pathSq = [];
        this.arrows = [];
        await this.node(0, undefined, this.find('K'), bestPath);
    }

    async node(depth, prevSq, currSq, bestPath) {
        // 直前の点数計算
        let diffValue = this.letDiffValue(prevSq, currSq);
        this.nodesCount++;
        this.checkBoard[currSq] = true;
        this.graphSq.push(currSq);
        this.graphValue.push(diffValue);
        this.pathSq.push(currSq);

        // Animation
        if (ANIMATION_FLAG && this.isBoard) {
            const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            await _sleep(INTERVAL_MSEC);
            if (prevSq) {
                document.getElementById(`ui${prevSq}`).setAttribute('class', 's');
            }
            document.getElementById(`ui${currSq}`).setAttribute('class', 'green_cursor');

            let sqDiff = currSq - prevSq;
            let srcSq = adjustSrcSq(prevSq, sqDiff);
            let classText = createClassText(diffValue, sqDiff);
            await this.recordArrow(srcSq, classText);
            // alert(`search.js/node/start diffValue=${diffValue} prevSq=${prevSq} currSq=${currSq} sqDiff=${sqDiff} classText=${classText}`);
        }

        let ways = this.genMove(currSq, bestPath);
        // alert(`ways.length=${ways.length}`);
        if (ways.length === 0) {
            // Leaf
            // alert(`search.js: 行き止まり。 currSq=${currSq} ways.length=${ways.length}`);
            // 「行き止まり」を追加。
            if (diffValue != 4) {
                let leafValue = 1;
                this.addValue(leafValue);
                this.graphSq.push(currSq);
                this.graphValue.push(1);
                this.pathSq.push(currSq);

                let classText = createClassText(leafValue, 0);
                await this.recordArrow(currSq, classText);
            }
            // ベスト更新
            if (depth === 0 && bestPath.value < this.value) {
                alert(`search.js: ベスト更新。 bestPath.value=${bestPath.value} this.value=${this.value}`);
                bestPath.value = this.value;
                bestPath.graphSq = Array.from(this.graphSq);
                bestPath.graphValues = Array.from(this.graphValue);
                bestPath.arrows = Array.from(this.arrows);
            }
            // Record graph.
            bestPath.allGraphSq.push(Array.from(this.graphSq));
        }
        for (let nextSq of ways) {
            switch (this.board[nextSq]) {
                case 'G':
                    await this.node(depth + 1, currSq, nextSq, bestPath);
                    break;
                case 'S':
                    await this.node(depth + 1, currSq, nextSq, bestPath);
                    break;
                default:
                    break;
            }
        }
        // 後ろ向きパス
        // this.graphValue.push(0);
        // this.graphSq.push(0);
        // this.checkBoard[currSq] = false;

        // Animation
        if (ANIMATION_FLAG && this.isBoard) {
            const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            await _sleep(INTERVAL_MSEC);
            // alert(`search.js/node/start currSq=${currSq}`);
            if (prevSq) {
                document.getElementById(`ui${prevSq}`).setAttribute('class', 'red_cursor');
            }
            document.getElementById(`ui${currSq}`).setAttribute('class', 's');
        }
    }

    async recordArrow(srcSq, classText) {
        this.arrows.push([srcSq, classText]);
        drawArrow(srcSq, classText);
        await sleep(INTERVAL_MSEC);
    }

    /**
     * Generation move.
     */
    genMove(currSq, bestPath) {
        let ways = [];

        switch (this.board[currSq]) {
            case 'K':
                this.pushWay(- 10, ways, currSq, bestPath);
                this.pushWay(- 11, ways, currSq, bestPath);
                this.pushWay(- 1, ways, currSq, bestPath);
                this.pushWay(9, ways, currSq, bestPath);
                this.pushWay(10, ways, currSq, bestPath);
                this.pushWay(11, ways, currSq, bestPath);
                this.pushWay(1, ways, currSq, bestPath);
                this.pushWay(- 9, ways, currSq, bestPath);
                break;
            case 'G':
                this.pushWay(- 10, ways, currSq, bestPath);
                this.pushWay(- 11, ways, currSq, bestPath);
                this.pushWay(- 1, ways, currSq, bestPath);
                this.pushWay(9, ways, currSq, bestPath);
                this.pushWay(10, ways, currSq, bestPath);
                this.pushWay(1, ways, currSq, bestPath);
                break;
            case 'S':
                this.pushWay(- 11, ways, currSq, bestPath);
                this.pushWay(- 1, ways, currSq, bestPath);
                this.pushWay(9, ways, currSq, bestPath);
                this.pushWay(11, ways, currSq, bestPath);
                this.pushWay(- 9, ways, currSq, bestPath);
                break;
            default:
                break;
        }
        return ways;
    }

    pushWay(offset, ways, currSq, bestPath) {
        let nextSq = currSq + offset;
        let dstPc = this.board[nextSq];
        if (this.existsPath(nextSq, bestPath)) {
            // 既存の枝は作らない。
            return;
        }
        if (!this.checkBoard[nextSq] && (dstPc === 'G' || dstPc === 'S')) {
            let srcPc = this.board[currSq];
            if (srcPc === 'G' || srcPc === 'S') {
                // 点数加算
                let diffValue = this.letDiffValue(currSq, nextSq);
                this.addValue(diffValue);
            }
            ways.push(nextSq);
        }
    }

    addValue(offset) {
        this.value += offset;
        alert(`search.js: 点数加算 offset=${offset} value=${this.value}`);
    }

    /**
     * 局面差分評価値算出
     */
    letDiffValue(currSq, nextSq) {
        let srcPc = this.board[currSq];
        let dstPc = this.board[nextSq];
        let diff = nextSq - currSq;
        // alert(`letDiffValue: srcPc=${srcPc} dstPc=${dstPc} diff=${diff}`);
        switch (srcPc) {
            case 'G': // Gold
                switch (dstPc) {
                    case 'G': // Gold
                        switch (diff) {
                            case 1: //thru
                            case -1: // thru
                            case 10: // thru
                            case -10:
                                //        金(-1)
                                // 金(10) 金     金(-10)
                                //        金(1)
                                return 4;
                            case 9: // thuru
                            case -11:
                                // 金(9)    金(-11)
                                //      金
                                return 2;
                            default:
                                break;
                        }
                        break;
                    case 'S': // Silver
                        switch (diff) {
                            case -11: // thru
                            case 9:
                                // 銀(9)　銀(-11)
                                // 　   金
                                return 4;
                            case 1: //thru
                            case -1: // thru
                            case 10: // thru
                            case -10:
                                //        銀(-1)
                                // 銀(10) 金    銀(-10)
                                //        銀(1)
                                return 2;
                            default:
                                break;
                        }
                        break;
                    default:
                        break;
                }
                break;
            case 'S': // Silver
                switch (dstPc) {
                    case 'G': // Gold
                        switch (diff) {
                            case -9: // thru
                            case -1: // thru
                            case 11:
                                //     金(-1)
                                //     銀
                                // 金(11)  金(-9)
                                return 4;
                            case -11: // thru
                            case 9:
                                // 金(9)  金(-11)
                                //     銀
                                return 2;
                            default:
                                break;
                        }
                        break;
                    case 'S': // Silver
                        switch (diff) {
                            case -11: // thru
                            case 9: // thru
                            case 11: // thru
                            case -9: // thru
                                // 銀(9)    銀(-11)
                                //      銀
                                // 銀(11)   銀(-9)
                                return 4;
                            case -1:
                                // 銀(-1)
                                // 銀
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

    existsPath(newSq, bestPath) {
        this.pathSq.push(newSq);
        let exists = false;
        for (let existVar of bestPath.allGraphSq) {
            // alert(`existsPath: existVar=${JSON.stringify(existVar, null, '  ')}`);
            if (existVar.length < this.pathSq.length) {
                // 一致しない
                continue;
            }
            for (let i = 0; i < this.pathSq.length; i++) {
                if (existVar[i] !== this.pathSq[i]) {
                    // 一致しない
                    continue;
                }
            }
            // 一致した
            exists = true;
            break;
        }
        this.pathSq.pop();
        return exists;
    }

    find(piece) {
        for (const [i, sq] of this.board.entries()) {
            if (sq === piece) {
                return i;
            }
        }
    }

    createBoard(input) {
        let board = [];

        for (let rank = 1; rank < 10; rank++) {
            for (let file = 9; 0 < file; file--) {
                board[file * 10 + rank] = '';
            }
        }

        for (entry of input.board) {
            // alert(`entry[${entry[0]}][${entry[1]}]`);
            switch (entry[1]) {
                case 'K': // thru
                case 'G': // thru
                case 'S':
                    board[entry[0]] = entry[1];
                    break;
                default:
                    // alert(`default entry[${entry[0]}][${entry[1]}]`);
                    break;
            }
        }

        return board;
    }

    createFalseBoard() {
        let board = [];

        for (let rank = 1; rank < 10; rank++) {
            for (let file = 9; 0 < file; file--) {
                board[file * 10 + rank] = false;
            }
        }

        return board;
    }
}
