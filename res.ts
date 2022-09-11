import { Drash } from "./deps.ts";
import * as res from "./resources/mod.ts";

export const resources: typeof Drash.Resource[] = [

    // Static
    res.EdsPublicTextFileResource,
    res.EdsPublicBinFileResource,

    // Tng
    res.TngIndexResource,
    res.TngAaBasicExampleResource,
    res.TngAaBasicTutorialResource

];
