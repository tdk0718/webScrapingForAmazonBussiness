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
var import_selenium_webdriver6 = __toModule(require("selenium-webdriver"));
var import_app = __toModule(require("firebase/app"));
var import_firestore = __toModule(require("firebase/firestore"));
var import_storage = __toModule(require("firebase/storage"));
var import_auth = __toModule(require("firebase/auth"));
var import_functions = __toModule(require("firebase/functions"));
var import_process = __toModule(require("process"));

// keepaInfo.js
var import_selenium_webdriver = __toModule(require("selenium-webdriver"));

// getAmazonUSInfo.js
var import_selenium_webdriver2 = __toModule(require("selenium-webdriver"));

// helper/getUSDoler.js
var import_selenium_webdriver3 = __toModule(require("selenium-webdriver"));

// helper/keepaLogin.js
var import_selenium_webdriver4 = __toModule(require("selenium-webdriver"));
var { Builder, By, until } = import_selenium_webdriver4.default;
function keepaLogin(driver) {
  return new Promise(async (resolve, reject) => {
    try {
      await driver.get("https://keepa.com/#");
      await driver.wait(until.elementLocated(By.id("panelUserRegisterLogin")), 1e4);
      await driver.findElement(By.id("panelUserRegisterLogin")).click();
      await driver.findElement(By.id("username")).sendKeys("t.matsushita0718@gmail.com");
      await driver.findElement(By.id("password")).sendKeys("tadaki4281");
      await driver.findElement(By.id("submitLogin")).click();
      resolve("ok");
    } catch (e) {
      reject(e);
    }
  });
}

// app.js
var import_fast_sort = __toModule(require("fast-sort"));
var import_fs = __toModule(require("fs"));

// helper/seleniumHelper.js
var import_selenium_webdriver5 = __toModule(require("selenium-webdriver"));
var { Builder: Builder2, By: By2, until: until2 } = import_selenium_webdriver5.default;
function createDriver(capabilities) {
  return new Promise(async (resolve, reject) => {
    try {
      const driver = await new Builder2().withCapabilities(capabilities).build();
      resolve(driver);
    } catch (e) {
      console.log(e);
    }
  });
}
function getTextByCss(driver, css, timeout = 1e5) {
  return new Promise(async (resolve, reject) => {
    try {
      await driver.wait(until2.elementLocated(By2.css(css)), timeout);
      const result = await driver.findElement(By2.css(css)).getText();
      resolve(result);
    } catch (e) {
      console.log(e);
      resolve("");
    }
  });
}
function clickByCss(driver, css, timeout = 1e5) {
  return new Promise(async (resolve, reject) => {
    try {
      await driver.wait(until2.elementLocated(By2.css(css)), timeout);
      await driver.findElement(By2.css(css)).click();
      resolve();
    } catch (e) {
      console.log(e);
    }
  });
}
function gotoUrl(driver, url) {
  return new Promise(async (resolve, reject) => {
    try {
      let currentUrl = await driver.getCurrentUrl();
      while (decodeURI(currentUrl) !== decodeURI(url)) {
        await driver.get(url);
        currentUrl = await driver.getCurrentUrl();
      }
      resolve();
    } catch (e) {
      console.log(e);
    }
  });
}
function waitEl(driver, css, seconds = 1e5) {
  return new Promise(async (resolve, reject) => {
    try {
      await driver.wait(until2.elementLocated(By2.css(css)), seconds);
      resolve("ok");
    } catch (e) {
      console.log(e);
    }
  });
}

