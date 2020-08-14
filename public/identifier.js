function id_to_html(id) {
    let html = "";
    let index = 0;
    for (ch of id) {
        console.log(`id=${ch}`);
        if (index == 1) {
            html += `<ruby>${ch}<rt><img src="./img/angle-n${ch}.png"></rt></ruby>`;
        } else if (index == 2) {
            html += `<ruby>${ch}<rt><img src="./img/angle-k${ch}.png"></rt></ruby>`;
        } else {
            // Windows のファイル名は英字大文字・小文字を区別できないので、小文字に揃えるぜ☆（＾～＾）
            let ch_file = `${ch}`.toLowerCase();
            if (ch_file == '[' || ch_file == ']') {
                ch_file = '0';
            }
            html += `<ruby>${ch}<rt><img src="./img/angle-${ch_file}.png"></rt></ruby>`;
        }
        index++;
    }

    console.log(`html=${html}`);
    return html;
}