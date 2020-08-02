const INTERVAL_MSEC = 1000;
const ANIMATION_FLAG = true;

/**
 * Playout.
 * @param {*} input 
 * @param {*} isBoard 
 */
async function playout_all(input, isBoard) {
    let bestPath = new BestPath();

    let search = new Search();
    await search.search(input, isBoard, bestPath);
    alert(`search.js/playout_all: [1] search.nodesCount=${search.nodesCount}`);
    search = new Search();
    await search.search(input, isBoard, bestPath);
    alert(`search.js/playout_all: [2] search.nodesCount=${search.nodesCount}`);

    return bestPath.createArrows();
}

class BestPath {
    constructor() {
        this.value = 0;
        this.variation = undefined;
        this.variationValues = undefined;
        this.allVariations = [];
        this.allVariationValues = [];
    }

    createArrows() {
        // 矢印に変換。
        let arrows = [];
        let bestVarLen = 0;
        // alert(`search.js/createArrows: this.variation=${JSON.stringify(this.variation, null, '  ')}`);
        if (this.variation) {
            bestVarLen = this.variation.length;
        }
        for (let i = 1; i < bestVarLen; i++) {
            let bestSq = this.variation[i - 1];
            let bestVarVal = this.variationValues[i];
            let diff = this.variation[i] - this.variation[i - 1];
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
}

class Search {
    constructor() {
        this.nodesCount = undefined;
        this.board = undefined;
        this.checkBoard = undefined;
        this.value = undefined;
        this.isBoard = undefined;
        // Principal variations.
        this.pv = undefined;
        this.pv_value = undefined;
    }

    async search(input, isBoard, bestPath) {
        this.nodesCount = 0;
        this.board = this.createBoard(input);
        this.checkBoard = this.createFalseBoard(input);
        this.value = 0;
        this.isBoard = isBoard;
        // Principal variations.
        this.pv = [];
        this.pv_value = [];
        await this.node(undefined, this.find('K'), bestPath);
    }

    async node(preSq, currSq, bestPath) {
        // Animation
        if (ANIMATION_FLAG && this.isBoard) {
            const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            await _sleep(INTERVAL_MSEC);
            // alert(`search.js/node/start currSq=${currSq}`);
            if (preSq) {
                document.getElementById(`ui${preSq}`).setAttribute('class', 's');
            }
            document.getElementById(`ui${currSq}`).setAttribute('class', 'green_cursor');
        }

        // 直前の点数計算
        let diffValue = this.letDiffValue(preSq, currSq);
        this.nodesCount++;
        this.checkBoard[currSq] = true;
        this.pv.push(currSq);
        this.pv_value.push(diffValue);
        let ways = this.genMove(currSq, bestPath);
        // alert(`ways.length=${ways.length}`);
        if (ways.length === 0) {
            // Leaf
            if (diffValue != 4) {
                // 「行き止まり」を追加。
                this.value += 1;
                this.pv.push(currSq);
                this.pv_value.push(1);
            }
            if (bestPath.value < this.value) {
                bestPath.value = this.value;
                bestPath.variation = Array.from(this.pv);
                bestPath.variationValues = Array.from(this.pv_value);
            }
            // Record pv.
            bestPath.allVariations.push(Array.from(this.pv));
            bestPath.allVariationValues.push(Array.from(this.pv_value));
        }
        for (let nextSq of ways) {
            switch (this.board[nextSq]) {
                case 'G':
                    await this.node(currSq, nextSq, bestPath);
                    break;
                case 'S':
                    await this.node(currSq, nextSq, bestPath);
                    break;
                default:
                    break;
            }
        }
        this.pv_value.pop();
        this.pv.pop();
        this.checkBoard[currSq] = false;

        // Animation
        if (ANIMATION_FLAG && this.isBoard) {
            const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            await _sleep(INTERVAL_MSEC);
            // alert(`search.js/node/start currSq=${currSq}`);
            if (preSq) {
                document.getElementById(`ui${preSq}`).setAttribute('class', 'red_cursor');
            }
            document.getElementById(`ui${currSq}`).setAttribute('class', 's');
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
        if (this.existsPv(nextSq, bestPath)) {
            // 既存の枝は作らない。
            return;
        }
        if (!this.checkBoard[nextSq] && (dstPc === 'G' || dstPc === 'S')) {
            let srcPc = this.board[currSq];
            if (srcPc === 'G' || srcPc === 'S') {
                // 点数計算
                let diffValue = this.letDiffValue(currSq, nextSq);
                // alert(`nextSq=${nextSq} dstPc=${dstPc} diffValue=${diffValue}`);
                this.value += diffValue;
            }
            ways.push(nextSq);
        }
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

    existsPv(newSq, bestPath) {
        this.pv.push(newSq);
        let exists = false;
        // alert(`existsPv: bestPath.allVariations=${JSON.stringify(bestPath.allVariations, null, '  ')}`);
        for (let exist_var of bestPath.allVariations) {
            // alert(`existsPv: exist_var=${JSON.stringify(exist_var, null, '  ')}`);
            if (exist_var.length < this.pv.length) {
                // 一致しない
                continue;
            }
            for (let i = 0; i < this.pv.length; i++) {
                if (exist_var[i] !== this.pv[i]) {
                    // 一致しない
                    continue;
                }
            }
            // 一致した
            exists = true;
            break;
        }
        this.pv.pop();
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
