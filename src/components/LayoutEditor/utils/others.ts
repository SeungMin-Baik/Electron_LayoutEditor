/**
 * Parse value to JSON.
 * @param rawValue  Raw value.
 * @returns         Parsed value.
 */
export function parseJson<T = any>(rawValue: any | string): T {
    try {
        return typeof rawValue === 'string' ?
            JSON.parse(rawValue) : rawValue;
    } catch (_) {
        /* istanbul ignore next */
        return _;
    }
}

export function colorFormatConvert <T = any>(inputString: string, outTarget: string): T {
    const input = inputString.toUpperCase().replace(/\s/g, '');
    const outputTarget = outTarget.toUpperCase().replace(/\s/g, '');
    let RGBA = [255, 255, 255, 0];
    let output;

    if (input.match(/^\#[0-9a-fA-F]{6}$/)) {
        // HEX - #RRGGBB
        const tmpColor = input.substring(1, 7);
        RGBA[0] = +('0x' + tmpColor.substring(0, 2));
        RGBA[1] = +('0x' + tmpColor.substring(2, 4));
        RGBA[2] = +('0x' + tmpColor.substring(4, 6));
        RGBA[3] = 1;
    } else if (input.match(/^\#[0-9a-fA-F]{8}$/)) {
        // HEXA - #RRGGBBAA
        const tmpColor = input.substring(1, 9);
        RGBA[0] = +('0x' + tmpColor.substring(0, 2));
        RGBA[1] = +('0x' + tmpColor.substring(2, 4));
        RGBA[2] = +('0x' + tmpColor.substring(4, 6));
        RGBA[3] = +('0x' + tmpColor.substring(6, 8)) / 255;
    } else if (input.match(/^(?:RGB\((?:(?:(?:[01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]),\s*){2}(?:[01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\)))$/)) {
        // RGB - rgb(RRR,GGG,BBB)
        const tmpColor = input.replace(/RGB|\(|\)/g, '').split(',');
        RGBA = [parseInt(tmpColor[0], 10), parseInt(tmpColor[1], 10), parseInt(tmpColor[2], 10), 1];
    } else if (input.match(/^RGBA\((0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),(0?\.\d*|1(\.0)?)\)$/)) {
        // RGBA - rgba(RRR,GGG,BBB,A)
        const tmpColor = input.replace(/RGBA|\(|\)/g, '').split(',');
        RGBA = [parseInt(tmpColor[0], 10), parseInt(tmpColor[1], 10), parseInt(tmpColor[2], 10), parseInt(tmpColor[3], 10)];
    } else {
        RGBA = [255, 255, 255, 0];
    }

    if (outputTarget === 'HEX') {
        leadingZeros( ((+RGBA[0]).toString(16)) , 2);
        output = '#' + leadingZeros( ((+RGBA[0]).toString(16)) , 2)
        + leadingZeros( ((+RGBA[1]).toString(16)) , 2)
        + leadingZeros( ((+RGBA[2]).toString(16)) , 2);
    } else if (outputTarget === 'HEXA') {
        const r = RGBA[0];
        const g = RGBA[1];
        const b = RGBA[2];
        const a = RGBA[3];

        output = '#' + leadingZeros(r.toString(16), 2) + leadingZeros(g.toString(16), 2) + leadingZeros(b.toString(16), 2) + leadingZeros((a * 255).toString(16).substring(0, 2), 2);
    } else if (outputTarget === 'RGB') {
        output = 'rgb(' + RGBA[0] + ', ' + RGBA[1] + ', ' + RGBA[2] + ')';
    } else if (outputTarget === 'RGBA') {
        output = 'rgba(' + RGBA[0] + ', ' + RGBA[1] + ', ' + RGBA[2] + ', ' + RGBA[3] + ')';
    } else {
        output = 'rgba(255, 255, 255, 0)';
    }

    return output;
} // end of colorFormatConvert()


export function  leadingZeros (stringValue: string, digits: number): string {
    let zero = '';
    const input = stringValue;

    if (input.length < digits) {
        for (let i = 0; i < digits - input.length; i++) { zero += '0'; }
    }
    return zero + '' + input;
} // end of leadingZeros()
