/** -----------------------------------------------------------------------
 * @module [apg-tng]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.2 [APG 2022/10/31]
 * @version 0.9.7 [APG 2023/05/27] Separation of concerns lib/srv
 * -----------------------------------------------------------------------
 */
import { Edr, Tng } from "../deps.ts";
import { ApgTngBasicPageResource } from "./ApgTngBasicPageResource.ts";


export class ApgTngFrameworksResource extends ApgTngBasicPageResource {

    public override paths = ["/deliverable/frameworks"];

    public async GET(_request: Edr.Drash.Request, response: Edr.Drash.Response) {

        const folders: string[] = [];
        for await (const dirEntry of Deno.readDir(Tng.ApgTngService.DeliverablesPath!)) {
            if (dirEntry.isDirectory) {
                folders.push(dirEntry.name);
            }
        }

        const toolbarLinks: { href: string; caption: string; }[] = [{
            href: "/",
            caption: "Home"
        }];

        const _links_: { href: string, caption: string }[] = [];
        for (const folder of folders) {
            _links_.push({ href: "/deliverable/framework/" + folder, caption: folder });
        }

        const templateData = {
            _site_: {
                name: "Apg-Tng",
                title: "SSR Html template engine"
            },
            _page_: {
                title: "Frameworks with Deliverable partials",
                toolbar: await this.prepareToolbar(toolbarLinks),
                released: "2022/10/21"
            },
            _links_
        }

        const html = await Tng.ApgTngService.Render("/ApgTngMenuPage.html", templateData) as string;

        response.html(html);

    }


}
