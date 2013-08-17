---
title:      "WebVPN (via SPDY) 已经布署了"
layout:     posts
permalink:  "/blog/WebVPN-via-SPDY-is-deployed.html"
categories: 'blogs'
---

# WebVPN (via SPDY) 已经布署了

这个新的翻墙工具需要感谢开源社区，特别要感谢 Chromium 和 @tatsuhiro_t  。 Thank you very much, どうもありがとうございました。

我们预测 WebVPN (via SPDY) 将是 2013 年最重要的翻墙方法。

WebVPN 用 https 来封装流量，和普通的网络流量完全没有区别。根据现有框架，GFW 完全没有能力识别和封锁。

桌面版的 Chrome 原生支持 WebVPN ，但是仍有客户端的开发需要。呼吁更多的程序员能够加入开发。

@tatsuhiro_t 的 spdylay C 程序库涵盖了服务器和客户端的功能，可以作为内核代码。

一段时间后，我们也会推出 WebVPN 服务器端的一步设置脚本。

