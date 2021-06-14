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
var itemsData = {
  itemDB: [],
  async stream() {
    await db.collection("Items").doc(currentDate).set({ created_at: current });
    await db.collection(`Items/${currentDate}/Items`).where("ranking", "==", 0).onSnapshot((res) => {
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
(async () => {
  try {
    await itemsData.stream();
    const dbItem = await db.collection(`Items/${currentDate}/Items`);
    const capabilities = import_selenium_webdriver.default.Capabilities.chrome();
    capabilities.set("chromeOptions", {
      args: ["--headless", "--no-sandbox", "--disable-gpu", `--window-size=1980,1200`]
    });
    const driver = await new Builder().withCapabilities(capabilities).build();
    await driver.get("https://keepa.com/#");
    await driver.wait(until.elementLocated(By.id("panelUserRegisterLogin")), 1e4);
    await driver.findElement(By.id("panelUserRegisterLogin")).click();
    await driver.findElement(By.id("username")).sendKeys("t.matsushita0718@gmail.com");
    await driver.findElement(By.id("password")).sendKeys("tadaki4281");
    await driver.findElement(By.id("submitLogin")).click();
    let ref = await itemsData.getDocs();
    while (ref.length) {
      ref = await itemsData.getDocs();
      const infoObject = ref[0];
      await driver.get("https://keepa.com/#!product/5-" + infoObject.id);
      await driver.wait(until.elementLocated(By.id("tabMore")), 1e5);
      await driver.findElement(By.css("li#tabMore")).click();
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
          }
          if (text === "Reviews - \u30EC\u30D3\u30E5\u30FC\u6570") {
            result.ReviewsNumber = await driver.findElement(By.css(".ag-row:nth-child(" + h + ") > div:nth-child(2)")).getText();
          }
        }
      }
      tableRow = await driver.findElements(By.css("#grid-product-price .ag-row"));
      for (let h = 1; h <= tableRow.length; h++) {
        const num = await driver.findElements(By.css("#grid-product-price .ag-row:nth-child(" + h + ") > div:nth-child(1)"));
        if (num.length) {
          const text = await driver.findElement(By.css("#grid-product-price .ag-row:nth-child(" + h + ") > div:nth-child(1)")).getText();
          console.log(text);
          if (text === "\u58F2\u308C\u7B4B\u30E9\u30F3\u30AD\u30F3\u30B0 - \u73FE\u5728\u4FA1\u683C") {
            result.ranking = await driver.findElement(By.css("#grid-product-price .ag-row:nth-child(" + h + ") > div:nth-child(2)")).getText();
          }
          if (text === "\u65B0\u54C1\u30A2\u30A4\u30C6\u30E0\u6570 - \u73FE\u5728\u4FA1\u683C") {
            result.NewItemNum = await driver.findElement(By.css("#grid-product-price .ag-row:nth-child(" + h + ") > div:nth-child(2)")).getText();
          }
          if (text === "\u65B0\u54C1\u30A2\u30A4\u30C6\u30E0\u6570 - 90 days avg.") {
            result.NewItemNum90 = await driver.findElement(By.css("#grid-product-price .ag-row:nth-child(" + h + ") > div:nth-child(2)")).getText();
          }
          if (text === "\u58F2\u308C\u7B4B\u30E9\u30F3\u30AD\u30F3\u30B0 - Drops last 30 days") {
            result.RankingDrop30 = await driver.findElement(By.css("#grid-product-price .ag-row:nth-child(" + h + ") > div:nth-child(2)")).getText();
          }
          if (text === "\u58F2\u308C\u7B4B\u30E9\u30F3\u30AD\u30F3\u30B0 - Drops last 90 days") {
            result.RankingDrop90 = await driver.findElement(By.css("#grid-product-price .ag-row:nth-child(" + h + ") > div:nth-child(2)")).getText();
          }
          if (text === "\u58F2\u308C\u7B4B\u30E9\u30F3\u30AD\u30F3\u30B0 - Drops last 180 days") {
            result.RankingDrop180 = await driver.findElement(By.css("#grid-product-price .ag-row:nth-child(" + h + ") > div:nth-child(2)")).getText();
          }
        }
      }
      console.log(result);
      dbItem.doc(infoObject.id).update(result);
    }
    driver.quit();
  } catch (err) {
    console.log(err);
  }
  return;
})();