// type/defaultData.js
var categories = [
  { code: 2016929051, keyword: "DIY\u30FB\u5DE5\u5177\u30FB\u30AC\u30FC\u30C7\u30F3" },
  { code: 561958, keyword: "DVD" },
  { code: 637392, keyword: "PC\u30BD\u30D5\u30C8" },
  { code: 13299531, keyword: "\u304A\u3082\u3061\u3083" },
  { code: 637394, keyword: "\u30B2\u30FC\u30E0\xA0" },
  { code: 2016926051, keyword: "\u30B7\u30E5\u30FC\u30BA&\u30D0\u30C3\u30B0" },
  { code: 85895051, keyword: "\u30B8\u30E5\u30A8\u30EA\u30FC" },
  { code: 14304371, keyword: "\u30B9\u30DD\u30FC\u30C4&\u30A2\u30A6\u30C8\u30C9\u30A2\xA0" },
  { code: 2128134051, keyword: "\u30C7\u30B8\u30BF\u30EB\u30DF\u30E5\u30FC\u30B8\u30C3\u30AF" },
  { code: 2127209051, keyword: "\u30D1\u30BD\u30B3\u30F3\u30FB\u5468\u8FBA\u6A5F\u5668\xA0" },
  { code: 2229202051, keyword: "\u30D5\u30A1\u30C3\u30B7\u30E7\u30F3" }
];
var keywords = [
  "\u4E26\u884C\u8F38\u5165",
  "\u8F38\u5165",
  "import",
  "\u30A4\u30F3\u30DD\u30FC\u30C8",
  "\u6D77\u5916",
  "\u5317\u7C73",
  "\u56FD\u540D",
  "\u65E5\u672C\u672A\u767A\u58F2"
];
var cellName = [
  { text: "Item: Weight (g)", field: "Weight", type: "Number" },
  { text: "\u5546\u54C1\u540D", field: "title", type: "String" },
  { text: "Reviews: \u30EC\u30D3\u30E5\u30FC\u6570", field: "ReviewsNumber", type: "Number" },
  { text: "Reviews: \u8A55\u4FA1", field: "Reviews", type: "Number" },
  { text: "\u58F2\u308C\u7B4B\u30E9\u30F3\u30AD\u30F3\u30B0: Drops last 90 days", field: "RankingDrop90", type: "Number" },
  { text: "\u58F2\u308C\u7B4B\u30E9\u30F3\u30AD\u30F3\u30B0: Drops last 30 days", field: "RankingDrop30", type: "Number" },
  { text: "\u58F2\u308C\u7B4B\u30E9\u30F3\u30AD\u30F3\u30B0: Drops last 180 days", field: "RankingDrop180", type: "Number" },
  { text: "\u58F2\u308C\u7B4B\u30E9\u30F3\u30AD\u30F3\u30B0: \u73FE\u5728\u4FA1\u683C", field: "ranking", type: "Number", omit: [","] },
  { text: "\u65B0\u54C1: \u73FE\u5728\u4FA1\u683C", field: "priceInJp", type: "Number", omit: ["\xA5 ", ","] },
  { text: "\u65B0\u54C1\u30A2\u30A4\u30C6\u30E0\u6570: 90 days avg.", field: "NewItemNum90", type: "Number" },
  { text: "\u65B0\u54C1\u30A2\u30A4\u30C6\u30E0\u6570: \u73FE\u5728\u4FA1\u683C", field: "NewItemNum", type: "Number" },
  { text: "\u30AB\u30C6\u30B4\u30EA: Root", field: "category", type: "String" },
  { text: "ASIN", field: "asin", type: "String" },
  { text: "Package: Dimension (cm\xB3)", field: "PackageDimension", type: "String" },
  { text: "Item: Dimension (cm\xB3)", field: "ItemDimension", type: "String" }
];

