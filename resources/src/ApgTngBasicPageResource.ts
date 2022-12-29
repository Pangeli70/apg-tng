/** -----------------------------------------------------------------------
 * @module [Tng/Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.2 [APG 2022/11/04] Deliverables
 * -----------------------------------------------------------------------
 */
import { Drash } from "../../deps.ts";
import { ApgTngService } from "../../mod.ts"

export abstract class ApgTngBasicPageResource extends Drash.Resource {

    protected async prepareToolbar(atoolBarLinks: { href: string; caption: string; }[]) {

        const toolBarPartial = "/deliverables/pico/pico_h2_toolbar.html";

        const toolBarData: any = { toolbar: atoolBarLinks };

        const toolbar = await ApgTngService.Render(toolBarPartial, toolBarData) as string;
        return toolbar;
    }


    protected async prepareFooter(agithubProjectPage: string, apageReleaseDate: string) {

        const footerPartial = "/deliverables/pico/pico_page_footer.html";

        const footerData: { githubProjectPage: string; pageReleaseDate: string; } = {
            githubProjectPage: agithubProjectPage,
            pageReleaseDate: apageReleaseDate
        }

        const toolbar = await ApgTngService.Render(footerPartial, footerData) as string;
        return toolbar;
    }
}
