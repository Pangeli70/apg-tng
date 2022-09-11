/** -----------------------------------------------------------------------
 * @module [Tng/Resource]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.0 [APG 2022/09/11]
 * -----------------------------------------------------------------------
 */
import { Drash } from "../../../deps.ts";
import { ApgTngService } from "../../../apg/Tng/mod.ts"

export class TngIndexResource extends Drash.Resource {

    public paths = ["/"];

    public async GET(_request: Drash.Request, response: Drash.Response) {
        response.headers.set("Content-Type", "text/html");

        const templateData = {
            page: {
                title: "Examples",
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

        const html = await ApgTngService.Render("/index.html", templateData) as string;

        response.html(html);

    }


}
