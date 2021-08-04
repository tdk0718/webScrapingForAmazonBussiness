var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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

// getUSInfo.js
var import_selenium_webdriver5 = __toModule(require("selenium-webdriver"));
var import_app = __toModule(require("firebase/app"));
var import_firestore = __toModule(require("firebase/firestore"));
var import_storage = __toModule(require("firebase/storage"));
var import_auth = __toModule(require("firebase/auth"));
var import_functions = __toModule(require("firebase/functions"));

// keepaInfo.js
var import_selenium_webdriver = __toModule(require("selenium-webdriver"));

// getAmazonUSInfo.js
var import_selenium_webdriver2 = __toModule(require("selenium-webdriver"));

// helper/keepaLogin.js
var import_selenium_webdriver3 = __toModule(require("selenium-webdriver"));
var { Builder, By, until } = import_selenium_webdriver3.default;
function keepaLogin(driver) {
  return new Promise(async (resolve, reject) => {
    try {
      await driver.get("https://keepa.com/#");
      await driver.wait(until.elementLocated(By.id("panelUserRegisterLogin")), 1e4);
      await driver.findElement(By.id("panelUserRegisterLogin")).click();
      await driver.findElement(By.id("username")).sendKeys("t.matsushita0718@gmail.com");
      await driver.findElement(By.id("password")).sendKeys("tadaki4281");
      await driver.findElement(By.id("submitLogin")).click();
      return resolve("ok");
    } catch (e) {
      reject(e);
    }
  });
}

// type/defaultData.js
var cellNameUS = [
  { text: "\u5546\u54C1\u540D", field: "USTitle", type: "String" },
  { text: "\u65B0\u54C1: \u73FE\u5728\u4FA1\u683C", field: "priceInUS", type: "Number", omit: ["$", ","] },
  { text: "ASIN", field: "asin", type: "String" }
];

