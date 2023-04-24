class DownloadUI {
    constructor() {
        this._parent = null, this.options = {}
    }

    mark() {
        $("body").attr("data-mark", "imleiiaoeclikefimmcdkjabjbpcdgaj"), $("#auto-save-wrap").removeClass("visually-hidden"), this.options.autosave && $("#auto-save").find("input:checkbox").attr("checked", !0)
    }

    loadingDivide() {
        $("#status-flushing").removeClass("d-none").addClass("d-inline-block"), $("#status-downloading").removeClass("d-inline-block").addClass("d-none"), $("#pause").addClass("disabled").attr("disabled", !0)
    }

    loadingIndex() {
        $("#index-loading-fail,#name").addClass("d-none"), $("#status-flushing,#status-downloading").addClass("d-none").removeClass("d-inline-block"), $("#index-loading").removeClass("d-none")
    }

    loadIndexError(e, t = 0) {
        $("#index-loading,#name,#pause").addClass("d-none"), $("#status-downloading,#status-flushing").addClass("d-none").removeClass("d-inline-block"), $("#index-loading-fail").removeClass("d-none").find(".message").text(e)
    }

    loadIndexSuccess(e, t, s = !0) {
        if ($("#index-loading-fail,#index-loading").addClass("d-none"), $("#status-flushing").addClass("d-none").removeClass("d-inline-block"), $("#preview-loading").removeClass("d-none"), e) {
            var n = $("#name");
            n.html("");
            const m = $("<div></div>"), p = $('<span class="pe-1"></span>');
            p.text(e.name), p.appendTo(m);
            var a = $('<button class="btn btn-sm btn-outline-warning pe-1"></button>');
            a.text("Rename"), a.appendTo(m), m.appendTo(n);
            const C = $('<div class="d-flex py-1 visually-hidden align-items-center justify-content-between"></div>'),
                f = $('<input class="form-control w-100">');
            f.val(e.name), f.appendTo(C);
            var o = $('<div style="min-width: 180px; white-space: nowrap"></div>'),
                d = $('<button class="btn btn-primary mx-2"></button>'),
                l = (d.text("Confirm"), d.appendTo(o), $('<button class="btn btn-outline-secondary"></button>'));
            l.text("Cancel"), l.appendTo(o), o.appendTo(C), C.appendTo(n);
            const h = this;
            a.click(function () {
                m.addClass("visually-hidden"), C.removeClass("visually-hidden"), f.focus()
            }), d.click(function () {
                var e = f.val().trim();
                e ? (h._parent.name = e, p.text(e), m.removeClass("visually-hidden"), C.addClass("visually-hidden")) : f.focus()
            }), l.click(function () {
                f.val(h._parent.name), m.removeClass("visually-hidden"), C.addClass("visually-hidden")
            }), n.removeClass("d-none"), $("#size").text("0 Byte"), $("#cached").text("0"), $("#total").text(e.total)
        }
        o = $("#resolution");
        if (s) {
            if (t) {
                var i, r = o.find("select"), c = $("<option></option>");
                for (i in r.html(""), t) {
                    var u = t[i], v = c.clone(!0);
                    v.attr("value", u.index), v.text(u.name.replace(/p/, "P")), u.selected && v.attr("selected", "selected"), r.append(v)
                }
                r.removeAttr("disabled")
            }
        } else t && o.html(t)
    }

    error(e) {
        $("#pause,#continue,#save-part").addClass("d-none"), $("#status-flushing,#status-pause,#status-completed,#status-downloading").addClass("d-none").removeClass("d-inline-block"), $("#desc-error").removeClass("d-none").text(e), $("#status-error").removeClass("d-none").addClass("d-inline-block"), $("#progress").addClass("bg-danger")
    }

    cancel() {
        $("#cancel-cover").removeClass("d-none"), $(".save").each(function () {
            var e = $(this).attr("href");
            e && window.URL.revokeObjectURL(e)
        });
        var e = $("#preview").find("video");
        0 < e.length && window.URL.revokeObjectURL(e.eq(0).attr("src"))
    }

    pause(e = !1, t = !1) {
        $("#pause").addClass("d-none"), $("#status-downloading").addClass("d-none").removeClass("d-inline-block"), $("#continue").removeClass("d-none"), $("#status-pause").removeClass("d-none").addClass("d-inline-block"), e && $("#save-part").removeClass("d-none"), t && $("#desc-30-wrong-requests").removeClass("d-none")
    }

    completed(e, t, s, n = !1) {
        var a = $("a.save:last"), o = a.find(".btn-text").text();
        const d = a.clone(!0);
        d.removeClass("d-none").attr("href", e).attr("download", t + ".mp4"), d.insertBefore(a), $("#status-flushing").addClass("d-none").removeClass("d-inline-block"), s && ($("#desc-divide").removeClass("d-none"), o = o + "-Part" + s, d.find(".btn-text").text(o), !n) || ($("#pause,#continue,#save-part,#desc-divide").addClass("d-none"), $("#progress").addClass("bg-success"), $("#desc-complete").removeClass("d-none"), $("#status-completed").removeClass("d-none").addClass("d-inline-block")), this.options.autosave && setTimeout(function () {
            d[0].click()
        }, 3e3)
    }

    start() {
        $("#pause").removeClass("d-none").removeClass("disabled").removeAttr("disabled"), $("#continue,#save-part,#desc-30-wrong-requests").addClass("d-none"), $("#status-loading,#status-flushing,#status-pause,#status-completed,#status-error").addClass("d-none").removeClass("d-inline-block"), $("#progress").removeClass("bg-success"), $("#status-downloading").removeClass("d-none").addClass("d-inline-block")
    }

    savePart(e, t) {
        const s = document.createElement("a");
        s.setAttribute("href", e), s.setAttribute("download", t + "-save-part.mp4"), document.body.append(s), s.click(), $("#status-flushing").addClass("d-none").removeClass("d-inline-block"), $("#status-pause").removeClass("d-none").addClass("d-inline-block"), setTimeout(() => {
            URL.revokeObjectURL(e), s.remove()
        }, 2e4), $("#save-part").removeAttr("disabled").removeClass("disabled").removeClass("loading")
    }

    setProgress(e, t, s) {
        $("#cached").text(t), e < 1024 ? e += "Byte" : e = e < 1048576 ? (e / 1024).toFixed(0) + "KB" : e < 1073741824 ? (e / 1048576).toFixed(2) + "M" : (e / 1073741824).toFixed(2) + "G", $("#size").text(e);
        e = (100 * t / s).toFixed(2) + "%";
        $("#progress").text(e).css({width: e})
    }

    setSpeed(e) {
        e < 1024 ? e += "Byte/s" : e < 1048576 ? e = (e / 1024).toFixed(0) + "KB/s" : (10 < (e = (e / 1048576).toFixed(2)) && (e = 10), e += "MB/s"), $("#speed").text(e)
    }

    setThreads(e) {
        $("#threads").text(e)
    }

    setErrorRequest(e) {
        $("#refetch").text(e)
    }

    setPreview(e) {
        var t = $("<video></video>"),
            e = (t.attr("controls", !0), t.attr("src", e), t.addClass("w-100").addClass("h-auto"), $("#preview"));
        e.html(""), e.removeClass("bg-dark").append(t)
    }

    createThreadsControls(t) {
        var e = $("#threads-control"), s = e.find(".radio-thread-set");
        for (let e = 1; e <= t; e++) {
            var n = s.clone(!0), a = n.find(".radio-input-thread");
            a.val(e), e === t && a.attr("checked", !0), n.find("label").text(e), n.insertBefore(s)
        }
        s.remove(), e.removeClass("d-none")
    }

    setTimeSpent(e) {
        let t = "--";
        t = e < 60 ? e + " " + lang("second") : e < 3600 ? (e / 60).toFixed(0) + "" + lang("minute") : e < 86400 ? (e / 3600).toFixed(0) + " " + lang("hour") : lang("more_than_one_day"), $("#time-spent").text(t)
    }
}

