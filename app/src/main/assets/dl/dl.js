
function addMessage(msg)
{
    var area = document.getElementById("msg")
    if (area) {
        area.innerHTML += htmlEscape(msg) + '<br/>';
    }
}

function clearMessage()
{
    var area = document.getElementById("msg")
    if (area) {
        area.innerHTML = '';
    }
}

function htmlEscape(str) {
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function full2half(str) {
    return str.replace(/[ａ-ｚ０-９（）]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
}

function render(json) {
    data = JSON.parse(json);
    if ('dl-name' in data) {
        document.getElementById("dl-name").innerHTML = data['dl-name'];
    }
    if ('dl-birth' in data) {
        document.getElementById("dl-birth").innerHTML = htmlEscape(data['dl-birth'])
            + '生';
    }
    if ('dl-addr' in data) {
        document.getElementById("dl-addr").innerHTML = data['dl-addr'];
    }
    if ('dl-issue' in data) {
        document.getElementById("dl-issue").innerHTML = htmlEscape(data['dl-issue']);
    }
    if ('dl-ref' in data) {
        document.getElementById("dl-ref").innerHTML = htmlEscape(data['dl-ref']);
    }
    if ('dl-expire' in data) {
        document.getElementById("dl-expire").innerHTML = htmlEscape(data['dl-expire'])
            + 'まで有効';
    }
    if ('dl-is-expired' in data) {
        if (data['dl-is-expired'] === 'true') {
            document.getElementById("dl-is-expired").innerHTML = "<div class=\"dl-is-expired\">有効期限切れ</div>";
        }
    }
    if ('dl-color-class' in data) {
        var color;
        var display;
        if (data['dl-color-class'] == '優良') {
            color = 'dl-color-gold';
            display = 'inline';
        } else if (data['dl-color-class'] == '新規') {
            color = 'dl-color-green';
            display = 'none';
        } else {
            color = 'dl-color-blue';
            display = 'none';
        }
        document.getElementById("dl-expire").classList.add(color);
        document.getElementById("dl-color-class").style.display = display;
    }

    var elm = document.getElementById('dl-condition1');
    if ('dl-condition1' in data) {
        elm.innerHTML = htmlEscape(full2half(data['dl-condition1']));
    } else {
        elm.innerHTML = '';
    }

    var elm = document.getElementById('dl-condition2');
    if ('dl-condition2' in data) {
        elm.innerHTML = htmlEscape(full2half(data['dl-condition2']));
    } else {
        elm.innerHTML = '';
    }

    var elm = document.getElementById('dl-condition3');
    if ('dl-condition3' in data) {
        elm.innerHTML = htmlEscape(full2half(data['dl-condition3']));
    } else {
        elm.innerHTML = '';
    }

    var elm = document.getElementById('dl-condition4');
    if ('dl-condition4' in data) {
        elm.innerHTML = htmlEscape(full2half(data['dl-condition4']));
    } else {
        elm.innerHTML = '';
    }

    if ('dl-number' in data) {
        document.getElementById("dl-number").innerHTML = '第　' + htmlEscape(data['dl-number']) + '　号';
    }
    if ('dl-sc' in data) {
        document.getElementById("dl-sc").innerHTML = htmlEscape(data['dl-sc']);
    }
    if ('dl-photo' in data) {
        document.getElementById("dl-photo").src = data['dl-photo'];
    }

    if ('dl-verified' in data) {
        document.getElementById("dl-verified").style.display = "inline-block";
        if (data['dl-verified']) {
            //document.getElementById("dl-verified").innerHTML = "✔";
            document.getElementById("dl-verified").src = "verify-success.png";
        } else {
            //document.getElementById("dl-verified").innerHTML = "✖";
            document.getElementById("dl-verified").src = "verify-failed.png";
        }
    }else{
        document.getElementById("dl-verified").style.display = "none";
    }

    var elm = document.getElementById("dl-name-etc");
    elm.innerHTML = '<tr><th style="width: 30%"></th><th style="width: 70%"></th></tr>\n';
    if ('dl-name' in data) {
        elm.innerHTML += '<tr><td>氏名</td><td>' +
            data['dl-name'] +
            '</td></tr>\n';
    }
    if ('dl-kana' in data) {
        elm.innerHTML += "<tr><td>呼び名(カナ)</td><td>" +
            htmlEscape(data['dl-kana']) +
            "</td></tr>\n";
    }
    if ('dl-addr' in data) {
        elm.innerHTML += "<tr><td>住所</td><td>" +
            data['dl-addr'] +
            "</td></tr>\n";
    }
    if ('dl-registered-domicile' in data) {
        elm.innerHTML += "<tr><td>本籍</td><td>" +
            htmlEscape(data['dl-registered-domicile']) +
            "</td></tr>\n";
    }

    var elm = document.getElementById("dl-categories");
    elm.innerHTML = '<tr><th style="width: 30%"></th><th style="width: 70%"></th></tr>\n';
    if ('dl-categories' in data) {
        var categories = data['dl-categories'];
        for(var i=0; i<categories.length; i++) {
            var cat = categories[i];
            var html = "<tr><td>" +
                htmlEscape(cat['name']) +
                "</td><td>" +
                (cat['licensed']?htmlEscape(cat['date']):'なし') +
                "</td></tr>\n";
            elm.innerHTML += html;

            switch(cat['tag']) {
            case 0x22:
                document.getElementById("dl-cat-22-date").innerHTML = cat['date'];
                break;
            case 0x23:
                document.getElementById("dl-cat-23-date").innerHTML = cat['date'];
                break;
            case 0x24:
                document.getElementById("dl-cat-24-date").innerHTML = cat['date'];
                break;
            case 0x25:
            case 0x26:
            case 0x27:
            case 0x28:
            case 0x29:
            case 0x2a:
            case 0x2b:
            case 0x2c:
            case 0x2d:
            case 0x2e:
            case 0x2f:
            case 0x30:
            case 0x31:
            case 0x32:
                if(cat['licensed']){
                    var id = 'dl-cat-' + cat['tag'].toString(16) + '-text';
                    var catElm = document.getElementById(id);
                    if (catElm) {
                        catElm.style.display = "block";
                    }
                }
                break;
            }
        }
    }

    var elm = document.getElementById("dl-signature");
    elm.innerHTML = '<tr><th style="width: 30%"></th><th style="width: 70%"></th></tr>\n';
    if ('dl-signature-subject' in data) {
        elm.innerHTML += '<tr><td>Subject</td><td>' +
            htmlEscape(data['dl-signature-subject']) +
            '</td></tr>\n';
    }
    if ('dl-signature-ski' in data) {
        elm.innerHTML += "<tr><td>Subject Key Identifier</td><td>" +
            htmlEscape(data['dl-signature-ski']) +
            "</td></tr>\n";
    }
    if ('dl-verified' in data) {
        if (data['dl-verified']) {
            elm.innerHTML += "<tr><td>署名検証</td><td>成功</td>";
        }else{
            elm.innerHTML += "<tr><td>署名検証</td><td>失敗</td>";
        }
    }

    var elm = document.getElementById('dl-remarks');
    if ('dl-remarks' in data) {
        var remarks = data['dl-remarks'];
        for(var i=0; i<remarks.length; i++) {
            var label = remarks[i]['label'];
            var text = remarks[i]['text'];
            var date = "";
            if (/^[０-９]{7}/.test(text)) {
                var dateNumber = text.substr(0, 7);
                text = text.slice(7);
                dateNumber = dateNumber.replace(/[０-９]/g, function(s) {
                    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
                });
                var era = dateNumber / 1000000 | 0;
                var year = dateNumber % 1000000 / 10000 | 0;
                var month = dateNumber % 10000 / 100 | 0;
                var day = dateNumber % 100;
                var eraName;
                switch (era) {
                    case 1:
                        eraName = '明治';
                        break;
                    case 2:
                        eraName = '大正';
                        break;
                    case 3:
                        eraName = '昭和';
                        break;
                    case 4:
                        eraName = '平成';
                        break;
                    default:
                        eraName = '○○';
                        break;
                }
                date = eraName + year + "年" + month + "月" + day + "日";
            }
            var pscName = text.substr(-5, 5); //「psc」は公安委員会(Public Safety Commission)の略
            text = text.slice(0, -5);

            if (elm.innerHTML == "&nbsp;") {
                elm.innerHTML = htmlEscape(date) + "<br>\n" + htmlEscape(label)+ "："
                    + htmlEscape(text) + "<div class=\"dl-remarks-seal\">" + htmlEscape(pscName) + "</div>";
            } else {
                elm.innerHTML += "<br>\n";
                elm.innerHTML += htmlEscape(date) + "&nbsp;" + htmlEscape(label) + "："
                    + htmlEscape(text) + "<div class=\"dl-remarks-seal\">" + htmlEscape(pscName) + "</div>";;
            }
        }
    }
}

