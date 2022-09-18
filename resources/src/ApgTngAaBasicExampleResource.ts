/** -----------------------------------------------------------------------
 * @module [Tng/Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.1 [APG 2022/09/11] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */
import { Drash } from "../../deps.ts";
import { ApgTngService } from "../../mod.ts"
import { ApgTngExamplesData } from "../data/ApgTngExamplesData.ts";

export class ApgTngAaBasicExampleResource extends Drash.Resource {

    public paths = ["/basic"];

    public async GET(_request: Drash.Request, response: Drash.Response) {

        const toolBarHtml = `
    <div>
        <a href="/">Home</a> |
        <a href="/basic/tutorial">Tutorial</a>
    </div>
    `

        const templateData = {
            site: ApgTngExamplesData.site,
            page: {
                title: "Basic Tng example",
                toolbar: toolBarHtml,
                released: "2022/09/10"
            },
            user: ApgTngExamplesData.users[2],
        };

        const html = await ApgTngService.Render("/examples/aa_basic_example.html", templateData) as string;

        response.html(html);

    }


}
