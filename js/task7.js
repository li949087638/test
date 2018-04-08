"use strict";

//版本选择页面翻页功能
$(function() {
    var left = $(".triangle-l"),
        right = $(".triangle-r"),
        page = $(".version"),
        circle = $(".circle-1"),
        a = 0;
    left.click(function() {
        if (a > 0) {
            page.eq(a).hide();
            page.eq(a - 1).show();
            circle.eq(a).removeClass("bg-orange");
            circle.eq(a - 1).addClass("bg-orange");
            a -= 1;
        } else {
            page.eq(a).hide();
            page.last().show();
            circle.eq(a).removeClass("bg-orange");
            circle.last().addClass("bg-orange");
            a = circle.length - 1;
        }
    });
    right.click(function() {
        if (a < circle.length - 1) {
            page.eq(a).hide();
            page.eq(a + 1).show();
            circle.eq(a).removeClass("bg-orange");
            circle.eq(a + 1).addClass("bg-orange");
            a += 1;
        } else {
            page.eq(a).hide();
            page.first().show();
            circle.eq(a).removeClass("bg-orange");
            circle.first().addClass("bg-orange");
            a = 0;
        }
    });
});

// 参数设置功能
$(function() {
    var back = $(".back"),
        title = $("#head-title"),
        range = $(".range"),
        gamer = $(".gamer"),
        yl = $("#youling"),
        pm = $("#pingmin"),
        ylw = $("[name=yl-word]"),
        pmw = $("[name=pm-word]"),
        btn_fapai = $("[name=fapai]"),
        btn_next = $("[name=deal-next]"),
        setting = $("#setting"),
        deal = $("#deal"),
        reverse = $(".deal-reverse"),
        front = $(".deal-front"),
        juese = $("#juese"),
        cihui = $("#cihui"),
        deal_num = $(".deal-num"),
        deal_list = $(".deal-list"),
        list_item = $(".list-item"),
        deal_panel = $(".deal-panel"),
        tb = $("#taiben"),
        tb_day = $(".tb-day"),
        day_title = $(".day-title"),
        day_item = $(".day-item"),
        poll = $("#poll"),
        poll_ok = $("[name=poll-ok]"),
        tb_log = $("[name=tb-log]"),
        end = $("#end"),
        end_log = $(".end-log"),
        log_text = $(".log-text"),
        count = 0,
        data = [],
        poll_obj = null,
        yl_end = 0,
        pm_end = 0,
        candidate = "";

    // 根据玩家总数，分配幽灵与平民的数量
    function setNum() {
        if (gamer.val() > 18 || gamer.val() < 4) {
            yl.text("--");
            pm.text("--");
        } else if (gamer.val() >= 4 && gamer.val() <= 5) {
            yl.text("1");
            pm.text(gamer.val() - 1);
        } else if (gamer.val() >= 6 && gamer.val() <= 8) {
            yl.text("2");
            pm.text(gamer.val() - 2);
        } else if (gamer.val() >= 9 && gamer.val() <= 11) {
            yl.text("3");
            pm.text(gamer.val() - 3);
        } else if (gamer.val() >= 12 && gamer.val() <= 15) {
            yl.text("4");
            pm.text(gamer.val() - 4);
        } else {
            yl.text("5");
            pm.text(gamer.val() - 5);
        }
    }

    // 洗牌，根据玩家人数，创建对应数组，并打乱顺序
    function shuffle(n) {
        var a = [],
            temp;
        for (var i = 0; i < n; i++) {
            a[i] = i + 1;
        }
        for (var i = 0, j; i < a.length; i++) {
            j = Math.floor(Math.random() * (a.length - i) + i);
            temp = a[i];
            a[i] = a[j];
            a[j] = temp;
        }
        return a;
    }

    // 分配身份，传入一个乱序数组，逐个赋予身份
    function assign(a) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] > yl.text()) {
                a[i] = "平民";
            } else {
                a[i] = "幽灵";
            }
        }
        return a;
    }

    back.click(function() {
        if (confirm("是否结束本次游戏？")) {
            window.open("task7.htm", "_self");
        }
    });
    range.change(function() {
        gamer.val(range.val());
        setNum();
    });
    gamer.change(function() {
        range.val(gamer.val());
        setNum();
    });
    btn_fapai.click(function() {
        if (gamer.val() > 18 || gamer.val() < 4) {
            alert("抱歉，玩家数量限4~18人！");
        } else if (ylw.val() === "") {
            alert("请输入幽灵词汇！");
        } else if (pmw.val() === "") {
            alert("请输入平民词汇！");
        } else if (pmw.val() === ylw.val()) {
            alert("幽灵词汇与平民词汇不能相同！");
        } else {
            data = assign(shuffle(gamer.val()));
            setting.hide();
            deal.show();
            title.text("查看身份");
            // 创建玩家身份列表
            for (var i = 0; i < data.length - 1; i++) {
                list_item.after(list_item.clone());
            }
            for (var i = 0; i < data.length; i++) {
                deal_list.find(".item-name").eq(i).text(data[i]);
                deal_list.find(".item-num").eq(i).text(i + 1 + "号");
            }
            // 创建投票页列表
            poll.append(deal_list.clone());
            poll.find(".list-item").click(function() {
                poll.find(".list-item").css("box-shadow", "");
                $(this).css("box-shadow", "0 0 22px 8px #ddd");
                candidate = $(this).find(".item-name").text();
                poll_obj = $(this);
            });
        }
    });
    btn_next.click(function() {
        if (count / 2 + 1 == gamer.val()) {
            reverse.hide();
            front.show();
            juese.text(data[count / 2]);
            if (data[count / 2] === "平民") {
                cihui.text(pmw.val());
            } else {
                cihui.text(ylw.val());
            }
            btn_next.text("法官查看");
            count++;
        } else if (count / 2 + 0.5 == gamer.val()) {
            deal_panel.hide();
            deal_list.show();
            title.text("法官日志");
            btn_next.text("开始游戏");
            count++;
        } else if (count / 2 == gamer.val()) {
            deal.hide();
            btn_next.off("click").text("返回台本").click(function() {
                deal.hide();
                title.text("法官台本");
                tb.show();
            });
            title.text("法官台本");
            tb.show();
            tb.append(tb_day.clone(true));
        } else if (count % 2 === 0) {
            reverse.hide();
            front.show();
            juese.text(data[count / 2]);
            if (data[count / 2] === "平民") {
                cihui.text(pmw.val());
            } else {
                cihui.text(ylw.val());
            }
            btn_next.text("隐藏并传递给" + (count / 2 + 2) + "号");
            count++;
        } else {
            front.hide();
            reverse.show();
            deal_num.text(count / 2 + 1.5);
            btn_next.text("查看" + (count / 2 + 1.5) + "号身份");
            count++;
        }
    });
    day_title.click(function() {
        $(this).next(".day-content").toggle();
    })
    day_item.eq(0).one("click", function() {
        alert("请玩家们依次发言讨论");
        $(this).css("background-color", "#999");
        $(this).find("b").css("border-right-color", "#999");
        $(this).click(function() {
            alert("请进行游戏下一项活动");
        });
        $(this).next().off("click");
        $(this).next().one("click", function() {
            tb.hide();
            title.text("投票");
            poll.show();
            $(this).css("background-color", "#999");
            $(this).find("b").css("border-right-color", "#999");
            $(this).parent().hide();
            $(this).click(function() {
                alert("请进行游戏下一项活动");
            });
        });
    });
    day_item.eq(1).click(function() {
        alert("请按顺序操作");
    });
    poll_ok.click(function() {
        if (candidate === "") {
            alert("请选择要投出的玩家");
            return;
        }
        poll.find(".list-item").css("box-shadow", "");
        poll_obj.css("background-color", "#999").off("click");
        deal.find(".list-item").eq(poll_obj.find(".item-num").text()[0]-1).css("background-color", "#999");
        if (candidate === "幽灵") {
            yl_end++;
        } else if (candidate === "平民") {
            pm_end++;
        }
        if (yl_end == yl.text()) {
            poll.hide();
            title.text("游戏结果");
            end.find(".win-text").text("平民胜利");
            end.find("#yl-num").text("0");
            end.find("#pm-num").text(pm.text() - pm_end);
            end.find("#yl-word").text(ylw.val());
            end.find("#pm-word").text(pmw.val());
            for (var i = 0; i < (yl_end + pm_end); i++) {
                end.append(end_log.clone());
            }
            for (var i = 0; i < (yl_end + pm_end - 1); i++) {
                $("#end").children(".end-log").eq(i).find(".log-text").text($(".day-content span").eq(i).text());
            }
            $(".log-text:last").text(poll_obj.find(".item-num").text() + "玩家被投票投死，真实身份是" + poll_obj.find(".item-name").text() + "。");
            end.show();
        } else if (pm.text()-pm_end == yl.text()) {
            poll.hide();
            title.text("游戏结果");
            end.find(".win-text").text("幽灵胜利");
            end.find("#yl-num").text(yl.text() - yl_end);
            end.find("#pm-num").text(yl.text());
            end.find("#yl-word").text(ylw.val());
            end.find("#pm-word").text(pmw.val());
            for (var i = 0; i < (yl_end + pm_end); i++) {
                end.append(end_log.clone());
            }
            for (var i = 0; i < (yl_end + pm_end - 1); i++) {
                $("#end").children(".end-log").eq(i).find(".log-text").text($(".day-content span").eq(i).text());
            }
            $(".log-text:last").text(poll_obj.find(".item-num").text() + "玩家被投票投死，真实身份是" + poll_obj.find(".item-name").text() + "。");
            end.show();
        } else {
            poll.hide();
            $(".day-item:last").after("<span>" + poll_obj.find(".item-num").text() + "玩家被投票投死，真实身份是" + poll_obj.find(".item-name").text() + "。</span>");
            title.text("法官台本");
            tb.append(tb_day.clone(true));
            $(".day-title span:last").text("第" + (yl_end + pm_end + 1) + "天");
            tb.show();
        }
        candidate = "";
    })
    tb_log.click(function() {
        tb.hide();
        title.text("法官日志");
        deal.show();

    })
});