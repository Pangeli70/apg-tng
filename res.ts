/** -----------------------------------------------------------------------
 * @module [Tng/Resources]
 * @author [APG] ANGELI Paolo Giusto
 * ------------------------------------------------------------------------
*/
import { Drash } from "./deps.ts";
import { Edr }  from "./deps.ts";
import * as res from "./resources/mod.ts";

export const resources: typeof Drash.Resource[] = [

    // Static
    Edr.ApgEdrPublicTextFileResource,
    Edr.ApgEdrPublicBinFileResource,

    // Tng
    res.ApgTngHomeResource,
    res.ApgTngExamplesResource,
    res.ApgTngAaBasicExampleResource,
    res.ApgTngAaBasicTutorialResource,
    res.ApgTngDeliverResource,
    res.ApgTngFrameworksResource,
    res.ApgTngFrameworkResource,
    res.ApgTngCacheResource,

];
