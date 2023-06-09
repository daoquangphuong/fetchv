const CHROME = navigator.userAgent.includes("Chrome") ? chrome : browser;
let DISABLE = !1;

function lang(t) {
    return CHROME.i18n.getMessage(t)
}

$("[lang-text]").each(function () {
    var t = $(this), e = $.trim($(this).text());
    t.text(lang(e))
}), $("[lang-title]").each(function () {
    var t = $(this), e = $.trim(t.attr("title"));
    t.attr("title", lang(e))
}), $("[lang-html]").each(function () {
    var t = $(this), e = $.trim($(this).text());
    t.html(lang(e))
}), (async () => {
    const t = $("#table").children("table"), o = t.find("tbody").eq(0).clone(!0),
        s = $('<video width="100%" autoplay controls src=""></video>'), n = await async function () {
            let t = await new Promise((e, t) => {
                try {
                    CHROME.storage.sync.get(["options"], function (t) {
                        e(t)
                    })
                } catch (t) {
                    e({})
                }
            });
            return 0 < Object.keys(t).length ? t.options : (t = await (t = await fetch("../options.json")).json(), CHROME.storage.sync.set({options: t}), t)
        }();
    let i = await CHROME.i18n.getUILanguage();
    i = (i = i.toLowerCase()).replace(/_/, "-"), i = n.lang.indexOf(i) < 0 ? "" : "/" + i, t.find("tbody").eq(0).remove();
    const d = await new Promise((e, t) => {
        CHROME.tabs.query({active: !0, currentWindow: !0}, function (t) {
            e(t[0])
        })
    });
    0 < d.url.split("/")[2].indexOf("youtube.com") && ($("#loading").addClass("d-none"), $("#noSupport").removeClass("d-none"), DISABLE = !0);
    let l = d.id.toString(), r = await new Promise((e, t) => {
        try {
            CHROME.storage.local.get([l], function (t) {
                e(t)
            })
        } catch (t) {
            e({})
        }
    });

    function c(t, e = !1) {
        let a = $("#layer");
        a.removeClass("d-none"), (e ? a.children(".alert").addClass("alert-success").removeClass("alert-danger") : a.children(".alert").addClass("alert-danger").removeClass("alert-success")).text(t), setTimeout(() => {
            a.addClass("d-none")
        }, 4e3)
    }

    function u(t, e, a = "url") {
        if (!t) return t;
        let n = t;
        return n = t.length >= e ? "url" === a ? t.substr(0, 80) + '<span class="text-danger fw-bold">...</span>' + t.substr(-120) : t.substr(0, 13) + "..." + t.substr(-17) : n
    }

    function m(a, n) {
        let o = "";
        for (var s in a) {
            var i = a[s], d = n.clone(!0);
            let t = '<span class="badge bg-info rounded-pill ms-2">' + (r[s] = i).format + "</span>", e = "static";
            "m3u8" === i.format ? (o = lang("hls"), t = '<span class="badge bg-info rounded-pill ms-2">HLS</span>', e = "hls") : o = i.size < 1024 ? i.size + "B" : i.size < 1048576 ? (i.size / 1024).toFixed(0) + "KB" : i.size < 1073741824 ? (i.size / 1048576).toFixed(2) + "M" : (i.size / 1073741824).toFixed(2) + "G", d.find("[data-name]").attr("title", name).text(u(i.filename, 40, "name")).append(t), d.find("[data-size]").text(o), d.find("[data-download]").attr("data-download", s).attr("data-type", e), d.find("[data-copy]").attr("data-copy", s), d.find("[data-play]").attr("data-play", s), d.find("[data-block]").attr("data-block", s), d.find("[data-url]").html(u(i.url, 200)), "m3u8" === i.format && d.find("[data-play]").remove(), d.appendTo($("#table").children("table"))
        }
    }

    function f(t, e = !1, a = !0) {
        e ? (p(t.next("tr.url").find(".video-close").eq(0), !1), t.find("img.chevron-down").addClass("transform"), t.next("tr.url").removeClass("d-none")) : (t.find("img.chevron-down").removeClass("transform"), a && t.next("tr.url").addClass("d-none"))
    }

    function p(t, e = !0) {
        t = t.parents("tr");
        (e ? t.addClass("d-none") : t).find(".alert").removeClass("d-none"), t.find(".video-wrap").addClass("d-none").find(".video-box").html("")
    }

    async function C(t, e) {
        t.taskid = 7463687, await CHROME.storage.local.set({queue: t});
        let a = "static" === e ? "videodownloader" : "hls" === e ? "m3u8downloader" : "bufferrecorder";
        CHROME.tabs.create({url: n.site + i + "/" + a, index: d.index + 1})
    }

    0 < Object.keys(r).length && (r = r[l]), $("#loading").addClass("d-none"), DISABLE || (0 < Object.keys(r).length ? (m(r, o), $("#tab").val(l), $("#table").removeClass("d-none"), $("#noData").addClass("d-none")) : ($("#table").addClass("d-none").find("tbody").html(""), $("#noData").removeClass("d-none"))), CHROME.runtime.connect({name: "POPUP"}), CHROME.runtime.onMessage.addListener(function (t, e, a) {
        var {cmd: t, parameter: n} = t;
        if ("POPUP_APPEND_ITEMS" === t) return n.tab && n.item && !DISABLE ? (d.id === n.tab && ($("#table").removeClass("d-none"), $("#noData").addClass("d-none"), m(n.item, o, d)), a()) : a(), !0
    }), $(document).on("click", "[data-copy]", function () {
        var t = $(this).attr("data-copy"), t = r[t].url, e = document.createElement("input");
        document.body.appendChild(e), e.value = t, e.focus(), e.select(), document.execCommand("copy") && document.execCommand("copy"), e.blur(), c(lang("copy_success"), !0), document.body.removeChild(e)
    }).on("click", ".name", function () {
        f($(this).parents("tr"), !$(this).find(".chevron-down").hasClass("transform"))
    }).on("click", "[data-play]", function () {
        var t = $(this), e = s, a = t.parents("tr"), n = a.next("tr.url"), t = t.attr("data-play");
        0 < a.find("img.transform").length && f(a, !1, !1), n.removeClass("d-none").find(".alert").addClass("d-none"), e.attr("src", r[t].url), n.find(".video-wrap").removeClass("d-none").find(".video-box").html(e.prop("outerHTML"))
    }).on("click", ".video-close", function () {
        p($(this))
    }).on("click", "[data-download]", async function () {
        if (d.id) {
            var t = $(this).attr("data-download");
            const a = $(this).attr("data-type");
            if (t) {
                const n = {tab: d.id, id: parseInt(t), type: a}, o = await new Promise((e, t) => {
                    try {
                        CHROME.runtime.sendMessage({
                            cmd: "CHECK_DOWNLOADING_REQUEST_EXIST",
                            parameter: {request: n.id}
                        }, function (t) {
                            e(t)
                        })
                    } catch (t) {
                        e({exist: !1})
                    }
                });
                o.exist ? CHROME.tabs.query({}, async function (e) {
                    for (let t = 0; t < e.length; t++) if (e[t].id === o.tab) return void await CHROME.tabs.update(o.tab, {active: !0});
                    C(n, a)
                }) : C(n, a)
            }
        }
    }).on("click", "[data-record]", async function () {
        $(".modal").addClass("d-block")
    }).on("click", "[modal-confirm]", function () {
        var t = {tab: d.id, title: d.title || "No title", type: "mse"};
        $(".modal").removeClass("d-block"), C(t, "mse")
    }).on("click", "[modal-close]", function () {
        $(".modal").removeClass("d-block")
    }).on("click", "a[data-block]", function () {
        var t, e = $(this).attr("data-block"), a = r[e].url.split("/")[2].toLowerCase();
        if (n.domain.indexOf(a) < 0) {
            if (n.domain.push(a), 30 < n.domain.length) return void c(lang("block_domain_count_limit"));
            CHROME.storage.sync.set({options: n})
        }
        for (t in r) (-1 < r[t].url.indexOf("http://" + a) || -1 < r[t].url.indexOf("https://" + a)) && (delete r[t], $(".table").find('[data-block="' + t + '"]').parents("tr").remove());
        0 < Object.keys(r).length ? ((e = {})[l] = r, CHROME.storage.local.set(e)) : CHROME.storage.local.remove([l]), c(lang("block_success"), !0)
    }).on("click", "[menu-options]", function () {
        CHROME.tabs.create({url: "options.html"})
    }).on("click", "[menu-home]", function () {
        CHROME.tabs.create({url: n.site + i})
    })
})();