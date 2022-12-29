/** -----------------------------------------------------------------------
 * @module [Tng/Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.1 [APG 2022/09/11] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */
import { Drash } from "../../deps.ts";
import { ApgTngService } from "../../mod.ts"
import { ApgTngBasicPageResource } from "./ApgTngBasicPageResource.ts"

export class ApgTngHomeResource extends ApgTngBasicPageResource {

    public override paths = ["/","/home"];

    public async GET(_request: Drash.Request, response: Drash.Response) {

        const toolbarLinks: { href: string; caption: string; }[] = [{
            href: "/examples",
            caption: "Examples"
        },
        {
            href: "/deliverable/frameworks",
            caption: "Deliverables"
        },
        {
            href: "/cache",
            caption: "Cache"
        }];


        const templateData = {
            site: {
                name: "Apg-Tng",
                title: "SSR Html template engine"
            },
            page: {
                title: "Documentation",
                toolbar: await this.prepareToolbar(toolbarLinks),
                footer: await this.prepareFooter("Pangeli70/apg-tng", "2022/09/10"),
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
