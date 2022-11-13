/** -----------------------------------------------------------------------
 * @module [Tng/Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.2 [APG 2022/10/31]
 * -----------------------------------------------------------------------
 */
import { Drash, Edr, StdPath } from "../../deps.ts";
import { ApgTngService } from "../../mod.ts";

export class ApgTngDeliverResource extends Edr.ApgEdrStaticResource {
    static readonly CSSFRAMEWORK_PARAM = "cssframework";
    static readonly PARTIALNAME_PARAM = "partialName";

    public override paths = [`/deliver/:${ApgTngDeliverResource.CSSFRAMEWORK_PARAM}/:${ApgTngDeliverResource.PARTIALNAME_PARAM}`];

    public async GET(request: Drash.Request, response: Drash.Response) {

        const cssFramework = request.pathParam(ApgTngDeliverResource.CSSFRAMEWORK_PARAM);
        const partialName = request.pathParam(ApgTngDeliverResource.PARTIALNAME_PARAM);
        const deliverablesPath = ApgTngService.DeliverablesPath;
        const file = StdPath.join(deliverablesPath!, cssFramework!, partialName!)

        const text = await this.processText(file) as string;

        response.text(text, 200, { 'Content-Type': 'text/plain' });

    }


}