// helper/helperFunctions.js
var import_fs = __toModule(require("fs"));
var import_fast_sort = __toModule(require("fast-sort"));
var is_windows = process.platform === "win32";
var is_mac = process.platform === "darwin";
var is_linux = process.platform === "linux";
var wait = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};
var listFiles = (dirPath) => {
  return new Promise(async (resolve, reject) => {
    try {
      let reDirPath = is_windows ? dirPath.replace(/¥/g, "\\") : dirPath;
      const files = [];
      const paths = import_fs.default.readdirSync(reDirPath);
      console.log("paths=>", paths);
      for (let name of paths) {
        try {
          if (name.indexOf("Product_Finder") !== -1) {
            const path = is_windows ? `${reDirPath}\xA5${name}` : `${reDirPath}/${name}`;
            const stat = import_fs.default.statSync(path.replace(/¥/g, "\\"));
            const { ctime } = stat;
            switch (true) {
              case stat.isFile():
                const sortNum = new Date(ctime);
                files.push({ path: path.replace(/¥/g, "\\"), sortNum: sortNum.getTime() });
                console.log(files);
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
      console.log(res[0]);
      return resolve(res[0]);
    } catch (e) {
      return reject(new Error(e));
    }
  });
};
var USfileRead = (path, cellName, ItemRef) => {
  return new Promise(async (resolve, reject) => {
    const fsRes = await import_fs.default.readFile(path, "utf-8", async (err, data) => {
      if (err)
        reject(err);
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
        console.log(t);
        try {
          await ItemRef.doc(recordData.asin).update(__spreadValues(__spreadValues({}, recordData), { update_at: new Date() }));
        } catch (e) {
        }
      }
      return resolve("ok");
      import_fs.default.unlinkSync(path);
    });
  });
};
var USlistFiles = (dirPath) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = [{ path: ".crdownload" }];
      while (res[0].path.indexOf(".crdownload") !== -1) {
        let reDirPath = is_windows ? dirPath.replace(/¥/g, "\\") : dirPath;
        const files = [];
        const paths = import_fs.default.readdirSync(reDirPath);
        for (let name of paths) {
          try {
            if (name.indexOf("Product_Viewer") !== -1) {
              const path = is_windows ? `${reDirPath}\xA5${name}` : `${reDirPath}/${name}`;
              const stat = import_fs.default.statSync(path.replace(/¥/g, "\\"));
              const { ctime } = stat;
              switch (true) {
                case stat.isFile():
                  const sortNum = new Date(ctime);
                  files.push({ path: path.replace(/¥/g, "\\"), sortNum: sortNum.getTime() });
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
        res = files.length ? (0, import_fast_sort.sort)(files).desc((e) => e.sortNum) : [{ path: ".crdownload" }];
        console.log(res);
      }
      return resolve(res[0]);
    } catch (e) {
      return reject(new Error(e));
    }
  });
};

// helper/seleniumHelper.js
var import_selenium_webdriver4 = __toModule(require("selenium-webdriver"));
var { Builder: Builder2, By: By2, until: until2 } = import_selenium_webdriver4.default;
function createDriver(capabilities) {
  return new Promise(async (resolve, reject) => {
    try {
      const driver = await new Builder2().withCapabilities(capabilities).build();
      return resolve(driver);
    } catch (e) {
      console.log(e);
      return;
    }
  });
}
function clickByCss(driver, css, timeout = 1e5) {
  return new Promise(async (resolve, reject) => {
    try {
      await driver.wait(until2.elementLocated(By2.css(css)), timeout);
      const actions = driver.actions();
      const element = await driver.findElement(By2.css(css));
      await actions.move({ origin: element }).click().perform();
      return resolve();
    } catch (e) {
      console.log(e);
      return reject(e);
    }
  });
}
function simpleClickByCss(driver, css, timeout = 1e5) {
  return new Promise(async (resolve, reject) => {
    try {
      await driver.wait(until2.elementLocated(By2.css(css)), timeout);
      const element = await driver.findElement(By2.css(css)).click();
      return resolve();
    } catch (e) {
      console.log(e);
      return reject(e);
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
      return resolve();
    } catch (e) {
      console.log(e);
      return;
    }
  });
}
function typeTextByCss(driver, css, text, timeout = 1e5) {
  return new Promise(async (resolve, reject) => {
    try {
      await driver.wait(until2.elementLocated(By2.css(css)), timeout);
      await driver.findElement(By2.css(css)).sendKeys(text);
      return resolve();
    } catch (e) {
      console.log(e);
      return resolve();
    }
  });
}

// getUSInfo.js
var is_windows2 = process.platform === "win32";
var is_mac2 = process.platform === "darwin";
var is_linux2 = process.platform === "linux";
var app = import_app.default.initializeApp({
  apiKey: "AIzaSyCj9Vxn7bQCy80iwxR8fB3HA9iGgySUrBI",
  authDomain: "webscrapingforbussiness.firebaseapp.com",
  projectId: "webscrapingforbussiness",
  storageBucket: "webscrapingforbussiness.appspot.com",
  messagingSenderId: "843243345021",
  appId: "1:843243345021:web:908bb33aaaeec9c59dcd14"
});
var current = new Date();
var currentDate = current.getFullYear() + "-" + (current.getMonth() + 1);
var itemsData = {
  itemDB: {},
  async stream() {
    try {
      console.log();
      await db.collection("Items").doc(currentDate).set({ created_at: current });
      const res = await db.collection(`ItemsJP/${currentDate}/Items`).get();
      res.forEach((el) => {
        const data = el.data();
        this.itemDB = __spreadProps(__spreadValues({}, this.itemDB), { [`${data.asin}`]: data });
      });
      await db.collection(`Items/${currentDate}/Items`).onSnapshot((res2) => {
        res2.forEach((el) => {
          const data = el.data();
          this.itemDB = __spreadProps(__spreadValues({}, this.itemDB), { [`${data.asin}`]: data });
        });
      });
    } catch (err) {
      console.log(err);
    }
  },
  getDocs(num = 1e5) {
    const result = Object.values(this.itemDB).filter((e) => !e.USTitle);
    return result.slice(0, num);
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
  },
  set(data) {
    return new Promise(async (resolve, reject) => {
      const id = data.id ? data.id : "";
      await db.collection(`ItemsJP/${currentDate}/Items`).doc(id).set(data);
    });
  }
};
var db = import_app.default.firestore(app);
async function getUSInfo(driver, datas) {
  return new Promise(async (resolve, reject) => {
    try {
      const capabilities = import_selenium_webdriver5.default.Capabilities.chrome();
      capabilities.set("chromeOptions", {});
      const ItemRef = await db.collection(`ItemsJP/${currentDate}/Items`);
      const driver2 = await createDriver(capabilities);
      keepaLogin(driver2);
      await itemsData.stream();
      await driver2.get("https://keepa.com/#");
      await gotoUrl(driver2, "https://keepa.com/#!viewer");
      const dfJp = is_mac2 ? "/Users/tadakimatsushita/Downloads" : "C:\xA5Users\xA5Administrator\xA5Downloads";
      const resJp = await listFiles(dfJp);
      await typeTextByCss(driver2, "#importInputFile", resJp.path);
      await clickByCss(driver2, "#importSubmit");
      await wait(1e3);
      await simpleClickByCss(driver2, ".relativeAlignCenter #shareChartOverlay-close4");
      await wait(1e3);
      await simpleClickByCss(driver2, "#grid-tools-viewer > div:nth-child(1) > span.tool__export > span", 9e3);
      await wait(1e3);
      await simpleClickByCss(driver2, "#exportSubmit");
      const df = is_mac2 ? "/Users/tadakimatsushita/Downloads" : "C:\xA5Users\xA5Administrator\xA5Downloads";
      const res = await USlistFiles(df);
      await USfileRead(res.path, cellNameUS, ItemRef);
    } catch (e) {
      reject(e);
    }
  });
}

// appTest.js
(async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await getUSInfo();
      return resolve();
    } catch (e) {
      return reject(e);
    }
  });
})();
