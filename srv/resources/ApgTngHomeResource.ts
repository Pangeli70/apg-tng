/** -----------------------------------------------------------------------
 * @module [apg-tng]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.1 [APG 2022/09/11] Deno Deploy Beta
 * @version 0.9.7 [APG 2023/05/27] Separation of concerns lib/srv
 * -----------------------------------------------------------------------
 */
import { Edr, Tng } from "../deps.ts";
import { ApgTngBasicPageResource } from "./ApgTngBasicPageResource.ts"

export class ApgTngHomeResource extends ApgTngBasicPageResource {

    public override paths = ["/","/home"];

    public async GET(_request: Edr.Drash.Request, response: Edr.Drash.Response) {

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
            _site_: {
                name: "Apg-Tng",
                title: "SSR Html template engine"
            },
            _page_: {
                title: "Documentation",
                toolbar: await this.prepareToolbar(toolbarLinks),
                released: "2022/10/09"
            },
            _links_: [
                {
                    href: "/basic",
                    caption: "Basic"
                }
            ],
        };

        const html = await Tng.ApgTngService.Render("/ApgTngHomePage.html", templateData) as string;

        response.html(html);

    }

}
