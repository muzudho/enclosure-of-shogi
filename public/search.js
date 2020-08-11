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
        this.leashValue = 0;
        this.playoffValueWithWeight = 0;
        /** Array of source squares. */
        this.arrayOfSourceSquares = undefined;
        this.arrayOfLeashValues = undefined;
        this.arrayOfPlayoffValuesBase = undefined;
        this.arrayOfPlayoffValuesExp = undefined;
        this.allGraphSq = [];
        /** [[srcSq, classText, leashValue, sourcePlayoffBase, sourcePlayoffExp]] */
        this.connectedGraph = [];
    }

    update(leashValue, arrayOfSourceSquares, arrayOfLeashValues, arrayOfPlayoffValuesBase, arrayOfPlayoffValuesExp, connectedGraph) {
        let playoffValueWithWeight = this.sumPlayoffValueWithWeight();
        if ((this.leashValue < leashValue) || (this.leashValue == leashValue && this.playoffValueWithWeight < playoffValueWithWeight)) {
            // ベスト更新
            this.leashValue = leashValue;
            this.playoffValueWithWeight = playoffValueWithWeight;
            this.arrayOfSourceSquares = Array.from(arrayOfSourceSquares);
            this.arrayOfLeashValues = Array.from(arrayOfLeashValues);
            this.arrayOfPlayoffValuesBase = Array.from(arrayOfPlayoffValuesBase);
            this.arrayOfPlayoffValuesExp = Array.from(arrayOfPlayoffValuesExp);
            this.connectedGraph = Array.from(connectedGraph);
        }
    }

    createConnectedGraph() {
        return this.connectedGraph;
    }

    /**
     * 同点決勝点。
     */
    sumPlayoffValueWithWeight() {
        let sum = 0;
        if (this.arrayOfPlayoffValuesBase && this.arrayOfPlayoffValuesExp) {
            for (let i = 0; i < this.arrayOfPlayoffValuesBase.length; i++) {
                if (this.arrayOfPlayoffValuesBase[i] && this.arrayOfPlayoffValuesExp[i]) {
                    sum += Math.pow(this.arrayOfPlayoffValuesBase[i], this.arrayOfPlayoffValuesExp[i]);
                }
            }
        }
        return sum;
    }
}

