// ==UserScript==
// @name         Download MediaSource Buffer
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      2
// @description  Stops most anti debugging implementations by JavaScript obfuscaters, and stops the console logs from being automatically cleared.
// @author       hacker09
// @include      *
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @resource     ffmpeg-worker-mp4.js https://cdn.jsdelivr.net/npm/ffmpeg.js@4.2.9003/ffmpeg-worker-mp4.js
// @run-at       document-start
// ==/UserScript==

/* global unsafeWindow, GM_getResourceText */

(function() {
    // eslint-disable-next-line no-undef
    const window = unsafeWindow;
    const { URL, MediaSource, document } = window;
    const { createObjectURL } = URL;
    const { addSourceBuffer } = MediaSource.prototype;
    const state = {
        mediaDataMap: {},
        blobUrlMap: {},
        initStyle: false,
        initUI: false,
    };

    const getMediaData = mediaId => {
        if (state.mediaDataMap[mediaId]) {
            return state.mediaDataMap[mediaId];
        }
        const sourceBufferMap = {};
        state.mediaDataMap[mediaId] = {
            sourceBufferMap,
            appendBuffer: (mimeType, bufferSource) => {
                sourceBufferMap[mimeType] = sourceBufferMap[mimeType] || [];
                sourceBufferMap[mimeType].push(bufferSource);
            },
            getBlobs: () => {
                return Object.entries(sourceBufferMap).map(
                    ([mimeType, bufferSources]) => {
                        console.info(mimeType);
                        const blob = new Blob(bufferSources, {
                            type: mimeType.split(';')[0],
                        });
                        return blob;
                    }
                );
            },
        };
        return state.mediaDataMap[mediaId];
    };

    URL.createObjectURL = src => {
        const url = createObjectURL(src);
        if (src instanceof MediaSource) {
            state.blobUrlMap[url] = src;
        }
        return url;
    };

    MediaSource.prototype.addSourceBuffer = function addSourceBufferHook(
        mimeType
    ) {
        this.mediaId = this.mediaId || Math.floor(1e10 * Math.random());
        const mediaData = getMediaData(this.mediaId);
        const sourceBuffer = addSourceBuffer.apply(this, [mimeType]);
        const { appendBuffer } = sourceBuffer;
        sourceBuffer.appendBuffer = function appendBufferHook(bufferSource) {
            if (bufferSource.length || bufferSource.byteLength) {
                mediaData.appendBuffer(mimeType, bufferSource);
            }
            return appendBuffer.apply(this, [bufferSource]);
        };
        return sourceBuffer;
    };

    const download = src => {
        const scriptID = `FFMPEG`;
        if (!document.getElementById(scriptID)) {
            if (!window.crossOriginIsolated) {
                window.SharedArrayBuffer = window.ArrayBuffer;
            }
            const $script = document.createElement('script');
            $script.id = scriptID;
            // const scriptText = GM_getResourceText('ffmpeg-worker-mp4.js');
            // $script.src = `https://cdn.jsdelivr.net/npm/ffmpeg.js@4.2.9003/ffmpeg-worker-mp4.js`;
            // $script.textContent =  GM_getResourceText('ffmpeg-worker-mp4.js')
            document.head.appendChild($script);
        }
        if (state.timeout) {
            clearTimeout(state.timeout);
        }
        const loop = () => {
            // if (!window.FFmpeg) {
            //   state.timeout = setTimeout(loop, 100);
            //   return;
            // }
            const mediaSource = state.blobUrlMap[src];
            if (!mediaSource || !mediaSource.mediaId) {
                return;
            }
            const { mediaId } = mediaSource;
            const mediaData = state.mediaDataMap[mediaId];
            if (!mediaData) {
                return;
            }
            const blobs = mediaData.getBlobs();

            const main = async () => {
                console.info('START');

                const args = [];
                const files = await Promise.all(
                    blobs.map(async (blob, idx) => {
                        const arrayBuffer = await blob.arrayBuffer();
                        const ext = blob.type
                            .split(';')[0]
                            .split('/')
                            .pop();
                        const filename = `blob-${idx}.${ext}`;
                        args.push('-i', filename);
                        return {
                            name: filename,
                            data: new Uint8Array(arrayBuffer),
                        };
                    })
                );
                args.push('-c', 'copy', 'output.mp4');

                const options = {
                    MEMFS: files,
                    arguments: args,
                };

                const scriptUrl = URL.createObjectURL(
                    new Blob([GM_getResourceText('ffmpeg-worker-mp4.js')], {
                        type: `text/javascript`,
                    })
                );

                const worker = new window.Worker(scriptUrl);

                worker.onmessage = function(e) {
                    const msg = e.data;
                    switch (msg.type) {
                        case 'ready': {
                            worker.postMessage({ type: 'run', ...options });
                            break;
                        }
                        case 'stdout': {
                            console.info(msg.data);
                            break;
                        }
                        case 'stderr': {
                            console.info(msg.data);
                            break;
                        }
                        case 'done': {
                            console.info(msg.data);
                            const [output] = msg.data.MEMFS;
                            console.info(output);

                            const outputBlob = new Blob([output.data], {
                                type: 'video/mp4',
                            });

                            const url = URL.createObjectURL(outputBlob);

                            console.info(url);
                            break;
                        }
                        default:
                            break;
                    }
                };
            };

            main().catch(console.error);
        };
        loop();
    };

    const renderUI = node => {
        const videos =
            node.tagName === 'VIDEO' ? [node] : node.querySelectorAll('video');

        [...videos].forEach(video => {
            const div = document.createElement('div');
            div.innerHTML =
                '<button style="position: fixed;z-index:999999999;cursor:pointer;">Download</button>';
            const button = div.querySelector('button');
            button.onclick = function handleClick(event) {
                event.stopPropagation();
                download(video.src);
            };
            video.parentNode.append(div);
        });
    };

    // Create an observer instance linked to the callback function
    const observer = new window.MutationObserver(mutationsList => {
        // Use traditional 'for loops' for IE 11
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                // console.log('A child node has been added or removed.');
                Array.from(mutation.addedNodes).forEach(node => {
                    if (node.querySelectorAll) {
                        renderUI(node);
                    }
                });
            }
        });
    });

    // Start observing the target node for configured mutations
    observer.observe(window.document, {
        attributes: true,
        childList: true,
        subtree: true,
    });
})();
