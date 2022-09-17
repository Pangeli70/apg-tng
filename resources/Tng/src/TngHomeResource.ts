/** -----------------------------------------------------------------------
 * @module [Tng/Resource]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.1 [APG 2022/09/11] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */
import { Drash } from "../../../deps.ts";
import { ApgTngService } from "../../../apg/Tng/mod.ts"

export class TngHomeResource extends Drash.Resource {

    public paths = ["/"];

    public async GET(_request: Drash.Request, response: Drash.Response) {

        const templateData = {
            page: {
                title: "Tng Home",
                toolbar: "",
                released: "2022/09/10"
            },
            links: [
                {
                    href: "/basic",
                    caption: "Basic"
                }
            ],
        };

        const html = await ApgTngService.Render("/home.html", templateData) as string;

        response.html(html);

    }


}
