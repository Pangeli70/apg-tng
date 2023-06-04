/** -----------------------------------------------------------------------
 * @module [apg-tng]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.2 [APG 2022/10/31]
 * @version 0.9.7 [APG 2023/05/27] Separation of concerns lib/srv
 * -----------------------------------------------------------------------
 */
import { Tng, Edr, Uts } from "../deps.ts";

export class ApgTngDeliverResource extends Edr.ApgEdrStaticResource {
    static readonly CSSFRAMEWORK_PARAM = "cssframework";
    static readonly PARTIALNAME_PARAM = "partialName";

    public override paths = [`/deliver/:${ApgTngDeliverResource.CSSFRAMEWORK_PARAM}/:${ApgTngDeliverResource.PARTIALNAME_PARAM}`];

    public async GET(request: Edr.Drash.Request, response: Edr.Drash.Response) {

        const cssFramework = request.pathParam(ApgTngDeliverResource.CSSFRAMEWORK_PARAM);
        const partialName = request.pathParam(ApgTngDeliverResource.PARTIALNAME_PARAM);
        const deliverablesPath = Tng.ApgTngService.DeliverablesPath;
        const file = Uts.Std.Path.join(deliverablesPath!, cssFramework!, partialName!)

        const text = await this.processText(file) as string;

        response.text(text, 200, { 'Content-Type': 'text/plain' });

    }


}
