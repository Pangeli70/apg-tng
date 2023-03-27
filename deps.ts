/** -----------------------------------------------------------------------
 * @module [Tng/Dependencies]
 * @author [APG] ANGELI Paolo Giusto
 * ------------------------------------------------------------------------
*/
// https://deno.land/std
export * as StdFs from "https://deno.land/std@0.180.0/fs/mod.ts";
export * as StdPath from "https://deno.land/std@0.180.0/path/mod.ts";

//https://deno.land/x/dotenv
export * as DotEnv from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

// https://deno.land/x/drash
export * as  Drash from "https://deno.land/x/drash@v2.7.1/mod.ts";

// https://deno.land/x/drash_middleware
export { CORSService as DrashCorsService } from "https://deno.land/x/drash@v2.7.1/src/services/cors/cors.ts";

// https://github

export * as Uts from "https://raw.githubusercontent.com/Pangeli70/apg-uts/master/mod.ts";
export * as Edr from "https://raw.githubusercontent.com/Pangeli70/apg-edr/master/mod.ts";

// export * as Uts from "../apg-uts/mod.ts";
// export * as Edr from "../apg-edr/mod.ts";