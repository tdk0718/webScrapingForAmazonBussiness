var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
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
var import_selenium_webdriver2 = __toModule(require("selenium-webdriver"));
var import_app = __toModule(require("firebase/app"));
var import_firestore = __toModule(require("firebase/firestore"));
var import_storage = __toModule(require("firebase/storage"));
var import_auth = __toModule(require("firebase/auth"));
var import_functions = __toModule(require("firebase/functions"));
var import_process = __toModule(require("process"));

// keepaInfo.js
var import_selenium_webdriver = __toModule(require("selenium-webdriver"));
var { Builder, By, until } = import_selenium_webdriver.default;
async function getKeepaInfo(driver, infoObject) {
  try {
    if (infoObject.id) {
      await driver.get("https://keepa.com/#!product/5-" + infoObject.id);
      try {
        await driver.wait(until.elementLocated(By.id("statisticss")), 5e3);
      } catch (e) {
        console.log(e);
      }
      await driver.wait(until.elementLocated(By.id("tabMore")), 1e5);
      await driver.findElement(By.id("tabMore")).click();
      await driver.wait(until.elementLocated(By.css("#grid-product-detail")), 1e5);
      let tableRow = await driver.findElements(By.css("#grid-product-detail .ag-row"));
      const result = {};
      console.log(tableRow.length);
      for (let h = 1; h <= tableRow.length; h++) {
        const num = await driver.findElements(By.css(".ag-row:nth-child(" + h + ") > div:nth-child(1)"));
        if (num.length) {
          const text = await driver.findElement(By.css(".ag-row:nth-child(" + h + ") > div:nth-child(1)")).getText();
          console.log(text);
          if (text === "Package - Dimension (cm\xB3)") {
            result.Dimension = await driver.findElement(By.css(".ag-row:nth-child(" + h + ") > div:nth-child(2)")).getText();
          }
          if (text === "Package - Weight (g)") {
            result.Weight = await driver.findElement(By.css(".ag-row:nth-child(" + h + ") > div:nth-child(2)")).getText();
          }
          if (text === "Reviews - \u8A55\u4FA1") {
            result.Reviews = await driver.findElement(By.css(".ag-row:nth-child(" + h + ") > div:nth-child(2)")).getText();
            result.Reviews = Number(result.Reviews.replace(/,/g, "").replace(/ /g, ""));
          }
          if (text === "Reviews - \u30EC\u30D3\u30E5\u30FC\u6570") {
            result.ReviewsNumber = await driver.findElement(By.css(".ag-row:nth-child(" + h + ") > div:nth-child(2)")).getText();
            result.ReviewsNumber = Number(result.ReviewsNumber.replace(/,/g, "").replace(/ /g, ""));
          }
        }
      }
      result.ranking = 1;
      tableRow = await driver.findElements(By.css("#grid-product-price .ag-row"));
      for (let h = 1; h <= tableRow.length; h++) {
        const num = await driver.findElements(By.css("#grid-product-price .ag-row:nth-child(" + h + ") > div:nth-child(1)"));
        if (num.length) {
          const text = await driver.findElement(By.css("#grid-product-price .ag-row:nth-child(" + h + ") > div:nth-child(1)")).getText();
          console.log(text);
          if (text === "\u58F2\u308C\u7B4B\u30E9\u30F3\u30AD\u30F3\u30B0 - \u73FE\u5728\u4FA1\u683C") {
            result.ranking = await driver.findElement(By.css("#grid-product-price .ag-row:nth-child(" + h + ") > div:nth-child(2)")).getText();
            result.ranking = Number(result.ranking.replace("# ", "").replace(/,/g, ""));
          }
          if (text === "\u65B0\u54C1\u30A2\u30A4\u30C6\u30E0\u6570 - \u73FE\u5728\u4FA1\u683C") {
            result.NewItemNum = await driver.findElement(By.css("#grid-product-price .ag-row:nth-child(" + h + ") > div:nth-child(2)")).getText();
            result.NewItemNum = Number(result.NewItemNum.replace(/,/g, "").replace(/ /g, ""));
          }
          if (text === "\u65B0\u54C1\u30A2\u30A4\u30C6\u30E0\u6570 - 90 days avg.") {
            result.NewItemNum90 = await driver.findElement(By.css("#grid-product-price .ag-row:nth-child(" + h + ") > div:nth-child(2)")).getText();
            result.NewItemNum90 = Number(result.NewItemNum90.replace(/,/g, "").replace(/ /g, ""));
          }
          if (text === "\u58F2\u308C\u7B4B\u30E9\u30F3\u30AD\u30F3\u30B0 - Drops last 30 days") {
            result.RankingDrop30 = await driver.findElement(By.css("#grid-product-price .ag-row:nth-child(" + h + ") > div:nth-child(2)")).getText();
            result.RankingDrop30 = Number(result.RankingDrop30.replace(/,/g, "").replace(/ /g, ""));
          }
          if (text === "\u58F2\u308C\u7B4B\u30E9\u30F3\u30AD\u30F3\u30B0 - Drops last 90 days") {
            result.RankingDrop90 = await driver.findElement(By.css("#grid-product-price .ag-row:nth-child(" + h + ") > div:nth-child(2)")).getText();
            result.RankingDrop90 = Number(result.RankingDrop90.replace(/,/g, "").replace(/ /g, ""));
          }
          if (text === "\u58F2\u308C\u7B4B\u30E9\u30F3\u30AD\u30F3\u30B0 - Drops last 180 days") {
            result.RankingDrop180 = await driver.findElement(By.css("#grid-product-price .ag-row:nth-child(" + h + ") > div:nth-child(2)")).getText();
            result.RankingDrop180 = Number(result.RankingDrop180.replace(/,/g, "").replace(/ /g, ""));
          }
        }
      }
      console.log(result);
      return { result };
    }
  } catch (e) {
    console.log(e);
  }
  return;
}

