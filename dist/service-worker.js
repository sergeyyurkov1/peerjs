if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,l)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let o={};const t=e=>n(e,r),f={module:{uri:r},exports:o,require:t};s[r]=Promise.all(i.map((e=>f[e]||t(e)))).then((e=>(l(...e),o)))}}define(["./workbox-6567b62a"],(function(e){"use strict";e.setCacheNameDetails({prefix:"webrtc"}),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"/css/app.986acfba.css",revision:null},{url:"/css/call.27fb3195.css",revision:null},{url:"/css/chunk-vendors.bfbbb6e0.css",revision:null},{url:"/fonts/materialdesignicons-webfont.21f691f0.ttf",revision:null},{url:"/fonts/materialdesignicons-webfont.54b0f60d.woff2",revision:null},{url:"/fonts/materialdesignicons-webfont.5d875350.eot",revision:null},{url:"/fonts/materialdesignicons-webfont.d671cbf6.woff",revision:null},{url:"/img/01.8aa481ba.svg",revision:null},{url:"/index.html",revision:"979b3f96f7537e1287c874968fed1ba8"},{url:"/js/app.a9ef964d.js",revision:null},{url:"/js/call.7418e6c4.js",revision:null},{url:"/js/chunk-vendors.e84ca311.js",revision:null},{url:"/js/webfontloader.ef91e5fc.js",revision:null},{url:"/manifest.json",revision:"78957dbed564f274687a512cf744def5"}],{})}));
//# sourceMappingURL=service-worker.js.map
