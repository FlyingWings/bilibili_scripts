// ==UserScript==
// @name         up关注时间
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       热狗
// @match        https://space.bilibili.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function initUI(){
        let panel = document.createElement("div");
        panel.style.position = "fixed";
        panel.style.right = "5px";
        panel.style.top = "617px";
        panel.style.zIndex = 1111;
        panel.style.minHeight = "200px";
        panel.style.border = "1px solid";

        // 增加textarea
        let new_span = document.createElement("span");
        new_span.id = "span_time"
        new_span.innerHTML = "";

        panel.appendChild(new_span);


        // 面板设置
        let bd = document.querySelector("body");
        bd.appendChild(panel);
    }

    function fetchTime(uid){
        fetch("https://api.bilibili.com/x/space/acc/relation?mid=545511", {
            "headers": {
                // "accept": "*/*",
                // "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7,zh-TW;q=0.6",
                // "sec-fetch-dest": "script",
                "sec-fetch-mode": "no-cors",
                "sec-fetch-site": "same-site"
            },
            "referrer": "https://space.bilibili.com/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(response => response.json())
        .then(data => {
            let p = document.querySelector("#span_time")
            if(data.data.relation.mid <= 0){
                p.innerHTML = "您尚未关注该up";
            }else{
                let t = new Date(data.data.relation.mtime * 1000).toLocaleString();
                p.innerHTML = "您关注当前up的时间是："+t;
            }
        });
    }

    function init(){
        initUI();
        let uid
         = location.href.match(/com\/(\d*)[\/\?]*/)[1];
        fetchTime(uid);
    }


    init();
})();