"use strict";

var btn = document.getElementsByTagName("button"),
    div = document.getElementsByClassName("cell"),
    color = ["#20b2aa", "#ffff00", "#dc143c", "#483d8b", "#00bfff", "#ff69b4", "#000080", "#008000", "#2f4f4f"],
    t;

function start() {
    var r1 = Math.floor(Math.random() * 9),
        r4 = Math.floor(Math.random() * 9),
        r2, r3, r5, r6;
    for (var i = 0; i < 9; i++) {
        div[i].style.backgroundColor = "#ffa500";
    }
    while (true) {
        r2 = Math.floor(Math.random() * 9);
        if (r2 != r1) break;
    }
    while (true) {
        r3 = Math.floor(Math.random() * 9);
        if (r3 != r1 && r3 != r2) break;
    }
    while (true) {
        r5 = Math.floor(Math.random() * 9);
        if (r5 != r4) break;
    }
    while (true) {
        r6 = Math.floor(Math.random() * 9);
        if (r6 != r4 && r6 != r5) break;
    }
    div[r1].style.backgroundColor = color[r4];
    div[r2].style.backgroundColor = color[r5];
    div[r3].style.backgroundColor = color[r6];
    t = setTimeout(start, 1000);
};

function stop() {
    clearTimeout(t);
    for (var i = 0; i < 9; i++) {
        div[i].style.backgroundColor = "#ffa500";
    }
};

btn[0].addEventListener("click",start);
btn[1].addEventListener("click",stop);

/*简易版，有几率随机数相同，导致只有2个div变色，甚至1个
btn[0].onclick = function() {
    for (var i = 0; i < 9; i++) {
        div[i].style.backgroundColor = "#ffa500";
    }
    for (var i = 0; i < 3; i++) {
        var r1 = Math.floor(Math.random() * 9),
            r2 = Math.floor(Math.random() * 9);
        div[r1].style.backgroundColor = color[r2];
    }
    t = setTimeout(arguments.callee, 1000);
};*/
