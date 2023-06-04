/** -----------------------------------------------------------------------
 * @module [apg-tng]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.2 [APG 2022/11/01] Deliverable partials
 * @version 0.9.7 [APG 2023/05/27] Separation of concerns lib/srv
 * -----------------------------------------------------------------------
 */

import { Edr } from "./deps.ts";
import { ApgTngAaBasicTutorialResource } from "./resources/ApgTngAaBasicTutorialResource.ts";
import { ApgTngAaBasicExampleResource } from "./resources/ApgTngAaBasicExampleResource.ts";
import { ApgTngCacheResource } from "./resources/ApgTngCacheResource.ts";
import { ApgTngDeliverResource } from "./resources/ApgTngDeliverResource.ts";
import { ApgTngExamplesResource } from "./resources/ApgTngExamplesResource.ts";
import { ApgTngFrameworkResource } from "./resources/ApgTngFrameworkResource.ts";
import { ApgTngFrameworksResource } from "./resources/ApgTngFrameworksResource.ts";
import { ApgTngHomeResource } from "./resources/ApgTngHomeResource.ts";


export const ApgTngResources: typeof Edr.Drash.Resource[] = [

    // Static
    Edr.ApgEdrAssetsTextFileResource,
    Edr.ApgEdrAssetBinFileResource,

    // Tng
    ApgTngHomeResource,
    ApgTngExamplesResource,
    ApgTngAaBasicExampleResource,
    ApgTngAaBasicTutorialResource,
    ApgTngDeliverResource,
    ApgTngFrameworksResource,
    ApgTngFrameworkResource,
    ApgTngCacheResource,

];


export const ApgTngServices: Edr.Drash.Service[] = [
    new Edr.Drash.CORSService()
];