// app.js
var import_fast_sort = __toModule(require("fast-sort"));
var fs = require("fs");
var { Builder: Builder2, By: By2, until: until2 } = import_selenium_webdriver2.default;
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
    console.log(node);
    await db.collection("Items").doc(currentDate).set({ created_at: current });
    await db.collection(`Items/${currentDate}/Items`).where("categoryNode", "==", node).onSnapshot((res) => {
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
    await db.collection(`Logs/${currentDate}/Logs`).onSnapshot((res) => {
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
  var _a, _b, _c;
  try {
    const accessId = createNewAccessId();
    let isFirstLoad = true;
    let isExistTodayLog = false;
    let isFinishGetForThisNode = false;
    console.log("start");
    await logsData.stream();
    const logRef = await db.collection(`Logs/${currentDate}/Logs`);
    const capabilities = import_selenium_webdriver2.default.Capabilities.chrome();
    capabilities.set("chromeOptions", {
      args: ["--headless", "--no-sandbox", "--disable-gpu", `--window-size=1980,1200`]
    });
    const driver = [];
    driver[1] = await new Builder2().withCapabilities(capabilities).build();
    driver[2] = await new Builder2().withCapabilities(capabilities).build();
    driver[3] = await new Builder2().withCapabilities(capabilities).build();
    await driver[1].get("https://www.google.co.jp/search?q=%E3%83%89%E3%83%AB%E3%80%80%E6%97%A5%E6%9C%AC%E3%80%80&newwindow=1&sxsrf=ALeKk02FiS2ljVzmM6I_ssSrneI7HG49fQ%3A1622019947152&ei=aw-uYN7pCOuGr7wPsKqeGA&oq=%E3%83%89%E3%83%AB%E3%80%80%E6%97%A5%E6%9C%AC%E3%80%80&gs_lcp=Cgdnd3Mtd2l6EAMyBQgAEMQCMgYIABAHEB4yBggAEAcQHjIGCAAQBxAeMgYIABAHEB4yBggAEAcQHjIGCAAQBxAeMgYIABAHEB46CQgAELADEAQQJToJCAAQsAMQBxAeOgQIIxAnOggIABCxAxCDAToFCAAQsQNQ1hhY4SRgkShoAXAAeACAAcQBiAG5BZIBAzAuNJgBAKABAaABAqoBB2d3cy13aXrIAQjAAQE&sclient=gws-wiz&ved=0ahUKEwiey5KW_-bwAhVrw4sBHTCVBwMQ4dUDCA4&uact=5");
    const dolen = await driver[1].findElement(By2.css("#knowledge-currency__updatable-data-column > div:nth-child(1) > div:nth-child(2) > span:nth-child(1)")).getText();
    const driverInKeepa = await new Builder2().withCapabilities(capabilities).build();
    await driverInKeepa.get("https://keepa.com/#");
    await driverInKeepa.wait(until2.elementLocated(By2.id("panelUserRegisterLogin")), 1e4);
    await driverInKeepa.findElement(By2.id("panelUserRegisterLogin")).click();
    await driverInKeepa.findElement(By2.id("username")).sendKeys("t.matsushita0718@gmail.com");
    await driverInKeepa.findElement(By2.id("password")).sendKeys("tadaki4281");
    await driverInKeepa.findElement(By2.id("submitLogin")).click();
    const driverInKeepaInJP = await new Builder2().withCapabilities(capabilities).build();
    await driverInKeepaInJP.get("https://keepa.com/#");
    await driverInKeepaInJP.wait(until2.elementLocated(By2.id("panelUserRegisterLogin")), 1e4);
    await driverInKeepaInJP.findElement(By2.id("panelUserRegisterLogin")).click();
    await driverInKeepaInJP.findElement(By2.id("username")).sendKeys("t.matsushita0718@gmail.com");
    await driverInKeepaInJP.findElement(By2.id("password")).sendKeys("tadaki4281");
    await driverInKeepaInJP.findElement(By2.id("submitLogin")).click();
    const ref = await db.collection(`Items/${currentDate}/Items`);
    let logsDataObj;
    logsDataObj = logsData.getLatestDoc();
    console.log(logsDataObj);
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
          console.log(currentLatestLog);
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
              isFinishGetForThisNode = false;
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
            driver[1].get("https://www.amazon.co.jp/s?k=" + putKeyword + "&page=" + pageNum + "&node=" + node);
            driver[2].get("https://www.amazon.co.jp/s?k=" + putKeyword + "&page=" + pageNum + "&node=" + node);
          }
          if (pageNum !== 1 && isFirstLoad) {
            driver[(pageNum + 2) % 3 + 1].get("https://www.amazon.co.jp/s?k=" + putKeyword + "&page=" + pageNum + "&node=" + node);
            driver[(pageNum + 3) % 3 + 1].get("https://www.amazon.co.jp/s?k=" + putKeyword + "&page=" + pageNum + "&node=" + node);
          }
          driver[(pageNum + 1) % 3 + 1].get("https://www.amazon.co.jp/s?k=" + putKeyword + "&page=" + (pageNum + 1) + "&node=" + node);
          await driver[n].wait(until2.elementLocated(By2.id("search")), 5e4);
          const numPerPage = await driver[n].findElements(By2.css(".s-result-item.s-asin"));
          const pageOverFlowExist = await driver[n].findElements(By2.css(".sg-col.s-breadcrumb.sg-col-10-of-16.sg-col-6-of-12 .a-section.a-spacing-small.a-spacing-top-small span:nth-child(1)"));
          let pageOverFlow = "";
          if (pageOverFlowExist.length) {
            pageOverFlow = await driver[n].findElement(By2.css(".sg-col.s-breadcrumb.sg-col-10-of-16.sg-col-6-of-12 .a-section.a-spacing-small.a-spacing-top-small span:nth-child(1)")).getText();
          }
          const pageOverFlowArray = (_b = pageOverFlow == null ? void 0 : pageOverFlow.replace(" \u4EE5\u4E0A", "")) == null ? void 0 : _b.split(" ");
          console.log(pageOverFlowArray);
          if (pageOverFlowArray[3]) {
            const currentNum = Number(pageOverFlowArray[3].split("-")[0].replace(",", ""));
            console.log(pageOverFlowArray[3].split("-")[1]);
            const limitNum = Number(pageOverFlowArray[3].split("-")[1].replace("\u4EF6", "").replace(",", ""));
            if (currentNum > limitNum) {
              isFinishGetForThisNode = true;
              break;
            }
          }
          if (!pageOverFlow) {
            isFinishGetForThisNode = true;
            break;
          }
          for (let i = 1; i <= numPerPage.length; i++) {
            const currentLatestLog2 = logsData.getLatestDoc() || {};
            let result = {};
            const el = await driver[n].findElements(By2.css(".s-result-item.s-asin:nth-child(" + i + ") h2.a-color-base"));
            console.log(i);
            const today = new Date();
            if (el.length) {
              const asin = await driver[n].findElement(By2.css(".s-result-item.s-asin:nth-child(" + i + ")")).getAttribute("data-asin");
              const priceExist = await driver[n].findElements(By2.css(".s-result-item.s-asin:nth-child(" + i + ") span.a-price-whole"));
              if (priceExist.length) {
                let priceInJp = await driver[n].findElement(By2.css(".s-result-item.s-asin:nth-child(" + i + ") span.a-price-whole")).getText();
                priceInJp = priceInJp.replace(/,/g, "").replace("\uFFE5", "");
                if (Number(priceInJp) > 3e3 && !((_c = itemsData.getDocById(asin)) == null ? void 0 : _c.id)) {
                  await driverInKeepa.get("https://keepa.com/#!product/1-" + asin);
                  try {
                    await driverInKeepa.wait(until2.elementLocated(By2.css("span.priceNew")), 1e3);
                    const amazonPriceInUSNumber = await driverInKeepa.findElements(By2.css("span.priceAmazon"));
                    const newPriceInUSNumber = await driverInKeepa.findElements(By2.css("span.priceNew"));
                    if (amazonPriceInUSNumber.length || newPriceInUSNumber.length) {
                      const amazonPriceInUS = amazonPriceInUSNumber.length ? await driverInKeepa.findElement(By2.css("span.priceAmazon")).getText() : 0;
                      const newPriceInUS = newPriceInUSNumber.length ? await driverInKeepa.findElement(By2.css("span.priceNew")).getText() : 0;
                      result.priceInJp = Number(priceInJp);
                      const title = driver[n].findElement(By2.css(".s-result-item.s-asin:nth-child(" + i + ") h2.a-color-base > a"));
                      const stars = await driver[n].findElements(By2.css(".s-result-item.s-asin:nth-child(" + i + ") i.a-icon-star-small span.a-icon-alt"));
                      const star = stars.length ? await driver[n].findElement(By2.css(".s-result-item.s-asin:nth-child(" + i + ") i.a-icon-star-small span.a-icon-alt")).getText() : "";
                      const text = await title.getText();
                      result.title = text;
                      result.star = Number(star.replace("5\u3064\u661F\u306E\u3046\u3061", ""));
                      result.link = "https://amazon.co.jp/dp/" + asin;
                      result.asin = asin;
                      result.id = asin;
                      result.linkInUS = "https://amazon.com/dp/" + asin;
                      result.keyword = putKeyword;
                      result.categoryNode = node;
                      result.amazonPriceInUS = Number(amazonPriceInUS.replace("$ ", "").replace(/,/g, ""));
                      console.log(newPriceInUS);
                      result.newPriceInUS = Number(newPriceInUS.replace("$ ", "").replace(/,/g, ""));
                      result.created_at = today;
                      result.dolen = Number(dolen);
                      result.amazonPriceInUSToYen = result.dolen * result.amazonPriceInUS;
                      result.newPriceInUSToYen = result.dolen * result.newPriceInUS;
                      result.category = categories[t].keyword;
                      result.accessId = accessId;
                      result.ranking = 0;
                      const keepaInJP = await getKeepaInfo(driverInKeepaInJP, result);
                      result = __spreadValues(__spreadValues({}, result), keepaInJP.result);
                      await ref.doc(result.asin).set(result);
                      console.log(result);
                      console.log("num=>", itemsData.getDocs().length);
                    }
                  } catch (e) {
                  }
                }
              }
              isFirstLoad = false;
            }
          }
          const logInfo = {
            created_at: new Date(),
            pageNum,
            categoryNode: node,
            nodeIndex: t,
            searchText: putKeyword,
            searchTextIndex: j,
            accessId
          };
          await logRef.doc().set(logInfo);
          pageNum += 1;
        }
      }
    }
    console.log("fin");
    driver[1].quit();
    driver[2].quit();
    driver[3].quit();
  } catch (err) {
    console.log(err);
  }
  return;
})();