// app.js
var listFiles = (dirPath) => {
  const files = [];
  const paths = import_fs.default.readdirSync(dirPath);
  for (let name of paths) {
    try {
      if (name.indexOf("Product_Finder") !== -1) {
        const path = `${dirPath}/${name}`;
        const stat = import_fs.default.statSync(path);
        const { ctime } = stat;
        switch (true) {
          case stat.isFile():
            const sortNum = new Date(ctime);
            files.push({ path, sortNum: sortNum.getTime() });
            break;
          case stat.isDirectory():
            break;
          default:
        }
      }
    } catch (err) {
      console.error("error:", err.message);
    }
  }
  const res = (0, import_fast_sort.sort)(files).desc((e) => e.sortNum);
  return res[0];
};
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
var currentDate = current.getFullYear() + "-" + (current.getMonth() + 1);
function createNewAccessId() {
  const LENGTH = 20;
  const SOURCE = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
  let NewId = "";
  for (let i = 0; i < LENGTH; i++) {
    NewId += SOURCE[Math.floor(Math.random() * SOURCE.length)];
  }
  return NewId;
}
async function getAmazonInfo() {
  const accessId = createNewAccessId();
  const jpItemRef = await db.collection(`ItemsJP/${currentDate}/Items`);
  console.log("start");
  const capabilities = import_selenium_webdriver6.default.Capabilities.chrome();
  capabilities.set("chromeOptions", {
    args: ["--headless", "--no-sandbox", "--disable-gpu", `--window-size=1980,400`],
    prefs: { "download.default_directory": "./file" }
  });
  const driver = await createDriver(capabilities);
  await keepaLogin(driver);
  for (let i = 0; i <= keywords.length - 1; i++) {
    for (let j = 0; j <= categories.length - 1; j++) {
      await gotoUrl(driver, 'https://keepa.com/#!finder/{"f":{"title":{"filterType":"text","type":"contains","filter":"' + keywords[i] + '"},"SALES_deltaPercent90":{"filterType":"number","type":"greaterThanOrEqual","filter":1,"filterTo":null},"COUNT_NEW_current":{"filterType":"number","type":"greaterThanOrEqual","filter":1,"filterTo":null},"rootCategory":{"filterType":"singleChoice","filter":"' + categories[j] + '","type":"equals"}},"s":[{"colId":"SALES_current","sort":"asc"}],"t":"g"}');
      let isComp = false;
      await clickByCss(driver, "#grid-tools-finder > div:nth-child(1) > span.tool__row.mdc-menu-anchor");
      await clickByCss(driver, "#tool-row-menu > ul > li:nth-child(7)");
      while (!isComp) {
        await waitEl(driver, ".cssload-box-loading", 1e3);
        await waitEl(driver, "#grid-asin-finder > div > div.ag-root-wrapper-body.ag-layout-normal > div.ag-root.ag-unselectable.ag-layout-normal > div.ag-body-viewport.ag-layout-normal.ag-row-no-animation > div.ag-center-cols-clipper > div > div > div:nth-child(1) > div:nth-child(3) > a > span", 1e7);
        await clickByCss(driver, "#grid-tools-finder > div:nth-child(1) > span.tool__export > span");
        await clickByCss(driver, "#exportSubmit");
        const res = await listFiles("/Users/tadakimatsushita/Downloads");
        await import_fs.default.readFile(res.path, "utf-8", async (err, data) => {
          if (err)
            throw err;
          const lines = data.split("\n");
          const fieldTitle = lines[0].split('","').reduce((arr, element) => {
            const cellInfo = cellName.find((e) => {
              return element.replace(/"/g, "") === e.text;
            });
            if (cellInfo) {
              return [
                ...arr,
                {
                  index: lines[0].split('","').findIndex((el) => el === element),
                  field: cellInfo.field
                }
              ];
            }
            return arr;
          }, []);
          console.log(fieldTitle);
          lines.shift();
          for (let t = 0; t < lines.length; t++) {
            const eachLine = lines[t];
            const recordData = eachLine.split('","').reduce((obj, val, index) => {
              const getField = fieldTitle.find((title) => title.index === index);
              if (getField) {
                const getFieldInfo = cellName.find((f) => f.field === getField.field);
                let revisedVal = val.replace(/"/g, "");
                if (getFieldInfo == null ? void 0 : getFieldInfo.omit) {
                  revisedVal = getFieldInfo.omit.reduce((st, el) => {
                    return st.replace(el, "");
                  }, revisedVal);
                }
                if ((getFieldInfo == null ? void 0 : getFieldInfo.type) === "Number") {
                  revisedVal = Number(revisedVal);
                }
                return __spreadValues(__spreadValues({}, obj), { [`${getField.field}`]: revisedVal });
              }
              return obj;
            }, {});
            await jpItemRef.doc(recordData.asin).set(__spreadValues(__spreadValues({}, recordData), { created_at: new Date(), accessId }));
          }
        });
        import_fs.default.unlinkSync(res.path);
        const total = await getTextByCss(driver, "#grid-asin-finder > div > div.ag-paging-panel.ag-unselectable > span.ag-paging-page-summary-panel > span:nth-child(4)");
        const current2 = await getTextByCss(driver, "#grid-asin-finder > div > div.ag-paging-panel.ag-unselectable > span.ag-paging-page-summary-panel > span:nth-child(3)");
        if (total !== current2) {
          clickByCss(driver, "#grid-asin-finder > div > div.ag-paging-panel.ag-unselectable > span.ag-paging-page-summary-panel > div:nth-child(5) > button");
        }
      }
    }
  }
  console.log("fin");
  driver.quit();
  return;
}
(async () => {
  try {
    await getAmazonInfo();
  } catch (e) {
    console.log(e);
  }
})();