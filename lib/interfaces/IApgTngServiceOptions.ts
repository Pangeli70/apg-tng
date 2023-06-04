/** -----------------------------------------------------------------------
 * @module [apg-tng]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.0 [APG 2022/09/11] Beta
 * @version 0.9.4 [APG 2022/12/13] Configurable markup
 * ------------------------------------------------------------------------
 */
export interface IApgTngServiceOptions {
  useCache?: boolean;
  cacheChunksLongerThan?: number;
  consoleLog?: boolean;
  deliverablesPath?: string;
  beginMarkup?: string;
  endMarkup?: string;
}
