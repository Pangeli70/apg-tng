/** -----------------------------------------------------------------------
 * @module [apg-tng]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.2 [APG 2022/11/04] Deliverables
 * @version 0.9.7 [APG 2023/05/27] Separation of concerns lib/srv
 * -----------------------------------------------------------------------
 */
import { Edr , Tng} from "../deps.ts";

export abstract class ApgTngBasicPageResource extends Edr.Drash.Resource {

    protected async prepareToolbar(atoolBarLinks: { href: string; caption: string; }[]) {

        const toolBarPartial = "/deliverables/pico/ApgTngPicoH2ToolbarDeliverable.html";

        const toolBarData = { _links_: atoolBarLinks };

        const toolbar = await Tng.ApgTngService.Render(toolBarPartial, toolBarData) as string;
        return toolbar;
    }



}
