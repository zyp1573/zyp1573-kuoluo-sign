// @ts-nocheck

const requestHeaders = {
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 14; 22081212C Build/UKQ1.230917.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.6367.179 Mobile Safari/537.36 Kuro/2.2.0 KuroGameBox/2.2.0",
  Accept: "application/json, text/plain, */*",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Content-Type": "application/x-www-form-urlencoded",
  pragma: "no-cache",
  "cache-control": "no-cache",
  "sec-ch-ua":
    '"Chromium";v="124", "Android WebView";v="124", "Not-A.Brand";v="99"',
  source: "android",
  "sec-ch-ua-mobile": "?1",
  devcode:
    "111.181.85.154, Mozilla/5.0 (Linux; Android 14; 22081212C Build/UKQ1.230917.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.6367.179 Mobile Safari/537.36 Kuro/2.2.0 KuroGameBox/2.2.0",
  token: "",
  "sec-ch-ua-platform": '"Android"',
  origin: "https://web-static.kurobbs.com",
  "x-requested-with": "com.kurogame.kjq",
  "sec-fetch-site": "same-site",
  "sec-fetch-mode": "cors",
  "sec-fetch-dest": "empty",
  "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
  priority: "u=1, i",
};

/**
 * 常规参数
 */
const url_reward = "https://api.kurobbs.com/encourage/signIn/initSignInV2";
const url_sign = "https://api.kurobbs.com/encourage/signIn/v2";
const url_bbs_sign = "https://api.kurobbs.com/user/signIn";

const mcGameId = "3"; // 鸣潮写3
const bbsGameId = "2"; // 库街区写2
const serverId = "76402e5b20be2c39f095a152090afddc"; // 固定

/**
 * 要签到的用户，支持多用户。
 * 更建议启动多个服务，不同时间去签到
 */

const users = [];

/**
 * @description: 简单封装axios
 */
import axios from "axios";

const request = axios.create({
  baseURL: "",
  timeout: 1000 * 5,
  headers: requestHeaders,
});

request.interceptors.request.use(
  (config) => {
    if (config && config.data) {
      config.headers["token"] = config.data?.token || "";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error.response);
  }
);

/**
 * @description: 鸣潮签到奖励列表
 */
function initSignInV2(data) {
  return request({
    method: "POST",
    url: url_reward,
    data,
  });
}

/**
 * @description: 鸣潮签到
 */
function signInV2(data) {
  return request({
    method: "POST",
    url: url_sign,
    data,
  });
}

/**
 * @description: 库街区签到
 */
function signIn(data) {
  return request({
    method: "POST",
    url: url_bbs_sign,
    data,
  });
}

/**
 * @description: 库街区签到请求
 */
async function sign(user) {
  const data = Object.assign({ gameId: bbsGameId }, user);
  const res = await signIn(data);
  if (res.code === 200) {
    console.log(`库街区签到成功，`, `连续签到${res.data.continueDays}天`);
  } else {
    console.log(`库街区签到失败`, res.msg);
  }
}

/**
 * @description: 获取鸣潮签到奖励
 */
async function getRewards(user) {
  const data = Object.assign({ gameId: mcGameId, serverId }, user);
  const res = await initSignInV2(data);
  console.log(res);
}

import dayjs from "dayjs";

/**
 * @description: 鸣潮签到请求
 */
async function signMC(user) {
  const reqMonth = dayjs().format("MM");
  const data = Object.assign({ gameId: mcGameId, serverId, reqMonth }, user);
  const res = await signInV2(data);
  if (res.code === 200) {
    console.log("鸣潮签到成功");
    // 可结合getRewards()查看签到奖励
  } else {
    console.log("鸣潮签到失败", res.msg);
  }
}

/**
 * @description: 每天早上6点签到
 */
import cron from "node-cron";

cron.schedule("0 6 * * *", () => {
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    sign(user);
    signMC(user);
  }
});

/**
 * @description: 检测体力情况
 */

async function checkEnergy() {
  const res = await request({
    method: "POST",
    url: "https://api.kurobbs.com/gamer/widget/game3/getData",
    data: {
      type: 1,
      token:
        "",
    },
  });
  const { total, cur } = res.data.energyData;
}

