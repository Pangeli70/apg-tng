/** -----------------------------------------------------------------------
 * @module [Tng/Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.2 [APG 2022/11/01] Deliverable partials
 * -----------------------------------------------------------------------
 */
import { Drash } from "../../deps.ts";
import { ApgTngService } from "../../mod.ts";
import { ApgTngBasicPageResource } from "./ApgTngBasicPageResource.ts";

export class ApgTngExamplesResource extends ApgTngBasicPageResource {

    public override paths = ["/examples"];

    public async GET(_request: Drash.Request, response: Drash.Response) {

        const toolbarLinks: { href: string; caption: string; }[] = [{
            href: "/home",
            caption: "Documentation"
        },
        {
            href: "/deliverable/frameworks",
            caption: "Deliverables"
        },
        {
            href: "/cache",
            caption: "Cache management"
        }];


        const templateData = {
            site: {
                name: "Apg-Tng",
                title: "SSR Html template engine"
            },
            page: {
                title: "Examples",
                toolbar: await this.prepareToolbar(toolbarLinks),
                footer: await this.prepareFooter("Pangeli70/apg-tng", "2022/11/02"),
            },
            links: [
                {
                    href: "/basic",
                    caption: "Basic"
                }
            ],
        };

        const html = await ApgTngService.Render("/examples.html", templateData) as string;

        response.html(html);

    }
}
