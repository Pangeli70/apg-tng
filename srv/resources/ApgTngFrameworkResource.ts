/** -----------------------------------------------------------------------
 * @module [apg-tng]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.2 [APG 2022/10/31]
 * @version 0.9.7 [APG 2023/05/27] Separation of concerns lib/srv
 * -----------------------------------------------------------------------
 */
import { Edr, Uts } from "../deps.ts";
import { ApgTngService } from "../../mod.ts";
import { ApgTngBasicPageResource } from "./ApgTngBasicPageResource.ts";


export class ApgTngFrameworkResource extends ApgTngBasicPageResource {

    public override paths = ["/deliverable/framework/:name"];

    public async GET(request: Edr.Drash.Request, response: Edr.Drash.Response) {


        const toolbarLinks: { href: string; caption: string; }[] = [{
            href: "/",
            caption: "Home"
        }, {
            href: "/deliverable/frameworks",
            caption: "Frameworks"
        }];

        const framework = request.pathParam("name");

        const path = Uts.Std.Path.join(ApgTngService.DeliverablesPath!, framework!);

        const files: string[] = [];
        for await (const dirEntry of Deno.readDir(path)) {
            if (dirEntry.isFile) {
                files.push(dirEntry.name);
            }
        }

        const _links_: { href: string, caption: string }[] = [];
        for (const file of files) {
            _links_.push({ href: "/deliver/" + framework + "/" + file, caption: file });
        }

        const templateData = {
            _site_: {
                name: "Apg-Tng",
                title: "SSR Html template engine"
            },
            _page_: {
                title: "Deliverable partials for " + framework + " framework",
                toolbar: await this.prepareToolbar(toolbarLinks),
                released: "2022/10/21"
            },
            _links_
        }

        const html = await ApgTngService.Render("/ApgTngMenuPage.html", templateData) as string;

        response.html(html);

    }


}
