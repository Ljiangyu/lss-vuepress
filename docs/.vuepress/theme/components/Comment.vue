<template>
  <div class="gitalk-container">
    <div id="gitalk-container"></div>
  </div>
</template>
<script>
import crypto from "node:crypto";
function generateHash(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}
export default {
  name: "comment",
  data() {
    return {};
  },
  mounted() {
    let body = document.querySelector(".gitalk-container");
    let script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js";
    body.appendChild(script);
    script.onload = () => {
      const commentConfig = {
        clientID: "Ov23liYy1vua62tDJiwi",
        clientSecret: "49037610b80ef12b2e73b246b3b98e89e2802b36",
        repo: "https://github.com/Ljiangyu/lss-vuepress.git",
        owner: "Ljiangyu",
        // 这里接受一个数组，可以添加多个管理员，可以是你自己
        admin: ["Ljiangyu"],
        // id 用于当前页面的唯一标识，一般来讲 pathname 足够了，
        // 但是如果你的 pathname 超过 50 个字符，GitHub 将不会成功创建 issue，此情况可以考虑给每个页面生成 hash 值的方法.
        id: generateHash(location.pathname),
        distractionFreeMode: false,
      };
      const gitalk = new Gitalk(commentConfig);
      gitalk.render("gitalk-container");
    };
  },
};
</script>
<style>
@import "../css/gittalk.css";
</style>
