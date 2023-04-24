(async () => {
    const n = navigator.userAgent.includes("Chrome") ? chrome : browser;
    let o = !1;
    const d = Number(localStorage._recorderTabId_);
    n.runtime.onMessage.addListener(function (e, t, r) {
        var {cmd: e, parameter: n} = e;
        if(d && e === "X_VIDEO_PAGE"){
            try {
                const videos = document.querySelectorAll('video');
                videos.forEach(video => {
                    video.playbackRate = n.speed;
                    if(n.speed >= 10){
                        video.currentTime = video.buffered.end(0) - 1
                        video.pause();
                    } else {
                        video.play();
                    }
                });
            } catch (e) {
            }
        }
        return "RECORDER_STOP" === e ? (o = !0, r(), !0) : "RELOAD_VIDEO_PAGE" === e ? (localStorage._recorderTabId_ = n.tab, window.location.reload(), r(), !0) : void 0
    });
    if (d) {
        setTimeout(function () {
            delete localStorage._recorderTabId_
        }, 6e3);
        const a = document.createElement("div");
        a.id = "_fetchv_mse_record_container_", a.addEventListener("click", function (e) {
            if (!o) {
                const r = {recorderTabId: d};
                for (var t of a.getAttributeNames()) r[t] = a.getAttribute(t);
                r.url || (o = !0), n.runtime.sendMessage({cmd: "MEDIA_SOURCE_ON_DATA", parameter: r}, function (e) {
                    e || (o = !0, URL.revokeObjectURL(r.url))
                })
            }
        }), document.documentElement.appendChild(a);
        var e = n.runtime.getURL("js/injected.js");
        const t = document.createElement("script");
        t.onload = function () {
            this.parentNode.removeChild(this)
        }, t.setAttribute("type", "text/javascript"), t.src = e, setTimeout(() => {
            document.head.appendChild(t)
        }, 0), window.addEventListener("beforeunload", e => {
            n.runtime.sendMessage({cmd: "CONTENT_PAGE_CLOSE", parameter: {recorderTabId: d}})
        })
    }
})();