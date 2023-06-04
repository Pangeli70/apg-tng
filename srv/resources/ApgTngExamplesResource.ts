/** -----------------------------------------------------------------------
 * @module [apg-tng]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.2 [APG 2022/11/01] Deliverable partials
 * @version 0.9.7 [APG 2023/05/27] Separation of concerns lib/srv
 * -----------------------------------------------------------------------
 */
import { Edr } from "../deps.ts";
import { ApgTngService } from "../../mod.ts";
import { ApgTngBasicPageResource } from "./ApgTngBasicPageResource.ts";

export class ApgTngExamplesResource extends ApgTngBasicPageResource {

    public override paths = ["/examples"];

    public async GET(_request: Edr.Drash.Request, response: Edr.Drash.Response) {

        const toolbarLinks: { href: string; caption: string; }[] = [{
            href: "/home",
            caption: "Home"
        }];

        const templateData = {
            _site_: {
                name: "Apg-Tng",
                title: "SSR Html template engine"
            },
            _page_: {
                title: "Examples",
                toolbar: await this.prepareToolbar(toolbarLinks),
                released: "2022/10/21"
            },
            _links_: [
                {
                    href: "/basic",
                    caption: "Basic"
                }
            ],
        };

        const html = await ApgTngService.Render("/ApgTngExamplesPage.html", templateData) as string;

        response.html(html);

    }
}
