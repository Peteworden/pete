var tanka = [152, 182, 256];
var kosu = [0, 0, 0];

function inputCheck() {
    var k = 0;
    for (var i=1; i<4; i++) {
        kosu[i-1] = get_kosu(i);
        console.log(kosu[i-1]);
        if (!isNaN(kosu[i-1])) {
            k++;
        }
    }
    if (k == 3) {
        document.getElementById("kosu_sum").innerHTML = kosu[0] + kosu[1] + kosu[2] + " 個";
        document.getElementById("ryokin_sum").innerHTML = (kosu[0] * tanka[0] + kosu[1] * tanka[1] + kosu[2] * tanka[2]).toLocaleString() + " 円";
    } else {
        document.getElementById("kosu_sum").innerHTML = "";
        document.getElementById("ryokin_sum").innerHTML = "";
    }
}

function get_kosu(n) {
    var kosu = document.getElementById("kosu" + n).value;
    console.log(kosu);
    if (kosu == '') {
        document.getElementById("ryokin" + n).innerHTML = '';
        return 0;
    } else if (!isNaN(kosu) && Number.isInteger(parseInt(kosu)))  {
        if (kosu > 0) {
            document.getElementById("ryokin" + n).innerHTML = (kosu * tanka[n-1]).toLocaleString() + ' 円';
            return parseInt(kosu);
        } else if (kosu == 0) {
            document.getElementById("ryokin" + n).innerHTML = '';
            return 0;
        }
        return NaN;
    }
    return NaN;
}