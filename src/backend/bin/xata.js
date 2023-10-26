"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getXataClient = exports.XataClient = void 0;
// Generated by Xata Codegen 0.26.9. Please do not edit.
const client_1 = require("@xata.io/client");
/** @typedef { import('./types').SchemaTables } SchemaTables */
/** @type { SchemaTables } */
const tables = [
  {
    name: "users",
    columns: [
      { name: "email", type: "email", unique: true },
      { name: "password", type: "string", notNull: true, defaultValue: "" },
      { name: "username", type: "string", unique: true },
    ],
    revLinks: [
      { column: "user_id", table: "documents" },
      { column: "user_id", table: "privileges" },
    ],
  },
  {
    name: "documents",
    columns: [
      { name: "url", type: "string", unique: true },
      { name: "user_id", type: "link", link: { table: "users" } },
      { name: "documentPrivacy", type: "bool", defaultValue: "true" },
    ],
    revLinks: [{ column: "document_id", table: "privileges" }],
  },
  {
    name: "privileges",
    columns: [
      { name: "document_id", type: "link", link: { table: "documents" } },
      { name: "user_id", type: "link", link: { table: "users" } },
      {
        name: "privilage_edit",
        type: "bool",
        notNull: true,
        defaultValue: "false",
      },
    ],
  },
];
/** @type { import('@xata.io/client').ClientConstructor<{}> } */
const DatabaseClient = (0, client_1.buildClient)();
const defaultOptions = {
  databaseURL: process.env.DATABASE_URL,
};
/** @typedef { import('./types').DatabaseSchema } DatabaseSchema */
/** @extends DatabaseClient<DatabaseSchema> */
class XataClient extends DatabaseClient {
  constructor(options) {
    super({ ...defaultOptions, ...options }, tables);
  }
}
exports.XataClient = XataClient;
let instance = undefined;
/** @type { () => XataClient } */
const getXataClient = () => {
  if (instance) return instance;
  instance = new XataClient();
  return instance;
};
exports.getXataClient = getXataClient;
