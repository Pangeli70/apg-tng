/** -----------------------------------------------------------------------
 * @module [Tng/Services]
 * @author [APG] ANGELI Paolo Giusto
 * ------------------------------------------------------------------------
*/
import { DrashCorsService, Drash } from "./deps.ts";

export const services: Drash.Service[] = [
    new DrashCorsService()
];