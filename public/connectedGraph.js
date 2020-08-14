class ConnectedGraph {
    constructor() {
        this.leashValue = 0;
        /** 根元と行き先で別。 */
        this.srcSquareOfEdges = undefined;
        this.dstLeashOfEdges = undefined;
        this.dstPlayoffOfEdges = undefined;
        /** [[srcSq, classText, leashValue, sourcePlayoff, depth]] */
        this.propertiesOfEdges = [];
        this.connectedGraphIdentifier = undefined;
    }

    update(leashValue, srcSquareOfEdges, dstLeashOfEdges, dstPlayoffOfEdges, propertiesOfEdges, connectedGraphIdentifier) {
        let update = false;
        if (this.leashValue < leashValue) {
            // 更新確定。
            // console.log(`更新確定 new=${connectedGraphIdentifier} ${this.leashValue} < ${leashValue}`);
            update = true;
        } else if (this.leashValue === leashValue) {
            // 同点決勝。
            if (this.connectedGraphIdentifier === connectedGraphIdentifier) {
                // console.log(`重複無視 ${this.connectedGraphIdentifier}`);
            } else {
                let compareConnectedGraphIdentifier = this.compareConnectedGraphIdentifier(connectedGraphIdentifier);
                if (compareConnectedGraphIdentifier) {
                    // console.log(`同点更新 ${connectedGraphIdentifier} < ${this.connectedGraphIdentifier} => ${compareConnectedGraphIdentifier}`);
                    update = true;
                } else {
                    // console.log(`同点決勝敗退 ${connectedGraphIdentifier} < ${this.connectedGraphIdentifier} => ${compareConnectedGraphIdentifier}`);
                }
            }
        }
        if (update) {
            // ベスト更新
            this.connectedGraphIdentifier = connectedGraphIdentifier;
            this.leashValue = leashValue;
            this.srcSquareOfEdges = Array.from(srcSquareOfEdges);
            this.dstLeashOfEdges = Array.from(dstLeashOfEdges);
            this.dstPlayoffOfEdges = Array.from(dstPlayoffOfEdges);
            this.propertiesOfEdges = Array.from(propertiesOfEdges);
        }
    }

    /**
     * 最大の深さ。
     */
    getMaxDepth(propertiesOfEdges) {
        let max = 0;
        for (const properties of propertiesOfEdges) {
            if (max < properties[4]) {
                max = properties[4];
            }
        }
        return max;
    }

    getPropertiesEdges() {
        return this.propertiesOfEdges;
    }

    /**
     * 同点決勝判定。
     */
    compareConnectedGraphIdentifier(connectedGraphIdentifier) {
        // ベストが undefined なら、更新。
        if (!this.connectedGraphIdentifier) {
            return true;
        }

        // 文字数が短ければ、更新。
        if (connectedGraphIdentifier.length < this.connectedGraphIdentifier.length) {
            return true;
        }

        // 辞書順ソートで小さければ、更新。
        return connectedGraphIdentifier < this.connectedGraphIdentifier
    }
}
