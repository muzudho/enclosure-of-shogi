class ConnectedGraph {
    constructor() {
        this.leashValue = 0;
        this.playoffValueWithWeight = 0;
        /** 根元と行き先で別。 */
        this.srcSquareOfEdges = undefined;
        this.dstLeashOfEdges = undefined;
        this.dstPlayoffOfEdges = undefined;
        this.allGraphSq = [];
        /** [[srcSq, classText, leashValue, sourcePlayoff]] */
        this.arrayOfEdge = [];
    }

    update(leashValue, srcSquareOfEdges, dstLeashOfEdges, dstPlayoffOfEdges, arrayOfEdge) {
        let playoffValueWithWeight = this.sumPlayoffValueWithWeight(arrayOfEdge);
        if ((this.leashValue < leashValue) || (this.leashValue == leashValue && this.playoffValueWithWeight < playoffValueWithWeight)) {
            // ベスト更新
            this.leashValue = leashValue;
            this.playoffValueWithWeight = playoffValueWithWeight;
            this.srcSquareOfEdges = Array.from(srcSquareOfEdges);
            this.dstLeashOfEdges = Array.from(dstLeashOfEdges);
            this.dstPlayoffOfEdges = Array.from(dstPlayoffOfEdges);
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
