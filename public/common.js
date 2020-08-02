async function sleep(msec) {
    const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await _sleep(INTERVAL_MSEC);
}

function drawArrow(srcSq, classOfArrow) {
    let angle = whichAngle(classOfArrow);
    let id = `${angle}${srcSq}`;
    // alert(`board.html: id=${id} class=${classOfArrow}`);
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
        case 'k15': // thru
        case 'k51':
            return 'w';
        case 'a37': // thru
        case 'a3773': // thru
        case 'a73': // thru
        case 'k37': // thru
        case 'k73':
            return 'h';
        case 'a26': // thru
        case 'a2662': // thru
        case 'a48': // thru
        case 'a4884': // thru
        case 'a62': // thru
        case 'a84': // thru
        case 'k26': // thru
        case 'k48': // thru
        case 'k62': // thru
        case 'k84':
            return 'd';
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