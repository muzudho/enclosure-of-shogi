class ConnectedGraph {
    constructor() {
        this.leashValue = 0;
        this.playoffValueWithWeight = 0;
        /** 根元と行き先で別。 */
        this.arrayOfSrcSquares = undefined;
        this.arrayOfDstLeashValues = undefined;
        this.arrayOfDstPlayoffValues = undefined;
        this.allGraphSq = [];
        /** [[srcSq, classText, leashValue, sourcePlayoffBase, sourcePlayoffExp]] */
        this.arrayOfEdge = [];
    }

    update(leashValue, arrayOfSrcSquares, arrayOfDstLeashValues, arrayOfDstPlayoffValues, arrayOfEdge) {
        let playoffValueWithWeight = this.sumPlayoffValueWithWeight(arrayOfEdge);
        if ((this.leashValue < leashValue) || (this.leashValue == leashValue && this.playoffValueWithWeight < playoffValueWithWeight)) {
            // ベスト更新
            this.leashValue = leashValue;
            this.playoffValueWithWeight = playoffValueWithWeight;
            this.arrayOfSrcSquares = Array.from(arrayOfSrcSquares);
            this.arrayOfDstLeashValues = Array.from(arrayOfDstLeashValues);
            this.arrayOfDstPlayoffValues = Array.from(arrayOfDstPlayoffValues);
            this.arrayOfEdge = Array.from(arrayOfEdge);
        }
    }

    getArrayOfEdge() {
        return this.arrayOfEdge;
    }

    /**
     * 同点決勝点。
     */
    sumPlayoffValueWithWeight(bestConnectedGraph) {
        let reversed = Array.from(bestConnectedGraph);
        reversed.reverse();
        let i = 1;

        let sum = 0;
        for (let entry of reversed) {
            if (entry[1]) {
                sum += entry[3] * Math.pow(8, i);
            }
            i++;
        }

        return sum;
    }
}
