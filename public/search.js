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
        this.playoffValue = 0;
        /** Array of source squares. */
        this.arrayOfSourceSquares = undefined;
        this.arrayOfLeashValues = undefined;
        this.arrayOfPlayoffValues = undefined;
        this.allGraphSq = [];
        /** [[srcSq, classText, leashValue, playoffValue]] */
        this.connectedGraph = [];
    }

    update(leashValue, playoffValue, arrayOfSourceSquares, arrayOfLeashValues, arrayOfPlayoffValues, connectedGraph) {
        if ((this.leashValue < leashValue) || (this.leashValue == leashValue && this.playoffValue < playoffValue)) {
            // ベスト更新
            this.leashValue = leashValue;
            this.playoffValue = playoffValue;
            this.arrayOfSourceSquares = Array.from(arrayOfSourceSquares);
            this.arrayOfLeashValues = Array.from(arrayOfLeashValues);
            this.arrayOfPlayoffValues = Array.from(arrayOfPlayoffValues);
            this.connectedGraph = Array.from(connectedGraph);
        }
    }

    createConnectedGraph() {
        return this.connectedGraph;
    }

    /**
     * @returns connectedGraph[]
     */
    createPlayoffArrows() {
        let connectedGraph = [];

        for (let arrow of this.connectedGraph) {
            let result;
            switch (arrow[1]) {
                case 'k51':
                    result = ['po51', 8];
                    break;
                case 'k62':
                    result = ['po62', 7];
                    break;
                case 'k73':
                    result = ['po73', 6];
                    break;
                case 'k84':
                    result = ['po84', 5];
                    break;
                case 'k15':
                    result = ['po15', 4];
                    break;
                case 'k26':
                    result = ['po26', 3];
                    break;
                case 'k37':
                    result = ['po37', 2];
                    break;
                case 'k48':
                    result = ['po48', 1];
                    break;
                case 'a1':
                    result = ['s', 0];
                    break;
                case 'a51':
                    result = ['po51', 8];
                    break;
                case 'a62':
                    result = ['po62', 7];
                    break;
                case 'a73':
                    result = ['po73', 6];
                    break;
                case 'a84':
                    result = ['po84', 5];
                    break;
                case 'a15':
                    result = ['po15', 4];
                    break;
                case 'a26':
                    result = ['po26', 3];
                    break;
                case 'a37':
                    result = ['po37', 2];
                    break;
                case 'a48':
                    result = ['po48', 1];
                    break;
                case 'a1551':
                    result = ['po15', 4];
                    break;
                case 'a2662':
                    result = ['po26', 3];
                    break;
                case 'a3773':
                    result = ['po37', 2];
                    break;
                case 'a4884':
                    result = ['po48', 1];
                    break;
                case 'a5115':
                    result = ['po51', 8];
                    break;
                case 'a6226':
                    result = ['po62', 7];
                    break;
                case 'a7337':
                    result = ['po73', 6];
                    break;
                case 'a8448':
                    result = ['po84', 5];
                    break;
                default:
                    result = undefined;
                    break;
            }

            connectedGraph.push(result);
        }

        return connectedGraph;
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
        this.playoffValue = undefined;
        this.isBoard = undefined;
        // Graph.
        this.arrayOfSourceSquares = undefined;
        this.arrayOfLeashValues = undefined;
        this.arrayOfPlayoffValues = undefined;
        this.connectedGraph = undefined;
    }

    async search(input, isBoard, bestPath) {
        this.nodesCount = 0;
        this.board = this.createBoard(input);
        this.checkBoard = this.createFalseBoard();
        this.leashValue = 0;
        this.playoffValue = 0;
        this.isBoard = isBoard;
        // Graph.
        this.arrayOfSourceSquares = [];
        this.arrayOfLeashValues = [];
        this.arrayOfPlayoffValues = [];
        this.connectedGraph = [];
        await this.node(0, undefined, this.find('K'), bestPath);

        // ベスト更新
        bestPath.update(this.leashValue, this.playoffValue, this.arrayOfSourceSquares, this.arrayOfLeashValues, this.arrayOfPlayoffValues, this.connectedGraph);
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
        let playoffValue = this.letPlayoffValue(prevSq, currSq);
        this.nodesCount++;
        this.checkBoard[currSq] = true;
        this.arrayOfSourceSquares.push(currSq);
        this.arrayOfLeashValues.push(leashValue);
        this.arrayOfPlayoffValues.push(playoffValue);

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
        await this.recordArrow(srcSq, classText, leashValue, playoffValue);

        let ways = this.genMove(currSq, bestPath);
        shuffle_array(ways);
        if (ways.length === 0) {
            // Leaf
            // 「行き止まり」を追加。ただし、玉が葉のときを除く。
            if (leashValue != 4 && this.board[currSq] !== 'K') {
                let leafValue = 1;
                this.addLeashValue(leafValue);
                this.arrayOfSourceSquares.push(currSq);
                this.arrayOfLeashValues.push(1);
                this.arrayOfPlayoffValues.push(0);

                let classText = createClassText(leafValue, 0);
                await this.recordArrow(currSq, classText, leafValue);
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
                    let playoffValue = this.letPlayoffValue(currSq, nextSq);
                    this.addLeashValue(leashValue);
                    this.addPlayoffValue(playoffValue);
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

    async recordArrow(srcSq, classText, leashValue, playoffValue) {
        this.connectedGraph.push([srcSq, classText, leashValue, playoffValue]);
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

    addPlayoffValue(offset) {
        this.playoffValue += offset;
    }

    /**
     * 
     * @param {*} currSq 
     * @param {*} nextSq 
     */
    letPlayoffValue(currSq, nextSq) {
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
