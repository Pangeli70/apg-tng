/** -----------------------------------------------------------------------
 * @module [apg-tng]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.1 [APG 2022/09/11] Deno Deploy Beta
 * @version 0.9.7 [APG 2023/05/27] Separation of concerns lib/srv
 * -----------------------------------------------------------------------
 */
import { Edr, Uts, Tng } from "../deps.ts";
import { ApgTngExamplesData } from "../data/ApgTngExamplesData.ts";
import { ApgTngBasicPageResource } from "./ApgTngBasicPageResource.ts";

export class ApgTngAaBasicTutorialResource extends ApgTngBasicPageResource {

    public override paths = ["/basic/tutorial"];

    public async GET(_request: Edr.Drash.Request, response: Edr.Drash.Response) {

        const toolbarLinks: { href: string; caption: string; }[] = [
            {
                href: "/",
                caption: "Home"
            },
            {
                href: "/examples",
                caption: "Examples"
            },
            {
                href: "/basic/example",
                caption: "Example"
            },
        ];
        const pageRawHtml = `
    [: extends("/templates/pico_template.html") :]

    <div style="max-width: 640px; margin: 50px auto;">
      <h1>
        [: user.name :]
      </h1>
      <img src="[: user.image :] style="width: 50%">
      [: partial("/partials/user_details.html") :]
    </div>`
        const pageHtml = Uts.ApgUtsStr.EscapeHTML(pageRawHtml);

        const partialRawHtml = `
    <ul>
    [: for (const fieldName in user.details) { :]
        <!-- Do not show the Password field -->
        [: if (fieldName !=="password" ) { :]
        <li>
            [: fieldName :]: [: user.details[fieldName] :]
        </li>
        [: } :]
    [: } :]
    </ul>`
        const partialHtml = Uts.ApgUtsStr.EscapeHTML(partialRawHtml);

        const rawFieldsData = `
    const templateData = {
        user: {
            name: "APG",
            image: "/public/img/jpg/Apg2016.jpg",
            details: {
                role: "Long-term software engineer apprentice",
                phone: "(+39) 329 3749029",
                "e-mail": "angelipaologiusto@gmail.com",
                password: "Super_Secret_Pa$$w0rd"
            },
        }
    }`
        const fieldsData = Uts.ApgUtsStr.EscapeHTML(rawFieldsData);

        const rawDrashResource = `
    public async GET(_request: Drash.Request, response: Drash.Response) {

        const templateData = {
            ...
        }

        const html = await ApgTngService.Render(
            "/tutorials/aa_basic_tutorial.html", 
            templateData
        ) as string;

        response.html(html);

    }`
        const drashResource = Uts.ApgUtsStr.EscapeHTML(rawDrashResource);

        const templateData = {
            site: ApgTngExamplesData.site,
            page: {
                title: "Basic Tng tutorial",
                toolbar: await this.prepareToolbar(toolbarLinks),
                released: "2022/10/09"
            },
            tutorial: {
                page: pageHtml,
                partial: partialHtml,
                data: fieldsData,
                resource: drashResource
            },
            user: ApgTngExamplesData.users[0]
        };

        const html = await Tng.ApgTngService.Render("/tutorials/aa_basic_tutorial.html", templateData) as string;

        response.html(html);

    }


}
