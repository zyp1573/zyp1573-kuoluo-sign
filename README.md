# kuoluo-sign

一个自动签到库街区与鸣潮的脚本

## 使用

1. 安装依赖

   ```
   // node >=16
   npm install
   ```
2. 填写签到用户

   ```js
   // 修改 index.mjs L43
   const users = [
     {
       roleId: "",  // 鸣潮uid
       userId: "", // 库街区id
       token: "", // 库街区token
     },
   ];
   ```
3. 启动

    ```bash
    node index.mjs
    ```


