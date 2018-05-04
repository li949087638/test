"use strict";

$(function() {
    var form = $("form"),
        wj = $("[id=hide-waijing]"),
        nj = $("[id=hide-neijing]"),
        wj_xyz = $("[type=text][id^=wai]"),
        nj_xyz = $("[type=text][id^=nei]");

    wj.click(function() {
        wj_xyz.prop("disabled", false);
        nj_xyz.prop("disabled", true);
    });
    nj.click(function() {
        wj_xyz.prop("disabled", true);
        nj_xyz.prop("disabled", false);
    });
    form.submit(function(e) {
        e.preventDefault();
        alert("表单信息：" + form.serialize());
    });
});