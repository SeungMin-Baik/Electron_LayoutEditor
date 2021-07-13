/**
 * generate pin code
 */
export function genPinAndName(): any {
    let pincode = '';
    for (let i = 0; i < 32; i++) {
        if (i === 4 || i === 8 || i === 12 ||
            i === 16 || i === 20 || i === 24 || i === 28) {
            pincode = pincode.concat('-');
        }
        pincode = pincode.concat(genChar());
    }

    if (pincode.length !== 39) return genPinAndName();
    else return {
        pincode,
        name: genName(pincode)
    };
}


/**
 * generate charater
 */
export function genChar() {
    const str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return str[Math.round(Math.random() * str.length) - 1];
}


/**
 * generate device name
 */
export function genName(pinCode: string) {
    let Name = 'Cublick_Displayer ';

    for (let i = 0; i < 4; i++) {
        Name += pinCode[i];
    }
    return Name;
}

/**
 * generate Fontlist
 */
export function genFontList() {
    const fontList: any = {
        google: {
            families: [
                // EN
                'Anton',
                'Black Han Sans',
                'Coming Soon',
                'Dokdo',
                'Gaegu',
                'Gothic A1',
                'Hi Melody',
                'Josefin Sans',
                'Lobster',
                'Lora',
                'Nanum Brush Script',
                'Nanum Gothic Coding',
                'Nanum Gothic',
                'Nanum Myeongjo',
                'Nanum Pen Script',
                'Open Sans',
                'Oswald',
                'Patrick Hand SC',
                'Roboto',

                // KO
                'Black And White Picture',
                'Cute Font',
                'Do Hyeon',
                'East Sea Dokdo',
                'Gugi',
                'Jua',
                'Kirang Haerang',
                'Poor Story',
                'Song Myung',
                'Stylish',
                'Sunflower',
                'Yeon Sung',
            ],
            urls: []
        },
        custom: {
            families: [
                'Hanna',
                'Jeju Gothic',
                'Jeju Hallasan',
                'Jeju Myeongjo',
                'KoPub Batang'
            ],
            urls: [
                'http://fonts.gstatic.com/ea/hanna/v3/download.zip',
                'http://fonts.gstatic.com/ea/jejugothic/v3/download.zip',
                'http://fonts.gstatic.com/ea/jejuhallasan/v3/download.zip',
                'http://fonts.gstatic.com/ea/jejumyeongjo/v3/download.zip',
                'http://fonts.gstatic.com/ea/kopubbatang/v3/download.zip'
                // 'https://fonts.googleapis.com/earlyaccess/hanna.css',
                // 'https://fonts.googleapis.com/earlyaccess/jejugothic.css',
                // 'https://fonts.googleapis.com/earlyaccess/jejuhallasan.css',
                // 'https://fonts.googleapis.com/earlyaccess/jejumyeongjo.css',
                // 'https://fonts.googleapis.com/earlyaccess/kopubbatang.css'
            ]
        }
    };

    fontList.google.families.map(async (font: any) => {
        const url = new URL('https://fonts.google.com/download');
        url.searchParams.append('family', font);
        fontList.google.urls.push(url.href);
    });

    return fontList;
}
