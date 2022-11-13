/** -----------------------------------------------------------------------
 * @module [Tng/Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.2 [APG 2022/10/31] 
 * -----------------------------------------------------------------------
 */
import { Drash, StdPath } from "../../deps.ts";
import { ApgTngService } from "../../mod.ts";


export class ApgTngFrameworkResource extends Drash.Resource {

    public override paths = ["/deliverable/framework/:name"];

    public async GET(request: Drash.Request, response: Drash.Response) {

        const framework = request.pathParam("name");

        const path = StdPath.join(ApgTngService.DeliverablesPath!, framework!);

        const files: string[] = [];
        for await (const dirEntry of Deno.readDir(path)) {
            if (dirEntry.isFile) {
                files.push(dirEntry.name);
            }
        }

        const links: { href: string, caption: string }[] = [];
        for (const file of files) {
            links.push({ href: "/deliver/" + framework + "/" + file, caption: file });
        }

        const templateData = {
            site: {
                name: "Apg-Tng",
                title: "SSR Html template engine"
            },
            page: {
                title: "Deliverable partials for " + framework + " framework",
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
        }, {
            href: "/deliverable/frameworks",
            caption: "Frameworks"
        }];
        const toolBarData: any = { toolbar: toolbarLinks };

        const toolbar = await ApgTngService.Render(remotePartial, toolBarData) as string;
        return toolbar;
    }
}