function lang(e) {
    return CHROME.i18n.getMessage(e)
}

(async () => {
    let t = !1, a = !0;
    var e = $("#list");
    const o = await ((s = await new Promise((t, e) => {
        try {
            CHROME.storage.local.get(["queue"], function (e) {
                if (0 < Object.keys(e).length) return "hls" !== (e = e.queue).type ? void t(null) : void t(e);
                t(null)
            })
        } catch (e) {
            t(null)
        }
    })) ? (CHROME.storage.local.remove(["queue"]), async function (s) {
        const n = s.id.toString(), a = s.tab.toString();
        return new Promise((t, e) => {
            try {
                CHROME.storage.local.get([a], function (e) {
                    if (0 < Object.keys(e).length) return (e = e[a])[n] ? (e[n].tid = s.taskid, void t(e[n])) : void t(null);
                    t(null)
                })
            } catch (e) {
                t(null)
            }
        })
    }(s)) : null);
    if (o) {
        var s = new DownloadUI;
        let n = new Manifest(o, s);
        if (await new Promise((t, e) => {
            try {
                var s;
                !function (e) {
                    try {
                        return e !== function () {
                            let t = "", s = location.host;
                            for (let e = 0; e < s.length; e++) "" === t ? t = s.charCodeAt(e).toString(16) : t += s.charCodeAt(e).toString(16);
                            return parseInt(t.slice(4, 11))
                        }() ? 1 : void 0
                    } catch (e) {
                        return 1
                    }
                }(o.tid) || (s = Math.floor(5 * Math.random()) + 5, s *= 1e3, setTimeout(function () {
                    n = {}
                }, s)), CHROME.runtime.sendMessage({cmd: "GET_TAB_ID", parameter: {}}, function (e) {
                    t(e)
                })
            } catch (e) {
                t(null)
            }
        })) {
            const l = await async function () {
                let e = await new Promise((t, e) => {
                    try {
                        CHROME.storage.sync.get(["options"], function (e) {
                            t(e)
                        })
                    } catch (e) {
                        t({})
                    }
                });
                return 0 < Object.keys(e).length ? e.options : (e = await (e = await fetch("../options.json")).json(), CHROME.storage.sync.set({options: e}), e)
            }();
            let e = null;

            function d() {
                if (a) a = !1; else if (!t) return;
                (e = CHROME.runtime.connect({name: "TAB"})).onDisconnect.addListener(d), e.onMessage.addListener(function (e) {
                    "FORCE_CONNECT" === e && (t = !0)
                })
            }

            d(), n.loadMaster(), s._parent = n, s.options = l, s.mark(), $(document).on("click", "#remove", function () {
                $("#modal-remove").addClass("d-block")
            }).on("click", "#modal-remove-yes", function () {
                n.cancel(), $("#modal-remove").removeClass("d-block")
            }).on("click", "#modal-remove-close,#modal-remove-no", function () {
                $("#modal-remove").removeClass("d-block")
            }).on("click", "#pause", function () {
                n.pause()
            }).on("click", "#continue", function () {
                n.start()
            }).on("change", "#resolution select", function () {
                var e = $(this).val();
                n.pause(), n.switchLevel(e)
            }).on("click", "#save-part", function () {
                $("#save-part").attr("disabled", !0).addClass("disabled").addClass("loading"), n.savePart()
            }).on("click", ".save", function () {
                const n = $(this);
                n.addClass("loading"), setTimeout(function () {
                    n.addClass("timeout").removeClass("loading");
                    let e = 30;
                    const t = n.find(".btn-timeout span"), s = setInterval(function () {
                        t.text(e), --e < 0 && (clearInterval(s), n.addClass("disabled"), n.removeClass("timeout"), URL.revokeObjectURL(n.attr("href")))
                    }, 1e3)
                }, 5e3)
            }).on("click", ".radio-input-thread", function () {
                var e = $(this).val(), e = parseInt(e);
                n.threadsLimit = e
            }).on("click", "#auto-save", function () {
                $(this).find("input:checkbox").eq(0).is(":checked") ? l.autosave = !0 : l.autosave = !1, CHROME.storage.sync.set({options: l})
            }), window.addEventListener("beforeunload", function () {
                for (const s of document.querySelectorAll(".save")) {
                    var e = s.getAttribute("href");
                    e && window.URL.revokeObjectURL(e)
                }
                var t = $("#preview").find("video");
                0 < t.length && window.URL.revokeObjectURL(t.eq(0).attr("src"))
            }), CHROME.runtime.onMessage.addListener(function (e, t, s) {
                e = e.cmd;
                if ("BUILD_CONNECT" === e) return a = !0, d(), s(), !0
            })
        } else e.remove(), $("#connectFail").removeClass("d-none")
    } else e.remove(), $("#nodata").removeClass("d-none")
})();