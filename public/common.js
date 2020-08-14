const INTERVAL_MSEC = 17;
animationEnable = true;

async function sleep(msec) {
    const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await _sleep(INTERVAL_MSEC);
}

function drawArrow(srcSq, classOfArrow) {
    let angle = whichAngle(classOfArrow);
    let id = `${angle}${srcSq}`;
    if (srcSq && classOfArrow) {
        document.getElementById(id).setAttribute('class', classOfArrow);
    }
}

/**
 * w - width
 * h - height
 * d - diagonal
 * c - center
 */
function whichAngle(classText) {
    switch (classText) {
        case 'a15': // thru
        case 'a1551': // thru
        case 'a51': // thru
        case 'a5115': // thru
        case 'k15': // thru
        case 'k51':
            return 'w';
        case 'a37': // thru
        case 'a3773': // thru
        case 'a73': // thru
        case 'a7337': // thru
        case 'k37': // thru
        case 'k73':
            return 'h';
        case 'a26': // thru
        case 'a2662': // thru
        case 'a62': // thru
        case 'a6226': // thru
        case 'k26': // thru
        case 'k62': // thru
            // ／
            return 'dz';
        case 'a48': // thru
        case 'a4884': // thru
        case 'a84': // thru
        case 'a8448': // thru
        case 'k48': // thru
        case 'k84':
            // ＼
            return 'ds';
        case 'a1':
            return 'c';
        default:
            return '';
    }
}

/**
 * Dustenfeld shuffle.
 * [JavaScript で シャッフルする](https://qiita.com/pure-adachi/items/77fdf665ff6e5ea22128)
 * 
 * @param {*} array 
 */
function shuffle_array(array) {
    for (i = array.length; 1 < i; i--) {
        k = Math.floor(Math.random() * i);
        [array[k], array[i - 1]] = [array[i - 1], array[k]];
    }
}

function board_to_array(input) {
    let array = [];

    let rank = 1;
    for (row of input.board) {
        let file = 9;
        for (piece of row) {
            switch (piece) {
                case '.':
                    // Ignored it.
                    break;
                case 'G':
                case 'S':
                case 'K':
                case 'X': // Ghost king.
                    array.push([file * 10 + rank, piece]);
                    break;
                default:
                    // R, B, N, L, P, etc...
                    array.push([file * 10 + rank, '0']);
                    break;
            }
            file--;
        }
        rank++;
    }

    return array;
}

function findGetParameter(parameterName) {
    let result = null;
    let tmp = [];
    window.location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}
