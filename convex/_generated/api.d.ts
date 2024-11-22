/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as allowlist from "../allowlist.js";
import type * as auth from "../auth.js";
import type * as chatHistory from "../chatHistory.js";
import type * as http from "../http.js";
import type * as openai from "../openai.js";
import type * as process from "../process.js";
import type * as queryRewrite from "../queryRewrite.js";
import type * as search from "../search.js";
import type * as session from "../session.js";
import type * as tasks from "../tasks.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  allowlist: typeof allowlist;
  auth: typeof auth;
  chatHistory: typeof chatHistory;
  http: typeof http;
  openai: typeof openai;
  process: typeof process;
  queryRewrite: typeof queryRewrite;
  search: typeof search;
  session: typeof session;
  tasks: typeof tasks;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
