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
async function getEachInfoInUs(driver, info) {
  await driver.get(info.linkInUS);
  await driver.wait(until.elementLocated(By.id("nav-logo-sprites")), 5e4);
  const noImg = await driver.findElements(By.css("#g > div > a > img"));
  if (noImg.length) {
    const ref = await db.collection(`Items/${currentDate}/Items`).doc(info.id).update({ priceInUS: null });
  } else {
    const titleExist = await driver.findElements(By.id("productTitle"));
    console.log(titleExist);
    if (titleExist.length) {
      const USTitle = await driver.findElement(By.id("productTitle")).getText();
      console.log(USTitle);
      let priceInUS = null;
      const priceExist01 = await driver.findElements(By.id("price"));
      if (priceExist01.length) {
        priceInUS = await driver.findElement(By.id("price")).getText();
      }
      const priceExist02 = await driver.findElements(By.id("price_inside_buybox"));
      if (priceExist02.length) {
        priceInUS = await driver.findElement(By.id("price_inside_buybox")).getText();
      }
      priceInUS = Number(priceInUS == null ? void 0 : priceInUS.replace("$", ""));
      let priceInUSToYen = 0;
      let priceDeff = 0;
      if (priceInUS) {
        priceInUSToYen = priceInUS * 110;
        priceDeff = info.priceInJp - priceInUSToYen;
      }
      const ref = await db.collection(`Items/${currentDate}/Items`).doc(info.id).update({ priceInUSToYen, priceDeff, priceInUS, USTitle });
    } else {
      const ref = await db.collection(`Items/${currentDate}/Items`).doc(info.id).update({ priceInUS: null });
    }
  }
  return;
}
var itemsData = {
  itemDB: [],
  async stream() {
    return new Promise(async (resolve, reject) => {
      await db.collection("Items").doc(currentDate).set({ created_at: current });
      const getRes = await db.collection(`Items/${currentDate}/Items`).where("priceInUS", "==", "").get();
      const res = await db.collection(`Items/${currentDate}/Items`).where("priceInUS", "==", "").onSnapshot((res2) => {
        const result = [];
        res2.forEach((e) => {
          result.push(e.data());
        });
        const result02 = [];
        this.itemDB = result.length ? res2 : getRes;
        this.itemDB.forEach((e) => {
          result02.push(e.data());
        });
        if (result02) {
          resolve();
        }
      });
    });
  },
  getDocs() {
    const result = [];
    this.itemDB.forEach((el) => {
      result.push(el.data());
    });
    return result;
  },
  isHaveId(id) {
    const docs = this.getDocs();
    if (docs.find((el) => el.id === id))
      return true;
    return false;
  }
};
(async () => {
  try {
    await itemsData.stream();
    let isAllFin = false;
    let itemDataArray = [];
    const capabilities = import_selenium_webdriver.default.Capabilities.chrome();
    capabilities.set("chromeOptions", {
      args: ["--headless", "--no-sandbox", "--disable-gpu", `--window-size=1980,1200`]
    });
    const driver = [];
    for (let d = 0; d < 20; d++) {
      driver[d] = await new Builder().withCapabilities(capabilities).build();
    }
    let num = 0;
    while (!isAllFin) {
      const driverNum = num % 20;
      console.log(driverNum);
      itemDataArray = itemsData.getDocs();
      console.log("itemDataArray=>", itemDataArray[0].id);
      const ref = await db.collection(`Items/${currentDate}/Items`).doc(itemDataArray[0].id).update({ priceInUS: null });
      getEachInfoInUs(driver[driverNum], itemDataArray[0]);
      num += 1;
    }
  } catch (err) {
    console.log("err=>", err);
  }
  return;
})();
