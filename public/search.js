const INTERVAL_MSEC = 17;
const ANIMATION_FLAG = true;

/**
 * Playout.
 * @param {*} input 
 * @param {*} isBoard 
 */
async function playoutAll(input, isBoard) {
    let bestPath = new BestPath();

    for (let i = 0; i < 100; i++) {
        let search = new Search();
        await search.search(input, isBoard, bestPath);
    }

    return bestPath;
}

class BestPath {
    constructor() {
        this.value = 0;
        this.graphSq = undefined;
        this.graphValues = undefined;
        this.allGraphSq = [];
        this.arrows = [];
    }

    update(value, graphSq, graphValues, arrows) {
        if (this.value < value) {
            // ベスト更新
            this.value = value;
            this.graphSq = Array.from(graphSq);
            this.graphValues = Array.from(graphValues);
            this.arrows = Array.from(arrows);
        }
    }

    createArrows() {
        return this.arrows;
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
        this.graphValues = undefined;
        // Search round trip path.
        this.pathSq = undefined;
        this.arrows = undefined;
    }

    async search(input, isBoard, bestPath) {
        this.nodesCount = 0;
        this.board = this.createBoard(input);
        this.checkBoard = this.createFalseBoard();
        this.value = 0;
        this.isBoard = isBoard;
        // Graph.
        this.graphSq = [];
        this.graphValues = [];
        // Search round trip path.
        this.pathSq = [];
        this.arrows = [];
        await this.node(0, undefined, this.find('K'), bestPath);

        // ベスト更新
        bestPath.update(this.value, this.graphSq, this.graphValues, this.arrows);
        // 後処理。
        if (this.isBoard) {
            clearArrowLayer();
            clearUiLayer();
            await sleep(INTERVAL_MSEC);
        }
    }

    async node(depth, prevSq, currSq, bestPath) {
        // 直前の点数計算
        let diffValue = this.letDiffValue(prevSq, currSq);
        this.nodesCount++;
        this.checkBoard[currSq] = true;
        this.graphSq.push(currSq);
        this.graphValues.push(diffValue);
        this.pathSq.push(currSq);

        // Animation
        if (ANIMATION_FLAG) {
            if (this.isBoard) {
                await sleep(INTERVAL_MSEC);
                if (prevSq) {
                    document.getElementById(`ui${prevSq}`).setAttribute('class', 's');
                }
                document.getElementById(`ui${currSq}`).setAttribute('class', 'green_cursor');
            }

            let sqDiff = currSq - prevSq;
            let srcSq = adjustSrcSq(prevSq, sqDiff);
            let classText = createClassText(diffValue, sqDiff);
            await this.recordArrow(srcSq, classText, diffValue);
        }

        let ways = this.genMove(currSq, bestPath);
        shuffle_array(ways);
        if (ways.length === 0) {
            // Leaf
            // 「行き止まり」を追加。
            if (diffValue != 4) {
                let leafValue = 1;
                this.addValue(leafValue);
                this.graphSq.push(currSq);
                this.graphValues.push(1);
                this.pathSq.push(currSq);

                let classText = createClassText(leafValue, 0);
                await this.recordArrow(currSq, classText, leafValue);
            }
            // Record graph.
            bestPath.allGraphSq.push(Array.from(this.graphSq));
        }
        for (let nextSq of ways) {
            // ループ中に状態が変わってるので再チェック
            if (!this.checkBoard[nextSq]) {
                // 点数加算
                let srcPc = this.board[currSq];
                // キングを除く
                if (srcPc !== 'K') {
                    let diffValue = this.letDiffValue(currSq, nextSq);
                    this.addValue(diffValue);
                }

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
        }

        // Animation
        if (ANIMATION_FLAG && this.isBoard) {
            await sleep(INTERVAL_MSEC);
            if (prevSq) {
                document.getElementById(`ui${prevSq}`).setAttribute('class', 'red_cursor');
            }
            document.getElementById(`ui${currSq}`).setAttribute('class', 's');
        }
    }

    async recordArrow(srcSq, classText, value) {
        this.arrows.push([srcSq, classText, value]);
        if (this.isBoard) {
            drawArrow(srcSq, classText);
            await sleep(INTERVAL_MSEC);
        }
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
        if (!this.checkBoard[nextSq] && (dstPc === 'G' || dstPc === 'S')) {
            ways.push(nextSq);
        }
    }

    addValue(offset) {
        this.value += offset;
    }

    /**
     * 局面差分評価値算出
     */
    letDiffValue(currSq, nextSq) {
        let srcPc = this.board[currSq];
        let dstPc = this.board[nextSq];
        let diff = nextSq - currSq;
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


        for (let entry of board_to_array(input)) {
            switch (entry[1]) {
                case 'K': // thru
                case 'G': // thru
                case 'S':
                    board[entry[0]] = entry[1];
                    break;
                default:
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
