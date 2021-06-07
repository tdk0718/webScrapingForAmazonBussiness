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
    const res = await db.collection(`Items/${currentDate}/Items`).get();
    this.itemDB = res;
    console.log(res);
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
    itemDataArray = itemsData.getDocs();
    console.log("itemDataArray=>", itemDataArray);
  } catch (err) {
    console.log("err=>", err);
  }
  return;
})();
