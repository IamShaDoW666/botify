"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// types.ts
var types_exports = {};
__export(types_exports, {
  phoneNumberSchema: () => phoneNumberSchema
});
module.exports = __toCommonJS(types_exports);
var import_zod = __toESM(require("zod"));
var import_libphonenumber_js = require("libphonenumber-js");
var phoneNumberSchema = import_zod.default.string().transform((value, ctx) => {
  const cleanedValue = value.replace(/\D/g, "");
  const phoneNumber = (0, import_libphonenumber_js.parsePhoneNumberFromString)(cleanedValue, "IN");
  if (!phoneNumber) {
    ctx.addIssue({
      code: "custom",
      message: "Please provide a valid phone number.",
      fatal: true
    });
  }
  if (!phoneNumber || !phoneNumber.isValid() || !phoneNumber.isPossible()) {
    ctx.addIssue({
      code: "custom",
      message: "Invalid phone number. Please check the format.",
      fatal: true
    });
    return import_zod.default.NEVER;
  }
  return phoneNumber.format("E.164");
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  phoneNumberSchema
});
