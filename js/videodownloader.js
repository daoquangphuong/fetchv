class DownloadUI {
    constructor() {
        this._parent = null, this.options = {}
    }

    mark() {
        $("body").attr("data-mark", "imleiiaoeclikefimmcdkjabjbpcdgaj"), $("#auto-save-wrap").removeClass("visually-hidden"), this.options.autosave && $("#auto-save").find("input:checkbox").attr("checked", !0)
    }

    loadSuccess(e, t, n) {
        var s = $("#name");
        s.html("");
        const a = $("<div></div>"), o = $('<span class="pe-1"></span>');
        o.text(t), o.appendTo(a);
        var i = $('<button class="btn btn-sm btn-outline-warning pe-1"></button>');
        i.text("Rename"), i.appendTo(a), a.appendTo(s);
        const l = $('<div class="d-flex py-1 visually-hidden align-items-center justify-content-between"></div>'),
            d = $('<input class="form-control w-100">');
        d.val(t), d.appendTo(l);
        var t = $('<div style="min-width: 300px; white-space: nowrap"></div>'),
            r = $('<button class="btn btn-primary ms-2"></button>'),
            c = (r.text("Confirm"), r.appendTo(t), $('<button class="btn btn-outline-info mx-2"></button>')),
            u = (c.text("Fill by title"), c.appendTo(t), $('<button class="btn btn-outline-secondary"></button>'));
        u.text("Cancel"), u.appendTo(t), t.appendTo(l), l.appendTo(s);
        const v = this;
        i.click(function () {
            a.addClass("visually-hidden"), l.removeClass("visually-hidden"), d.focus()
        }), c.click(function () {
            d.val(v._parent.title)
        }), r.click(function () {
            var e = d.val().trim();
            e ? (v._parent.name = e, o.text(e), a.removeClass("visually-hidden"), l.addClass("visually-hidden")) : d.focus()
        }), u.click(function () {
            d.val(v._parent.name), a.removeClass("visually-hidden"), l.addClass("visually-hidden")
        }), $("#size").text(this.sizeConvert(e)), $("#cached").text(this.sizeConvert(0)), $("#format").text(n.toUpperCase())
    }

    flushing() {
        $("#status-downloading,#status-pause,#status-completed,#status-error").addClass("d-none").removeClass("d-inline-block"), $("#status-flushing").removeClass("d-none").addClass("d-inline-block"), $("#pause").addClass("disabled").attr("disabled", !0)
    }

    error(e) {
        $("#status-pause,#status-flushing,#status-downloading").addClass("d-none").removeClass("d-inline-block"), $("#status-error").addClass("d-inline-block").removeClass("d-none"), $("#pause,#continue,#save-part").addClass("d-none"), $("#desc-error").removeClass("d-none").text(e), $("#progress").addClass("bg-danger")
    }

    cancel() {
        $("#cancel-cover").removeClass("d-none"), $(".save").each(function () {
            var e = $(this).attr("href");
            e && window.URL.revokeObjectURL(e)
        })
    }

    pause(e = !1) {
        $("#pause").addClass("d-none"), $("#status-pause").removeClass("d-none").addClass("d-inline-block"), $("#status-downloading,#status-flushing,#status-error").removeClass("d-inline-block").addClass("d-none"), $("#continue").removeClass("d-none"), e && $("#desc-30-wrong-requests").removeClass("d-none")
    }

    completed(e, t) {
        const n = $(".save");
        n.removeClass("d-none").attr("href", e).attr("download", t), $("#pause,#continue").addClass("d-none"), $("#status-downloading,#status-flushing,#status-pause,#status-error").addClass("d-none").removeClass("d-inline-block"), $("#status-completed").removeClass("d-none").addClass("d-inline-block"), $("#desc-complete").removeClass("d-none"), $("#progress").addClass("bg-success"), this.options.autosave && setTimeout(function () {
            n[0].click()
        }, 3e3)
    }

    start() {
        $("#status-loading,#status-flushing,#status-pause,#status-error,#status-completed").addClass("d-none").removeClass("d-inline-block"), $("#continue,#desc-30-wrong-requests").addClass("d-none"), $("#status-downloading").removeClass("d-none").addClass("d-inline-block"), $("#pause").removeClass("disabled").removeClass("d-none").removeAttr("disabled")
    }

    setProgress(e, t) {
        $("#cached").text(this.sizeConvert(t));
        t = (100 * t / e).toFixed(2) + "%";
        $("#progress").css({width: t}).text(t)
    }

    sizeConvert(e) {
        return e < 1024 ? e += "Byte" : e = e < 1048576 ? (e / 1024).toFixed(0) + "KB" : e < 1073741824 ? (e / 1048576).toFixed(2) + "M" : (e / 1073741824).toFixed(2) + "G", e
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

    createThreadsControls(t) {
        var e = $("#threads-control"), n = e.find(".radio-thread-set");
        for (let e = 1; e <= t; e++) {
            var s = n.clone(!0), a = s.find(".radio-input-thread");
            a.val(e), e === t && a.attr("checked", !0), s.find("label").text(e), s.insertBefore(n)
        }
        n.remove(), e.removeClass("d-none")
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
    const o = await ((n = await new Promise((t, e) => {
        try {
            CHROME.storage.local.get(["queue"], function (e) {
                if (0 < Object.keys(e).length) return "static" !== (e = e.queue).type ? void t(null) : void t(e);
                t(null)
            })
        } catch (e) {
            t(null)
        }
    })) ? (CHROME.storage.local.remove(["queue"]), async function (n) {
        const s = n.id.toString(), a = n.tab.toString();
        return new Promise((t, e) => {
            try {
                CHROME.storage.local.get([a], function (e) {
                    if (0 < Object.keys(e).length) return (e = e[a])[s] ? (e[s].tid = n.taskid, void t(e[s])) : void t(null);
                    t(null)
                })
            } catch (e) {
                t(null)
            }
        })
    }(n)) : null);
    if (o) {
        var n = new DownloadUI;
        let s = new Manifest(o, n);
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
                }(o.tid) || (n = Math.floor(5 * Math.random()) + 5, n *= 1e3, setTimeout(function () {
                    s = {}
                }, n)), CHROME.runtime.sendMessage({cmd: "GET_TAB_ID", parameter: {}}, function (e) {
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

            function i() {
                if (a) a = !1; else if (!t) return;
                (e = CHROME.runtime.connect({name: "TAB"})).onDisconnect.addListener(i), e.onMessage.addListener(function (e) {
                    "FORCE_CONNECT" === e && (t = !0)
                })
            }

            i(), s.load(), n._parent = s, n.options = l, n.mark(), $(document).on("click", "#remove", function () {
                $("#modal-remove").addClass("d-block")
            }).on("click", "#modal-remove-yes", function () {
                s.cancel(), $("#modal-remove").removeClass("d-block")
            }).on("click", "#modal-remove-close,#modal-remove-no", function () {
                $("#modal-remove").removeClass("d-block")
            }).on("click", "#pause", function () {
                s.pause()
            }).on("click", "#continue", function () {
                s.start()
            }).on("click", ".save", function () {
                const s = $(this);
                s.addClass("loading"), setTimeout(function () {
                    s.addClass("timeout").removeClass("loading");
                    let e = 30;
                    const t = s.find(".btn-timeout span"), n = setInterval(function () {
                        t.text(e), --e < 0 && (clearInterval(n), s.addClass("disabled"), s.removeClass("timeout"), URL.revokeObjectURL(s.attr("href")))
                    }, 1e3)
                }, 5e3)
            }).on("click", ".radio-input-thread", function () {
                var e = $(this).val(), e = parseInt(e);
                s.threadsLimit = e
            }).on("click", "#auto-save", function () {
                $(this).find("input:checkbox").eq(0).is(":checked") ? l.autosave = !0 : l.autosave = !1, CHROME.storage.sync.set({options: l})
            }), $(window).on("beforeunload", function () {
                $(".save").each(function () {
                    var e = $(this).attr("href");
                    e && window.URL.revokeObjectURL(e)
                })
            }), CHROME.runtime.onMessage.addListener(function (e, t, n) {
                e = e.cmd;
                if ("BUILD_CONNECT" === e) return a = !0, i(), n(), !0
            })
        } else e.remove(), $("#connectFail").removeClass("d-none")
    } else e.remove(), $("#nodata").removeClass("d-none")
})();