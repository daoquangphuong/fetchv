(() => {
    const r = document.querySelector("#_fetchv_mse_record_container_");
    var e;

    function d(e) {
        for (var t in e) r.setAttribute(t, e[t]);
        r.click();
        setTimeout(() => {
            try {
                document.querySelectorAll('video').forEach(video => {
                    if(video.playbackRate >= 10){
                        video.currentTime = video.buffered.end(0) - 1
                        video.pause();
                    }
                });
            } catch (e) {
            }
        }, 0)
    }

    r && (e = MediaSource, MediaSource = class extends e {
        constructor() {
            super(arguments), this._mediaId = Math.floor(1e10 * Math.random())
        }

        addSourceBuffer(r) {
            var e = super.addSourceBuffer.apply(this, arguments);
            const a = e.appendBuffer, o = (e._bufferId = Math.floor(1e10 * Math.random()), this);
            return e.appendBuffer = function (e) {
                if (e.length || e.byteLength) {
                    e = new Blob([e]);
                    const t = URL.createObjectURL(e);
                    d({
                        url: t,
                        mimeType: r,
                        mediaSourceId: o._mediaId,
                        bufferId: this._bufferId,
                        timestamp: Date.now()
                    }), setTimeout(function () {
                        URL.revokeObjectURL(t)
                    }, 1e4)
                }
                a.apply(this, arguments)
            }, e.addEventListener("abort", () => {
                d({url: null, mimeType: r, mediaSourceId: o._mediaId, bufferId: this._bufferId, timestamp: Date.now()})
            }), e
        }
    })
})();