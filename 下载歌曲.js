// ==UserScript==
// @name         MP3 下载器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.bilibili.com/audio/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let btn = document.createElement("button");
    btn.innerHTML = "立即下载";
    document.querySelector(".song-play").parentElement.append(btn);
    btn.addEventListener("click", function(){
        let resources = window.performance.getEntriesByType("resource");
        let resourceUrl = "";
        resources.forEach(function (resource) {
            if (/\.m4a/.test(resource.name) && /ugaxcode/.test(resource.name) && !/api\.bilibili/.test(resource.name)) {
                console.log(resource.name)
                if(resource.name != undefined && resource.name){
                    resourceUrl = resource.name;
                }
            }
        });
        fetch(resourceUrl, {
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7,zh-TW;q=0.6",

                "range": "bytes=0-",
                "sec-fetch-dest": "audio",
                "sec-fetch-mode": "no-cors",
                "sec-fetch-site": "cross-site"
            },
            "referrer": "https://www.bilibili.com/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "omit"
        }).then((response) => {
            const reader = response.body.getReader();
            const stream = new ReadableStream({
                start(controller) {
                    // 下面的函数处理每个数据块
                    function push() {
                        // "done"是一个布尔型，"value"是一个Unit8Array
                        reader.read().then(({ done, value }) => {
                            // 判断是否还有可读的数据？
                            if (done) {
                                // 告诉浏览器已经结束数据发送
                                controller.close();
                                return;
                            }
                            // 取得数据并将它通过controller发送给浏览器
                            controller.enqueue(value);
                            push();
                        });
                    };

                    push();
                }
            });

            return new Response(stream, { headers: { "Content-Type": "application/octet-stream" } });
        })
            .then(response => response.blob())
            .then(blob => URL.createObjectURL(blob))
            .then(url => {
                if(document.querySelector("#a_dl") == undefined || document.querySelector("#a_dl") == null){
                    let v = document.createElement("a");
                    v.id = "a_dl";
                    document.body.append(v);
                }
                let v = document.querySelector("#a_dl");
                v.download = document.querySelector("#song_detail_click_video_entrance").title+".m4a";
                // v.download = "music.m4a";
                v.href = url;
                v.dataset.downloadurl = ["application/octet-stream", v.download, v.href].join(":");
                v.click();
                console.log(url)
            })
            .catch(err => console.error(err));

    });
})();
