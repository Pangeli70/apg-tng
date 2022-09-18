/** -----------------------------------------------------------------------
 * @module [Tng/Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.1 [APG 2022/09/11] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */
import { Drash, Uts } from "../../deps.ts";
import { ApgTngService } from "../../mod.ts"
import { ApgTngExamplesData } from "../data/ApgTngExamplesData.ts";

export class ApgTngAaBasicTutorialResource extends Drash.Resource {

    public paths = ["/basic/tutorial"];

    public async GET(_request: Drash.Request, response: Drash.Response) {

        const toolBarHtml = `
    <div>
        <a href="/">Home</a> |
        <a href="/basic">Example</a>
    </div>
    `
        const pageRawHtml = `
    <% extends("/templates/pico_template.html") %>

    <div style="max-width: 640px; margin: 50px auto;">
      <h1>
        <% user.name %>
      </h1>
      <img src="<% user.image %> style="width: 50%">
      <% partial("/partials/user_details.html") %>
    </div>`
        const pageHtml = Uts.ApgUtsStr.EscapeHTML(pageRawHtml);

        const partialRawHtml = `
    <ul>
    <% for (const fieldName in user.details) { %>
        <!-- Do not show the Password field -->
        <% if (fieldName !=="password" ) { %>
        <li>
            <% fieldName %>: <% user.details[fieldName] %>
        </li>
        <% } %>
    <% } %>
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
                toolbar: toolBarHtml,
                released: "2022/09/10"
            },
            tutorial: {
                page: pageHtml,
                partial: partialHtml,
                data: fieldsData,
                resource: drashResource
            },
            user: ApgTngExamplesData.users[0]
        };

        const html = await ApgTngService.Render("/tutorials/aa_basic_tutorial.html", templateData) as string;

        response.html(html);

    }


}
