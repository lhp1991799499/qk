/**
 * utils/utils
 */

import { assign } from "lodash";

import transformMath from "./transform-math";


const utils = assign(
  {},
  transformMath
);

export default utils;
