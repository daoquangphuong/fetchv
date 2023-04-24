class DownloadUI {
    constructor() {
        this.title = $("title").text(), this.options = {}
    }

    mark() {
        $("body").attr("data-mark", "imleiiaoeclikefimmcdkjabjbpcdgaj"), $("#auto-save-wrap").removeClass("visually-hidden"), this.options.autosave && $("#auto-save").find("input:checkbox").attr("checked", !0)
    }

    ready(e) {
        $("#waiting").addClass("d-none"), $("#recording").removeClass("d-none"), $("#stop,#save-current,#x1,#x2,#x3,#x4,#x5,#x10,#xMax").removeClass("disabled"), $("#name").text(e);
    }

    splitResolution() {
        $("#desc-split-resolution").removeClass("d-none")
    }

    splitChunks() {
        $("#desc-split-chunks").removeClass("d-none")
    }

    error(e) {
        $("#orc,#recording").addClass("d-none"), $("#stop,#save-current,#x1,#x2,#x3,#x4,#x5,#x10,#xMax").addClass("disabled"), $("#error,#desc-error").removeClass("d-none"), $(".progress-bar").removeClass("animated").addClass("bg-danger").css({width: "100%"}), $("#desc-error").text(e)
    }

    completed() {
        $("#orc,#recording,#stop,#save-current,#x1,#x2,#x3,#x4,#x5,#x10,#xMax").addClass("d-none"), $("#completed,#desc-success").removeClass("d-none"), $("#stop").removeClass("loading"), $(".progress-bar").removeClass("animated").addClass("bg-success").css({width: "100%"})
    }

    setPreview(e) {
        var t = $("<video></video>"),
            e = (t.attr("controls", !0), t.attr("src", e), t.addClass("w-100").addClass("h-auto"), $("#preview"));
        e.html(""), e.removeClass("bg-dark").append(t)
    }

    createSaveBtn(e, t, n, o) {
        0 < n.indexOf("-") && (n = (n = n.split("-"))[0].trim()), t = this.durationConvert(t);
        var o = o + "-" + n + ".mp4", s = $("a.save:last"), n = s.find(".btn-text").text() + " - " + n + " / " + t;
        const a = s.clone(!0);
        a.find(".btn-text").text(n), a.removeClass("d-none").attr("href", e).attr("download", o), a.insertBefore(s), this.options.autosave && setTimeout(function () {
            a[0].click()
        }, 3e3)
    }

    setInfo(e, t, n = !1) {
        e && (e = this.durationConvert(e), $("#duration").text(e), $("title").text(e + "-" + this.title)), $("#size").text(this.sizeConvert(t)), n && $("#resolution").text(n)
    }

    saveCurrent(e, t) {
        const n = $("<a></a>");
        n.attr("href", e), n.attr("download", t + ".mp4"), n.appendTo("body"), n[0].click(), $("#flushing").addClass("d-none"), setTimeout(() => {
            URL.revokeObjectURL(e), n.remove()
        }, 2e4), $("#save-current").removeAttr("disabled").removeClass("disabled").removeClass("loading")
    }

    durationConvert(o) {
        if (o = Number(o)) {
            if ((o = Math.round(o)) < 60) return o < 10 ? "00:00:0" + o.toString() : "00:00:" + o.toString();
            if (o < 3600) {
                let e = o % 60, t = (e = e < 10 ? "0" + e.toString() : e.toString(), Math.trunc(o / 60));
                return "00:" + (t = t < 10 ? "0" + t.toString() : t.toString()) + ":" + e
            }
            if (o < 86400) {
                let e = o % 60, t = (e = (e = Math.round(e)) < 10 ? "0" + e.toString() : e.toString(), o % 3600),
                    n = (t = (t = Math.trunc(t / 60)) < 10 ? "0" + t.toString() : t.toString(), Math.trunc(second / 3600));
                return (n = n < 10 ? "0" + n.toString() : n.toString()) + ":" + t + ":" + e
            }
            return "--"
        }
    }

    sizeConvert(e) {
        return e < 1024 ? e += "Byte" : e = e < 1048576 ? (e / 1024).toFixed(0) + "KB" : e < 1073741824 ? (e / 1048576).toFixed(2) + "M" : (e / 1073741824).toFixed(2) + "G", e
    }
}

