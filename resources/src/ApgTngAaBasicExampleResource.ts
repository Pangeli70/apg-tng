/** -----------------------------------------------------------------------
 * @module [Tng/Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.1 [APG 2022/09/11] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */
import { Drash } from "../../deps.ts";
import { ApgTngService } from "../../mod.ts"
import { ApgTngExamplesData } from "../data/ApgTngExamplesData.ts";
import { ApgTngBasicPageResource } from "./ApgTngBasicPageResource.ts";

export class ApgTngAaBasicExampleResource extends ApgTngBasicPageResource {

    public override paths = ["/basic/example"];

    public async GET(_request: Drash.Request, response: Drash.Response) {

        const toolbarLinks: { href: string; caption: string; }[] = [
            {
                href: "/",
                caption: "Home"
            },
            {
                href: "/examples",
                caption: "Examples"
            },
            {
                href: "/basic/tutorial",
                caption: "Tutorial"
            },
        ];


        const templateData = {
            site: ApgTngExamplesData.site,
            page: {
                title: "Basic Tng example",
                toolbar: await this.prepareToolbar(toolbarLinks),
                footer: await this.prepareFooter("Pangeli70/apg-tng", "2022/10/09"),
            },
            user: ApgTngExamplesData.users[2],
        };

        const html = await ApgTngService.Render("/examples/aa_basic_example.html", templateData) as string;

        response.html(html);

    }


}
