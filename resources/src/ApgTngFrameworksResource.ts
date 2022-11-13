/** -----------------------------------------------------------------------
 * @module [Tng/Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.2 [APG 2022/10/31] 
 * -----------------------------------------------------------------------
 */
import { Drash } from "../../deps.ts";
import { ApgTngService } from "../../mod.ts";


export class ApgTngFrameworksResource extends Drash.Resource {

    public override paths = ["/deliverable/frameworks"];

    public async GET(_request: Drash.Request, response: Drash.Response) {

        const folders: string[] = [];
        for await (const dirEntry of Deno.readDir(ApgTngService.DeliverablesPath!)) {
            if (dirEntry.isDirectory) {
                folders.push(dirEntry.name);
            }
        }

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
                toolbar: await this.#prepareToolbar(),
                released: "2022/10/31"
            },
            links
        }

        const html = await ApgTngService.Render("/menu.html", templateData) as string;

        response.html(html);

    }

    async #prepareToolbar() {

        const remotePartial = ApgTngService.Host + "/deliver/pico/pico_h2_toolbar.html";

        const toolbarLinks: { href: string; caption: string; }[] = [{
            href: "/",
            caption: "Home"
        }];
        const toolBarData: any = { toolbar: toolbarLinks };

        const toolbar = await ApgTngService.Render(remotePartial, toolBarData) as string;
        return toolbar;
    }

}