(async () => {
    var $stop =document.getElementById('stop');
    if(!document.getElementById('x1')){
        var $div = document.createElement('div');
        $div.innerHTML = "<button id=\"x1\" class=\"btn btn-primary me-3 mb-3 disabled\">x1</button>";
        $stop.parentNode.insertBefore($div.querySelector('button'), $stop);
    }
    if(!document.getElementById('x2')){
        var $div = document.createElement('div');
        $div.innerHTML = "<button id=\"x2\" class=\"btn btn-primary me-3 mb-3 disabled\">x2</button>";
        $stop.parentNode.insertBefore($div.querySelector('button'), $stop);
    }
    if(!document.getElementById('x3')){
        var $div = document.createElement('div');
        $div.innerHTML = "<button id=\"x3\" class=\"btn btn-primary me-3 mb-3 disabled\">x3</button>";
        $stop.parentNode.insertBefore($div.querySelector('button'), $stop);
    }
    if(!document.getElementById('x4')){
        var $div = document.createElement('div');
        $div.innerHTML = "<button id=\"x4\" class=\"btn btn-primary me-3 mb-3 disabled\">x3</button>";
        $stop.parentNode.insertBefore($div.querySelector('button'), $stop);
    }
    if(!document.getElementById('x5')){
        var $div = document.createElement('div');
        $div.innerHTML = "<button id=\"x5\" class=\"btn btn-primary me-3 mb-3 disabled\">x5</button>";
        $stop.parentNode.insertBefore($div.querySelector('button'), $stop);
    }
    if(!document.getElementById('x10')){
        var $div = document.createElement('div');
        $div.innerHTML = "<button id=\"x10\" class=\"btn btn-primary me-3 mb-3 disabled\">x10</button>";
        $stop.parentNode.insertBefore($div.querySelector('button'), $stop);
    }
    const o = navigator.userAgent.includes("Chrome") ? chrome : browser;
    let n = !1, a = !0;
    var e = $("#list");
    const r = await ((i = await new Promise((t, e) => {
        try {
            o.storage.local.get(["queue"], function (e) {
                if (0 < Object.keys(e).length) return "mse" !== (e = e.queue).type ? void t(null) : void t(e);
                t(null)
            })
        } catch (e) {
            t(null)
        }
    })) ? (o.storage.local.remove(["queue"]), i) : null);
    if (r) {
        var i = new DownloadUI;
        let s = new Manifest(r, i);
        if (await new Promise((t, e) => {
            try {
                var n;
                !function (e) {
                    try {
                        return e !== function () {
                            let t = "", n = location.host;
                            for (let e = 0; e < n.length; e++) "" === t ? t = n.charCodeAt(e).toString(16) : t += n.charCodeAt(e).toString(16);
                            return parseInt(t.slice(4, 11))
                        }() ? 1 : void 0
                    } catch (e) {
                        return 1
                    }
                }(r.taskid) || (n = Math.floor(5 * Math.random()) + 5, n *= 1e3, setTimeout(function () {
                    s = {}
                }, n)), o.runtime.sendMessage({cmd: "GET_TAB_ID", parameter: {}}, function (e) {
                    t(e)
                })
            } catch (e) {
                t(null)
            }
        })) {
            const d = await async function () {
                let e = await new Promise((t, e) => {
                    try {
                        o.storage.sync.get(["options"], function (e) {
                            t(e)
                        })
                    } catch (e) {
                        t({})
                    }
                });
                return 0 < Object.keys(e).length ? e.options : (e = await (e = await fetch("../options.json")).json(), o.storage.sync.set({options: e}), e)
            }();
            let t = null;
            !function e() {
                if (a) a = !1; else if (!n) return;
                t = o.runtime.connect({name: "TAB"});
                t.onDisconnect.addListener(e);
                t.onMessage.addListener(function (e) {
                    "FORCE_CONNECT" === e && (n = !0)
                })
            }(), s.load(), i.options = d, i.mark(), o.runtime.onMessage.addListener(function (e, t, n) {
                var {cmd: e, parameter: o} = e;
                return "RECORDER_SUCCESS" === e ? (s.stop(), n(), !0) : "MEDIA_SOURCE_ON_DATA" === e ? (s.push(o), n(), !0) : void 0
            }), o.runtime.sendMessage({
                cmd: "RELOAD_VIDEO_PAGE",
                parameter: {tab: r.tab}
            }), $(document).on("click", "#stop", function () {
                $("#stop").addClass("loading"), s.stop()
            }).on("click", "#save-current", async function () {
                $(this).attr("disabled", !0).addClass("disabled").addClass("loading"), $("#flushing").removeClass("d-none"), s.saveCurrent()
            }).on("click", "#x1", async function () {
                o.runtime.sendMessage({
                    cmd: "X_VIDEO_PAGE",
                    parameter: {tab: r.tab, speed: 1.0}
                })
            }).on("click", "#x2", async function () {
                o.runtime.sendMessage({
                    cmd: "X_VIDEO_PAGE",
                    parameter: {tab: r.tab, speed: 2.0}
                })
            }).on("click", "#x3", async function () {
                o.runtime.sendMessage({
                    cmd: "X_VIDEO_PAGE",
                    parameter: {tab: r.tab, speed: 3.0}
                })
            }).on("click", "#x4", async function () {
                o.runtime.sendMessage({
                    cmd: "X_VIDEO_PAGE",
                    parameter: {tab: r.tab, speed: 4.0}
                })
            }).on("click", "#x5", async function () {
                o.runtime.sendMessage({
                    cmd: "X_VIDEO_PAGE",
                    parameter: {tab: r.tab, speed: 5.0}
                })
            }).on("click", "#x10", async function () {
                o.runtime.sendMessage({
                    cmd: "X_VIDEO_PAGE",
                    parameter: {tab: r.tab, speed: 10.0}
                })
            }).on("click", ".save", function () {
                const o = $(this);
                o.addClass("loading"), setTimeout(function () {
                    o.addClass("timeout").removeClass("loading");
                    let e = 30;
                    const t = o.find(".btn-timeout").find("span"), n = setInterval(function () {
                        t.text(e), --e < 0 && (clearInterval(n), o.addClass("disabled").removeClass("timeout"), URL.revokeObjectURL(o.attr("href")))
                    }, 1e3)
                }, 5e3)
            }).on("click", "#auto-save", function () {
                $(this).find("input:checkbox").eq(0).is(":checked") ? d.autosave = !0 : d.autosave = !1, o.storage.sync.set({options: d})
            }), $(window).on("beforeunload", function () {
                $(".save").each(function () {
                    var e = $(this).attr("href");
                    e && window.URL.revokeObjectURL(e)
                })
            });
            i = $("#preview").find("video");
            0 < i.length && window.URL.revokeObjectURL(i.eq(0).attr("src"))
        } else e.remove(), $("#connectFail").removeClass("d-none")
    } else e.remove(), $("#nodata").removeClass("d-none")
})();