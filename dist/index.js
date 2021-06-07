var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// app.js
var import_util = __toModule(require("util"));
var import_selenium_webdriver = __toModule(require("selenium-webdriver"));
var import_app = __toModule(require("firebase/app"));
var import_firestore = __toModule(require("firebase/firestore"));
var import_storage = __toModule(require("firebase/storage"));
var import_auth = __toModule(require("firebase/auth"));
var import_functions = __toModule(require("firebase/functions"));
var import_process = __toModule(require("process"));
var import_fast_sort = __toModule(require("fast-sort"));
var fs = require("fs");
var { Builder, By, until } = import_selenium_webdriver.default;
var app = import_app.default.initializeApp({
  apiKey: "AIzaSyCj9Vxn7bQCy80iwxR8fB3HA9iGgySUrBI",
  authDomain: "webscrapingforbussiness.firebaseapp.com",
  projectId: "webscrapingforbussiness",
  storageBucket: "webscrapingforbussiness.appspot.com",
  messagingSenderId: "843243345021",
  appId: "1:843243345021:web:908bb33aaaeec9c59dcd14"
});
var db = import_app.default.firestore(app);
var current = new Date();
var currentDate = current.getFullYear() + "-" + (current.getMonth() + 1) + "-" + current.getDate();
function createNewAccessId() {
  const LENGTH = 20;
  const SOURCE = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
  let NewId = "";
  for (let i = 0; i < LENGTH; i++) {
    NewId += SOURCE[Math.floor(Math.random() * SOURCE.length)];
  }
  return NewId;
}
var itemsData = {
  itemDB: [],
  async stream({ node }) {
    await db.collection("Items").doc(currentDate).set({ created_at: current });
    const ref = await db.collection(`Items/${currentDate}/items`).where("categoryNode", "==", node);
    ref.onSnapshot((res) => {
      this.itemDB = res;
    });
  },
  getDocs() {
    const result = [];
    this.itemDB.forEach((el) => {
      result.push(el.data());
    });
    return result;
  },
  getDocById(id) {
    const docs = this.getDocs();
    return docs.find((el) => el.asin === id);
  },
  isHaveId(id) {
    const docs = this.getDocs();
    if (docs.find((el) => el.asin === id))
      return true;
    return false;
  }
};
var logsData = {
  logDB: [],
  async stream() {
    await db.collection("Logs").doc(currentDate).set({ created_at: current });
    const ref = await db.collection(`Logs/${currentDate}/Logs`);
    ref.onSnapshot((res) => {
      this.logDB = res;
    });
  },
  async getDocs() {
    const result = [];
    this.logDB.forEach((el) => {
      result.push(el.data());
    });
    return result;
  },
  getLatestDoc() {
    let result = [];
    this.logDB.forEach((el) => {
      result.push(el.data());
    });
    if (!result.length)
      return [];
    const maxSearchIndex = (0, import_fast_sort.sort)(result).desc((r) => r.searchTextIndex)[0].searchTextIndex;
    const maxNodeIndex = (0, import_fast_sort.sort)(result.filter((e) => e.searchTextIndex === maxSearchIndex)).desc((r) => r.nodeIndex)[0].nodeIndex;
    const maxPageNum = (0, import_fast_sort.sort)(result.filter((e) => e.searchTextIndex === maxSearchIndex && e.nodeIndex === maxNodeIndex)).desc((r) => r.pageNum)[0].pageNum;
    return {
      nodeIndex: maxNodeIndex,
      pageNum: maxPageNum,
      searchTextIndex: maxSearchIndex
    };
  }
};
var categories = [
  { code: 13384021, keyword: "\u96D1\u8A8C" },
  { code: 561958, keyword: "DVD" },
  { code: 403507011, keyword: "\u30D6\u30EB\u30FC\u30EC\u30A4" },
  { code: 561956, keyword: "\u30DF\u30E5\u30FC\u30B8\u30C3\u30AF" },
  { code: 2123629051, keyword: "\u697D\u5668\u30FB\u97F3\u97FF\u6A5F\u5668" },
  { code: 637394, keyword: "\u30B2\u30FC\u30E0" },
  { code: 689132, keyword: "PC\u30B2\u30FC\u30E0" },
  { code: 3895771, keyword: "\u30AD\u30C3\u30C1\u30F3\u5BB6\u96FB" },
  { code: 3895791, keyword: "\u751F\u6D3B\u5BB6\u96FB" },
  { code: 3895751, keyword: "\u7406\u7F8E\u5BB9\u30FB\u5065\u5EB7\u5BB6\u96FB" },
  { code: 3895761, keyword: "\u7A7A\u8ABF\u30FB\u5B63\u7BC0\u5BB6\u96FB" },
  { code: 2133982051, keyword: "\u7167\u660E" },
  { code: 124048011, keyword: "\u5BB6\u96FB" },
  { code: 16462091, keyword: "\u30AB\u30E1\u30E9" },
  { code: 3465736051, keyword: "\u696D\u52D9\u7528\u30AB\u30E1\u30E9\u30FB\u30D3\u30C7\u30AA" },
  { code: 171350011, keyword: "\u53CC\u773C\u93E1\u30FB\u671B\u9060\u93E1\u30FB\u5149\u5B66\u6A5F\u5668" },
  { code: 128187011, keyword: "\u643A\u5E2F\u96FB\u8A71\u30FB\u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3" },
  { code: 3477381, keyword: "\u30C6\u30EC\u30D3\u30FB\u30EC\u30B3\u30FC\u30C0\u30FC" },
  { code: 16462081, keyword: "\u30AA\u30FC\u30C7\u30A3\u30AA" },
  { code: 3477981, keyword: "\u30A4\u30E4\u30DB\u30F3\u30FB\u30D8\u30C3\u30C9\u30DB\u30F3" },
  { code: 3544106051, keyword: "\u30A6\u30A7\u30A2\u30E9\u30D6\u30EB\u30C7\u30D0\u30A4\u30B9" },
  { code: 3371421, keyword: "\u30A2\u30AF\u30BB\u30B5\u30EA\u30FB\u30B5\u30D7\u30E9\u30A4" },
  { code: 3210981, keyword: "\u5BB6\u96FB\uFF06\u30AB\u30E1\u30E9" },
  { code: 2188762051, keyword: "\u30D1\u30BD\u30B3\u30F3" },
  { code: 2127209051, keyword: "\u30D1\u30BD\u30B3\u30F3\u30FB\u5468\u8FBA\u6A5F\u5668" },
  { code: 2151826051, keyword: "PC\u30A2\u30AF\u30BB\u30B5\u30EA\u30FB\u30B5\u30D7\u30E9\u30A4" },
  { code: 2151901051, keyword: "PC\u30D1\u30FC\u30C4" },
  { code: 2188763051, keyword: "\u30D7\u30EA\u30F3\u30BF" },
  { code: 637392, keyword: "PC\u30BD\u30D5\u30C8" },
  { code: 2201422051, keyword: "PC\u30BD\u30D5\u30C8" },
  { code: 86731051, keyword: "\u6587\u623F\u5177\u30FB\u30AA\u30D5\u30A3\u30B9\u7528\u54C1" },
  { code: 13938481, keyword: "\u30AD\u30C3\u30C1\u30F3\u7528\u54C1\u30FB\u98DF\u5668" },
  { code: 3093567051, keyword: "\u30A4\u30F3\u30C6\u30EA\u30A2\u30FB\u96D1\u8CA8" },
  { code: 2538755051, keyword: "\u30E9\u30B0\u30FB\u30AB\u30FC\u30C6\u30F3\u30FB\u30D5\u30A1\u30D6\u30EA\u30C3\u30AF" },
  { code: 16428011, keyword: "\u5BB6\u5177" },
  { code: 13945081, keyword: "\u53CE\u7D0D\u30B9\u30C8\u30A2" },
  { code: 2378086051, keyword: "\u5BDD\u5177" },
  { code: 3093569051, keyword: "\u6383\u9664\u30FB\u6D17\u6FEF\u30FB\u30D0\u30B9\u30FB\u30C8\u30A4\u30EC" },
  { code: 2038875051, keyword: "\u9632\u72AF\u30FB\u9632\u707D\u7528\u54C1" },
  { code: 2127212051, keyword: "\u30DA\u30C3\u30C8\u7528\u54C1" },
  { code: 2189701051, keyword: "\u624B\u82B8\u30FB\u753B\u6750" },
  { code: 3828871, keyword: "\u30DB\u30FC\u30E0\uFF06\u30AD\u30C3\u30C1\u30F3" },
  { code: 2031744051, keyword: "\u96FB\u52D5\u5DE5\u5177\u30FB\u30A8\u30A2\u5DE5\u5177" },
  { code: 2038157051, keyword: "\u4F5C\u696D\u5DE5\u5177" },
  { code: 2361405051, keyword: "\u30AC\u30FC\u30C7\u30CB\u30F3\u30B0" },
  { code: 2039681051, keyword: "\u30A8\u30AF\u30B9\u30C6\u30EA\u30A2" },
  { code: 2016929051, keyword: "DIY\u30FB\u5DE5\u5177" },
  { code: 13299531, keyword: "\u304A\u3082\u3061\u3083" },
  { code: 466306, keyword: "\u7D75\u672C\u30FB\u5150\u7AE5\u66F8" },
  { code: 2277721051, keyword: "\u30DB\u30D3\u30FC" },
  { code: 2230006051, keyword: "\u30EC\u30C7\u30A3\u30FC\u30B9" },
  { code: 2230005051, keyword: "\u30E1\u30F3\u30BA" },
  { code: 2230804051, keyword: "\u30AD\u30C3\u30BA" },
  { code: 2221077051, keyword: "\u30D0\u30C3\u30B0\u30FB\u30B9\u30FC\u30C4\u30B1\u30FC\u30B9" },
  { code: 2188968051, keyword: "\u30B9\u30DD\u30FC\u30C4\u30A6\u30A7\u30A2\uFF06\u30B7\u30E5\u30FC\u30BA" },
  { code: 15337751, keyword: "\u81EA\u8EE2\u8ECA" },
  { code: 14315411, keyword: "\u30A2\u30A6\u30C8\u30C9\u30A2" },
  { code: 14315521, keyword: "\u91E3\u308A" },
  { code: 14315501, keyword: "\u30D5\u30A3\u30C3\u30C8\u30CD\u30B9\u30FB\u30C8\u30EC\u30FC\u30CB\u30F3\u30B0" },
  { code: 14315441, keyword: "\u30B4\u30EB\u30D5" },
  { code: 14304371, keyword: "\u30B9\u30DD\u30FC\u30C4\uFF06\u30A2\u30A6\u30C8\u30C9\u30A2" },
  { code: 2017304051, keyword: "\u8ECA\uFF06\u30D0\u30A4\u30AF" },
  { code: 2319890051, keyword: "\u30D0\u30A4\u30AF\u7528\u54C1\u30B9\u30C8\u30A2" },
  { code: 3305008051, keyword: "\u81EA\u52D5\u8ECA\uFF06\u30D0\u30A4\u30AF\u8ECA\u4F53" },
  { code: 3333565051, keyword: "\u5DE5\u696D\u6A5F\u5668" },
  { code: 3037451051, keyword: "\u7814\u7A76\u958B\u767A\u7528\u54C1" },
  { code: 3450744051, keyword: "\u885B\u751F\u30FB\u6E05\u6383\u7528\u54C1" },
  { code: 3445393051, keyword: "\u7523\u696D\u30FB\u7814\u7A76\u958B\u767A\u7528\u54C1" },
  { code: 3450874051, keyword: "\u885B\u751F\u8A2D\u5099\u6A5F\u5668" },
  { code: 3450884051, keyword: "\u696D\u52D9\u7528\u30CF\u30F3\u30C9\u30C9\u30E9\u30A4\u30E4\u30FC" },
  { code: 3450886051, keyword: "\u636E\u4ED8\u3051\u30C8\u30A4\u30EC\u30C3\u30C8\u30DA\u30FC\u30D1\u30FC\u30DB\u30EB\u30C0\u30FC" },
  { code: 3450889051, keyword: "\u636E\u4ED8\u3051\u30DA\u30FC\u30D1\u30FC\u30BF\u30AA\u30EB\u30DB\u30EB\u30C0\u30FC" },
  { code: 3450891051, keyword: "\u30C8\u30A4\u30EC\u30D6\u30FC\u30B9\u90E8\u54C1" }
];
var keywords = ["\u4E26\u884C\u8F38\u5165", "\u8F38\u5165", "import", "\u30A4\u30F3\u30DD\u30FC\u30C8", "\u6D77\u5916", "\u5317\u7C73", "\u56FD\u540D", "\u65E5\u672C\u672A\u767A\u58F2"];
(async () => {
  var _a, _b;
  try {
    const accessId = createNewAccessId();
    let isFirstLoad = true;
    let isExistTodayLog = false;
    console.log("start");
    await logsData.stream();
    const logRef = await db.collection(`Logs/${currentDate}/Logs`);
    const capabilities = import_selenium_webdriver.default.Capabilities.chrome();
    capabilities.set("chromeOptions", {
      args: ["--headless", "--no-sandbox", "--disable-gpu", `--window-size=1980,1200`]
    });
    const driver2 = [];
    driver2[1] = await new Builder().withCapabilities(capabilities).build();
    driver2[2] = await new Builder().withCapabilities(capabilities).build();
    driver2[3] = await new Builder().withCapabilities(capabilities).build();
    const ref = await db.collection(`Items/${currentDate}/Items`);
    const items = await ref.get();
    let logsDataObj;
    logsDataObj = logsData.getLatestDoc();
    const latestLogDate = ((_a = logsDataObj == null ? void 0 : logsDataObj.created_at) == null ? void 0 : _a.seconds) ? new Date(logsDataObj.created_at.seconds * 1e3) : new Date(0);
    const now = new Date();
    let checkLogData = {};
    if (latestLogDate.getFullYear() + "-" + latestLogDate.getFullYear() + "-" + latestLogDate.getDate() === now.getFullYear() + "-" + now.getFullYear() + "-" + now.getDate()) {
      isExistTodayLog = true;
      checkLogData = latestLogDate;
    }
    for (let j = isFirstLoad && isExistTodayLog ? keywords.findIndex((el) => el === checkLogData.searchText) : 0; j < keywords.length; j++) {
      for (let t = isFirstLoad && isExistTodayLog ? categories.findIndex((el) => el.code === checkLogData.categoryNode) : 0; t < categories.length; t++) {
        await itemsData.stream({ node: categories[t].code });
        let pageNum = isFirstLoad && isExistTodayLog ? checkLogData.pageNum : 1;
        while (pageNum < 1e3) {
          const currentLatestLog = logsData.getLatestDoc() || {};
          if (j > currentLatestLog.searchTextIndex) {
            j = currentLatestLog.searchTextIndex;
            t = currentLatestLog.nodeIndex;
            pageNum = currentLatestLog.pageNum;
            if (currentLatestLog.accessId !== currentLatestLog) {
              pageNum = currentLatestLog.pageNum + 1;
            }
          }
          if (j === currentLatestLog.searchTextIndex && currentLatestLog.nodeIndex > t) {
            t = currentLatestLog.nodeIndex;
            pageNum = currentLatestLog.pageNum;
            if (currentLatestLog.accessId !== currentLatestLog) {
              pageNum = currentLatestLog.pageNum + 1;
            }
          }
          if (j === currentLatestLog.searchTextIndex && currentLatestLog.nodeIndex > t && currentLatestLog.pageNum > pageNum) {
            pageNum = currentLatestLog.pageNum;
            if (currentLatestLog.accessId !== currentLatestLog) {
              pageNum = currentLatestLog.pageNum + 1;
            }
          }
          const putKeyword = keywords[j];
          const node = categories[t].code;
          const n = (pageNum + 2) % 3 + 1;
          console.log(n);
          if (pageNum === 1) {
            driver2[1].get("https://www.amazon.co.jp/s?k=" + putKeyword + "&page=" + pageNum + "&node=" + node);
            driver2[2].get("https://www.amazon.co.jp/s?k=" + putKeyword + "&page=" + pageNum + "&node=" + node);
          }
          if (pageNum !== 1 && isFirstLoad) {
            driver2[(pageNum + 2) % 3 + 1].get("https://www.amazon.co.jp/s?k=" + putKeyword + "&page=" + pageNum + "&node=" + node);
            driver2[(pageNum + 3) % 3 + 1].get("https://www.amazon.co.jp/s?k=" + putKeyword + "&page=" + pageNum + "&node=" + node);
          }
          driver2[(pageNum + 1) % 3 + 1].get("https://www.amazon.co.jp/s?k=" + putKeyword + "&page=" + (pageNum + 1) + "&node=" + node);
          await driver2[n].wait(until.elementLocated(By.id("search")), 5e4);
          const numPerPage = await driver2[n].findElements(By.css(".s-result-item.s-asin"));
          const pageOverFlow = await driver2[n].findElement(By.css(".sg-col-14-of-20.sg-col.s-breadcrumb.sg-col-10-of-16.sg-col-6-of-12 .a-section.a-spacing-small.a-spacing-top-small span:nth-child(1)")).getText();
          const pageOverFlowArray = pageOverFlow.replace(" \u4EE5\u4E0A", "").split(" ");
          console.log(pageOverFlowArray);
          if (pageOverFlowArray[3]) {
            const currentNum = Number(pageOverFlowArray[3].split("-")[0].replace(",", ""));
            console.log(pageOverFlowArray[3].split("-")[1]);
            const limitNum = Number(pageOverFlowArray[3].split("-")[1].replace("\u4EF6", "").replace(",", ""));
            console.log(pageOverFlow);
            console.log(pageOverFlowArray[3]);
            console.log(currentNum, limitNum);
            if (currentNum > limitNum)
              break;
          }
          for (let i = 1; i <= numPerPage.length; i++) {
            const currentLatestLog2 = logsData.getLatestDoc() || {};
            let result = {};
            const el = await driver2[n].findElements(By.css(".s-result-item.s-asin:nth-child(" + i + ") h2.a-color-base"));
            console.log(i);
            const today = new Date();
            if (el.length) {
              const asin = await driver2[n].findElement(By.css(".s-result-item.s-asin:nth-child(" + i + ")")).getAttribute("data-asin");
              const priceExist = await driver2[n].findElements(By.css(".s-result-item.s-asin:nth-child(" + i + ") span.a-price-whole"));
              if (!((_b = itemsData.getDocById(asin)) == null ? void 0 : _b.id) && priceExist.length) {
                result.priceInJp = await driver2[n].findElement(By.css(".s-result-item.s-asin:nth-child(" + i + ") span.a-price-whole")).getText();
                const title = driver2[n].findElement(By.css(".s-result-item.s-asin:nth-child(" + i + ") h2.a-color-base > a"));
                const text = await title.getText();
                result.title = text;
                const href = await driver2[n].findElement(By.css(".s-result-item.s-asin:nth-child(" + i + ") h2.a-color-base > a")).getAttribute("href");
                result.link = "https://amazon.co.jp" + href;
                if (await driver2[n].findElements(By.css(".s-result-item.s-asin:nth-child(" + i + ") img.s-image"))) {
                  const src = await driver2[n].findElement(By.css(".s-result-item.s-asin:nth-child(" + i + ") img.s-image")).getAttribute("src");
                  result.imageLink = src;
                }
                result.asin = asin;
                result.id = asin;
                result.linkInUS = "https://amazon.com/dp/" + asin;
                result.keyword = putKeyword;
                result.categoryNode = node;
                result.created_at = today;
                result.category = categories[t].keyword;
                result.accessId = accessId;
                await ref.doc(result.asin).set(result);
                console.log(result);
                console.log(itemsData.getDocs().length);
              }
              isFirstLoad = false;
              const logInfo = {
                created_at: today,
                pageNum,
                itemNumAtPage: i,
                categoryNode: node,
                nodeIndex: t,
                searchText: putKeyword,
                searchTextIndex: j,
                accessId
              };
              await logRef.doc().set(logInfo);
            }
          }
          pageNum += 1;
        }
      }
    }
    console.log("fin");
    driver2[1].quit();
    driver2[2].quit();
    driver2[3].quit();
  } catch (err) {
    console.log(err);
    driver[1].quit();
    driver[2].quit();
    driver[3].quit();
  }
  return;
})();