function playoutValueToClassText(playoutValue) {
    let result;
    switch (playoutValue) {
        case 8:
            result = 'po51';
            break;
        case 7:
            result = 'po62';
            break;
        case 6:
            result = 'po73';
            break;
        case 5:
            result = 'po84';
            break;
        case 4:
            result = 'po15';
            break;
        case 3:
            result = 'po26';
            break;
        case 2:
            result = 'po37';
            break;
        case 1:
            result = 'po48';
            break;
        default:
            result = undefined;
            break;
    }
    return result;
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
                    classText = 'a5115';
                    break;
                case -11:
                    classText = 'a6226';
                    break;
                case -1:
                    classText = 'a7337';
                    break;
                case 9:
                    classText = 'a8448';
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
        this.leashValue = undefined;
        this.playoffValueWithWeight = undefined;
        this.isBoard = undefined;
        // Graph.
        this.arrayOfSourceSquares = undefined;
        this.arrayOfLeashValues = undefined;
        this.arrayOfPlayoffValuesBase = undefined;
        this.arrayOfPlayoffValuesExp = undefined;
        this.connectedGraph = undefined;
    }

    async search(input, isBoard, bestPath) {
        this.nodesCount = 0;
        this.board = this.createBoard(input);
        this.checkBoard = this.createFalseBoard();
        this.leashValue = 0;
        this.playoffValueWithWeight = 0;
        this.isBoard = isBoard;
        // Graph.
        this.arrayOfSourceSquares = [];
        this.arrayOfLeashValues = [];
        this.arrayOfPlayoffValuesBase = [];
        this.arrayOfPlayoffValuesExp = [];
        this.connectedGraph = [];
        await this.node(0, undefined, this.find('K'), bestPath);

        // ベスト更新
        bestPath.update(this.leashValue, this.arrayOfSourceSquares, this.arrayOfLeashValues, this.arrayOfPlayoffValuesBase, this.arrayOfPlayoffValuesExp, this.connectedGraph);
        // 後処理。
        if (animationEnable && this.isBoard) {
            clearArrowLayer();
            clearUiLayer();
            await sleep(INTERVAL_MSEC);
        }
    }

    async node(depth, prevSq, currSq, bestPath) {
        // 直前の点数計算
        let leashValue = this.letLeashValue(prevSq, currSq);
        let sourcePlayoffValue = this.letSourcePlayoffValue(prevSq, currSq);
        this.nodesCount++;
        this.checkBoard[currSq] = true;
        this.arrayOfSourceSquares.push(currSq);
        this.arrayOfLeashValues.push(leashValue);
        this.addPlayoffValue(sourcePlayoffValue);

        // Animation
        if (animationEnable) {
            if (this.isBoard) {
                await sleep(INTERVAL_MSEC);
                if (prevSq) {
                    document.getElementById(`ui${prevSq}`).setAttribute('class', 's');
                }
                document.getElementById(`ui${currSq}`).setAttribute('class', 'green_cursor');
            }
        }

        // Record
        let sqDiff = currSq - prevSq;
        let srcSq = adjustSrcSq(prevSq, sqDiff);
        let classText = createClassText(leashValue, sqDiff);
        await this.recordArrow(srcSq, classText, leashValue, sourcePlayoffValue);

        let ways = this.genMove(currSq, bestPath);
        shuffle_array(ways);
        if (ways.length === 0) {
            // Leaf
            // 「行き止まり」を追加。ただし、玉が葉のときを除く。
            if (leashValue != 4 && this.board[currSq] !== 'K') {
                let leafValue = 1;
                let sourcePlayoffValue = 0;
                this.addLeashValue(leafValue);
                this.arrayOfSourceSquares.push(currSq);
                this.arrayOfLeashValues.push(leafValue);
                this.addPlayoffValue(sourcePlayoffValue);

                let classText = createClassText(leafValue, 0);
                await this.recordArrow(currSq, classText, leafValue, sourcePlayoffValue);
            }
            // Record graph.
            bestPath.allGraphSq.push(Array.from(this.arrayOfSourceSquares));
        }
        for (let nextSq of ways) {
            // ループ中に状態が変わってるので再チェック
            if (!this.checkBoard[nextSq]) {
                // 点数加算
                let srcPc = this.board[currSq];
                // キングを除く
                if (srcPc !== 'K') {
                    let leashValue = this.letLeashValue(currSq, nextSq);
                    let sourcePlayoffValue = this.letSourcePlayoffValue(currSq, nextSq);
                    this.addLeashValue(leashValue);
                    this.arrayOfSourceSquares.push(currSq);
                    this.arrayOfLeashValues.push(leashValue);
                    this.addPlayoffValue(sourcePlayoffValue);
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
        if (animationEnable && this.isBoard) {
            await sleep(INTERVAL_MSEC);
            if (prevSq) {
                document.getElementById(`ui${prevSq}`).setAttribute('class', 'red_cursor');
            }
            document.getElementById(`ui${currSq}`).setAttribute('class', 's');
        }
    }

    async recordArrow(srcSq, classText, leashValue, playoffValueSource) {
        this.connectedGraph.push([srcSq, classText, leashValue, playoffValueSource]);
        if (animationEnable && this.isBoard) {
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

    addLeashValue(offset) {
        this.leashValue += offset;
    }

    addPlayoffValue(value) {
        this.arrayOfPlayoffValuesBase.push(value);
        this.arrayOfPlayoffValuesExp.push(this.arrayOfPlayoffValuesExp.length + 1);

        /*
        // 既存の値を重くするために、８倍にします。
        for (let i = 0; i < this.arrayOfPlayoffValues.length; i++) {
            this.arrayOfPlayoffValues[i] = this.arrayOfPlayoffValues[i] * 8;
        }
        this.arrayOfPlayoffValues.push(value);
        */
    }

    /**
     * 
     * @param {*} currSq 
     * @param {*} nextSq 
     */
    letSourcePlayoffValue(currSq, nextSq) {
        let diff = nextSq - currSq;
        let value;
        // 9, -1, -11
        // 10, 0, -10
        // 11, 1, -9
        switch (diff) {
            case -10:
                value = 8;
                break;
            case -11:
                value = 7;
                break;
            case -1:
                value = 6;
                break;
            case 9:
                value = 5;
                break;
            case 10:
                value = 4;
                break;
            case 11:
                value = 3;
                break;
            case 1:
                value = 2;
                break;
            case -9:
                value = 1;
                break;
            default:
                break;
        }

        return value;
    }
    /**
     * 矢のleash点数算出
     */
    letLeashValue(currSq, nextSq) {
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
