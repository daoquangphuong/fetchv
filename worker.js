const CHROME = navigator.userAgent.includes("Chrome") ? chrome : browser, TASK_TAB = [];
let POPUP_IS_OPEN = !1, TAB_IS_CONNECT = !1, CONNECT_TAB = null, OPTIONS = {};
const DOWNLOADING_REQUEST = [];

function removeTaskTab(e) {
    e = TASK_TAB.indexOf(e);
    e < 0 || TASK_TAB.splice(e, 1)
}

function updateBadge(e, t) {
    let n = Object.keys(e).length;
    n = 0 < n ? n.toString() : "", CHROME.action.setBadgeText({text: n, tabId: t})
}

CHROME.runtime.onConnect.addListener(function (e) {
    var t = e.name;

    function n(e) {
        e._timer && (clearTimeout(e._timer), delete e._timer)
    }

    "POPUP" === t ? (POPUP_IS_OPEN = !0, e.onDisconnect.addListener(function () {
        POPUP_IS_OPEN = !1
    })) : "TAB" === t && (t = e.sender.tab.id, CONNECT_TAB && CONNECT_TAB !== t ? e.disconnect() : (CONNECT_TAB !== t && (e.postMessage("FORCE_CONNECT"), CONNECT_TAB = t), e.onDisconnect.addListener(n), e._timer = setTimeout(function (e) {
        n(e), e.disconnect()
    }, 25e4, e)))
}), CHROME.runtime.onMessage.addListener(function (e, t, n) {
    var {cmd: e, parameter: i} = e;
    if(e === 'X_VIDEO_PAGE'){
        CHROME.tabs.sendMessage(i.tab, {
            cmd: e,
            parameter: {tab: t.tab.id, speed: i.speed}
        });
    }
    if ("RESET_OPTIONS" === e) return CHROME.storage.sync.get(["options"], function (e) {
        (OPTIONS = e.options).size.min && (OPTIONS.size.min = 1024 * OPTIONS.size.min), OPTIONS.size.max && (OPTIONS.size.max = 1024 * OPTIONS.size.max), OPTIONS.size.min < 0 && (OPTIONS.size.min = 0), OPTIONS.size.max < 0 && (OPTIONS.size.max = 0)
    }), n(""), !0;
    if ("CHECK_DOWNLOADING_REQUEST_EXIST" === e) {
        for (var a in DOWNLOADING_REQUEST) {
            a = DOWNLOADING_REQUEST[a];
            if (a.request === i.request) return n({exist: !0, tab: a.tab}), !0
        }
        return n({exist: !1}), !0
    }
    if ("GET_TAB_ID" === e) return r = t.tab.id, TASK_TAB.push(r), n(r), !0;
    if ("FETCH_DATA" !== e) return "RELOAD_VIDEO_PAGE" === e ? (CHROME.tabs.update(i.tab, {active: !0}), CHROME.tabs.sendMessage(i.tab, {
        cmd: e,
        parameter: {tab: t.tab.id}
    }), n(), !0) : "MEDIA_SOURCE_ON_DATA" === e ? (r = i.recorderTabId, TASK_TAB.indexOf(r) < 0 ? void n(!1) : (i.url ? CHROME.tabs.sendMessage(r, {
        cmd: e,
        parameter: i
    }) : CHROME.tabs.sendMessage(r, {
        cmd: "RECORDER_SUCCESS",
        parameter: {}
    }), n(!0), !0)) : "CONTENT_PAGE_CLOSE" === e ? (t = i.recorderTabId, TASK_TAB.indexOf(t) < 0 ? void 0 : (CHROME.tabs.sendMessage(t, {
        cmd: "RECORDER_SUCCESS",
        parameter: {}
    }), n(), !0)) : void n();
    {
        var {url: r, headers: e, method: t} = i;
        const s = new AbortController, o = setTimeout(() => {
            s.abort(), n({ok: !1, message: "request timeout"})
        }, 3e4);
        t = {signal: s.signal, method: t, mode: "cors", credentials: "include", headers: e};
        return fetch(r, t).then(function (e) {
            if (clearTimeout(o), e.ok) return e.arrayBuffer();
            n({ok: !1, message: "fetch error"})
        }).then(function (e) {
            n({ok: !0, content: Array.from(new Uint8Array(e))})
        }).catch(function (e) {
            n({ok: !1, message: e.messsage})
        }), !0
    }
}), CHROME.tabs.onRemoved.addListener(async function (e) {
    removeTaskTab(e);
    try {
        var t;
        CONNECT_TAB === e && (CONNECT_TAB = null, 0 < TASK_TAB.length && (t = TASK_TAB[0], CHROME.tabs.sendMessage(t, {
            cmd: "BUILD_CONNECT",
            parameter: {}
        })))
    } catch (e) {
        console.log(e)
    }
    CHROME.storage.local.remove([e.toString()])
}), CHROME.tabs.onUpdated.addListener(function (e, t, n) {
    "loading" === t.status && CHROME.storage.local.remove([e.toString()], function () {
        updateBadge({}, e)
    })
}), async function () {
    const i = {}, a = ["m3u8", "m3u", "mp4", "3gp", "flv", "mov", "avi", "wmv", "webm", "f4v", "acc", "mkv"];

    function f(e) {
        return (e = e.split("?"))[0]
    }

    function r(t, n) {
        t = t.toLowerCase();
        for (let e = 0; e < n.responseHeaders.length; e++) if (n.responseHeaders[e].name.toLowerCase() === t) return n.responseHeaders[e].value.toLowerCase();
        return null
    }

    (OPTIONS = await async function () {
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
    }()).domain.push("youtube.com"), OPTIONS.size.min && (OPTIONS.size.min = 1024 * OPTIONS.size.min), OPTIONS.size.max && (OPTIONS.size.max = 1024 * OPTIONS.size.max), OPTIONS.size.min < 0 && (OPTIONS.size.min = 0), OPTIONS.size.max < 0 && (OPTIONS.size.max = 0), CHROME.webRequest.onBeforeSendHeaders.addListener(function (e) {
        i[e.requestId] = e.requestHeaders || {}
    }, {
        urls: ["<all_urls>"],
        types: ["media", "xmlhttprequest", "object", "other"]
    }, ["requestHeaders", "extraHeaders"]), CHROME.webRequest.onResponseStarted.addListener(async function (c) {
        const v = i[c.requestId] || {};
        if (delete i[c.requestId], -1 !== c.tabId && !(c.responseHeaders.length < 1 || c.statusCode < 200 || 300 < c.statusCode)) {
            var e = c.url || c.initiator;
            if (e) for (var t in OPTIONS.domain) {
                t = OPTIONS.domain[t];
                if (0 < e.indexOf(t)) return
            }
            let u = 0;
            var n = function (e) {
                let t = r("Content-Range", e);
                if (t) return 2 === (t = t.split(" ")).length && 2 === (t = t[1].split("/")).length && (t[1] = parseInt(t[1]), t[1]) ? {
                    chunk: t[0],
                    total: t[1]
                } : null;
                return null
            }(c);
            u = n ? n.total : function (e) {
                e = r("Content-Length", e);
                return !e || (e = parseInt(e)) < 1 ? 0 : e
            }(c);
            let O = r("content-type", c);
            if (O) {
                let d = function (e) {
                    let t = null, n = r("content-disposition", e);
                    if (n) {
                        n = n.split(";");
                        for (let e = 0; e < n.length; e++) if (-1 < n[e].indexOf("filename=")) return n[e] = n[e].replace(/filename=/i, "").replace(/\"/g, "").replace(/\'/g, "").replace(/(^\s*)|(\s*$)/g, ""), t = n[e]
                    }
                    return !((n = (n = (n = e.url.replace(/http:\/\//i, "").replace(/https:\/\//i, "")).split("?"))[0].split("/")).length < 2) && (n = n[n.length - 1]) || t
                }(c), l = function (e, t) {
                    var e = function (e) {
                        e = e.split(".");
                        return e.length < 2 ? null : e[e.length - 1].toLowerCase()
                    }(e), n = {
                        general: {
                            "application/vnd.apple.mpegurl": ["m3u8", "m3u"],
                            "application/x-mpegurl": ["m3u8", "m3u"],
                            "application/vnd.americandynamics.acc": ["acc"],
                            "application/vnd.rn-realmedia-vbr": ["rmvb"],
                            "video/mp4": ["mp4", "m4s"],
                            "video/3gpp": ["3gp"],
                            "video/3gpp2": ["3gp2"],
                            "video/x-flv": ["flv"],
                            "video/quicktime": ["mov"],
                            "video/x-msvideo": ["avi"],
                            "video/x-ms-wmv": ["wmv"],
                            "video/webm": ["webm"],
                            "video/ogg": ["ogg", "ogv"],
                            "video/x-f4v": ["f4v"],
                            "video/x-matroska": ["mkv"],
                            "video/iso.segment": ["m4s"]
                        },
                        stream: {
                            "application/octet-stream": ["m3u8", "m3u", "mp4", "webm", "avi", "ogg", "flv", "mkv", "3gp"],
                            "binary/octet-stream": ["m3u8", "m3u", "mp4", "webm", "avi", "ogg", "flv", "mkv", "3gp"]
                        }
                    };
                    if (n.general[t]) return !e || (i = n.general[t].indexOf(e)) < 0 ? n.general[t][0] : n.general[t][i];
                    {
                        var i;
                        if (n.stream[t]) return !e || (i = n.stream[t].indexOf(e)) < 0 ? null : n.stream[t][i]
                    }
                    return null
                }(d = d || "undefined-filename", O);
                if (l && !(a.indexOf(l) < 0)) {
                    const T = await new Promise(t => {
                        try {
                            CHROME.tabs.get(c.tabId, function (e) {
                                e.title ? t(e.title) : t("no-title")
                            })
                        } catch (e) {
                            t("no-title")
                        }
                    });
                    if ("m3u8" !== l && "m3u" !== l) {
                        if (!u) return;
                        if (OPTIONS.size.min && u < OPTIONS.size.min) return;
                        if (OPTIONS.size.max && u > OPTIONS.size.max) return
                    } else d = T + "[" + d + "]";
                    let m = c.tabId.toString();
                    CHROME.storage.local.get(m, async function (n) {
                        if (0 < Object.keys(n).length && (n = n[m]), !(30 < Object.keys(n).length)) {
                            if (!function (e, t) {
                                for (var n in t) if (f(t[n].url) === f(e)) return 1;
                                return
                            }(c.url, n)) {
                                var i = {};
                                for (const o in v) {
                                    var a = v[o];
                                    "range" !== a.name.toLowerCase() && (i[a.name] = a.value)
                                }
                                let e = "GET", t = ("POST" === c.method && (e = "POST"), n[c.requestId] = {
                                    url: c.url,
                                    method: e,
                                    format: l,
                                    contentType: (r = l, s = O, {
                                        m3u8: "video/mp4",
                                        m3u: "video/mp4",
                                        mp4: "video/mp4",
                                        "3gp": "video/3gpp",
                                        flv: "video/x-flv",
                                        mov: "video/quicktime",
                                        avi: "video/x-msvideo",
                                        wmv: "video/x-ms-wmv",
                                        webm: "video/webm",
                                        ogg: "video/ogg",
                                        ogv: "video/ogg",
                                        f4v: "video/x-f4v",
                                        acc: "application/vnd.americandynamics.acc",
                                        mkv: "video/x-matroska",
                                        rmvb: "application/vnd.rn-realmedia-vbr",
                                        m4s: "video/iso.segment"
                                    }[r] || s),
                                    filename: d,
                                    size: u,
                                    headers: i,
                                    title: T
                                }, {});
                                t[m] = n, CHROME.storage.local.set(t), POPUP_IS_OPEN && ((t = {})[c.requestId] = n[c.requestId], CHROME.runtime.sendMessage({
                                    cmd: "POPUP_APPEND_ITEMS",
                                    parameter: {tab: c.tabId, item: t}
                                }))
                            }
                            var r, s;
                            updateBadge(n, c.tabId)
                        }
                    })
                }
            }
        }
    }, {urls: ["<all_urls>"], types: ["media", "xmlhttprequest", "object", "other"]}, ["responseHeaders"])
}();