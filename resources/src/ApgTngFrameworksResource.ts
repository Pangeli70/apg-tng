/** -----------------------------------------------------------------------
 * @module [Tng/Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.2 [APG 2022/10/31] 
 * -----------------------------------------------------------------------
 */
import { Drash } from "../../deps.ts";
import { ApgTngService } from "../../mod.ts";
import { ApgTngBasicPageResource } from "./ApgTngBasicPageResource.ts";


export class ApgTngFrameworksResource extends ApgTngBasicPageResource {

    public override paths = ["/deliverable/frameworks"];

    public async GET(_request: Drash.Request, response: Drash.Response) {

        const folders: string[] = [];
        for await (const dirEntry of Deno.readDir(ApgTngService.DeliverablesPath!)) {
            if (dirEntry.isDirectory) {
                folders.push(dirEntry.name);
            }
        }

        const toolbarLinks: { href: string; caption: string; }[] = [{
            href: "/",
            caption: "Home"
        }];

        const links: { href: string, caption: string }[] = [];
        for (const folder of folders) {
            links.push({ href: "/deliverable/framework/" + folder, caption: folder });
        }

        const templateData = {
            site: {
                name: "Apg-Tng",
                title: "SSR Html template engine"
            },
            page: {
                title: "Frameworks with Deliverable partials",
                toolbar: await this.prepareToolbar(toolbarLinks),
                footer: await this.prepareFooter("Pangeli70/apg-tng", "2022/10/21"),
            },
            links
        }

        const html = await ApgTngService.Render("/menu.html", templateData) as string;

        response.html(html);

    }


}
