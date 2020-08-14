function id_to_html(id) {
    let html = "";
    let index = 0;
    for (ch of id) {
        console.log(`id=${ch}`);
        if (index == 0) {
            html += `<ruby>${ch}<rt><img src="./img/angle-n${ch}.png"></rt></ruby>`;
        } else if (index == 1) {
            html += `<ruby>${ch}<rt><img src="./img/angle-k${ch}.png"></rt></ruby>`;
        } else {
            html += `<ruby>${ch}<rt><img src="./img/angle-${ch}.png"></rt></ruby>`;
        }
        index++;
    }

    console.log(`html=${html}`);
    return html;
}