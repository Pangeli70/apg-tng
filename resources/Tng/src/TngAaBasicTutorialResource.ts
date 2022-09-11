/** -----------------------------------------------------------------------
 * @module [Tng/Resource]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.0 [APG 2022/09/11]
 * -----------------------------------------------------------------------
 */
import { Drash } from "../../../deps.ts";
import { ApgTngService } from "../../../apg/Tng/mod.ts"

export class TngAaBasicTutorialResource extends Drash.Resource {

    public paths = ["/basic/tutorial"];

    public async GET(_request: Drash.Request, response: Drash.Response) {

        const toolBarHtml = `
    <div>
        <a href="/">Index</a> |
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
        const pageHtml = this.#escapeHTML(pageRawHtml);

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
        const partialHtml = this.#escapeHTML(partialRawHtml);

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
        const fieldsData = this.#escapeHTML(rawFieldsData);

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
        const drashResource = this.#escapeHTML(rawDrashResource);

        const templateData = {
            page: {
                title: "Basic tutorial",
                toolbar: toolBarHtml,
                released: "2022/09/10"
            },
            tutorial: {
                page: pageHtml,
                partial: partialHtml,
                data: fieldsData,
                resource: drashResource
            },
            user: {
                name: "APG",
                image: "/public/img/jpg/Apg2016.jpg",
                details: {
                    role: "Long-term software engineer apprentice",
                    phone: "(+39) 329 3749029",
                    "e-mail": "angelipaologiusto@gmail.com",
                    password: "Super_Secret_Pa$$w0rd"
                },
            },
        };

        const html = await ApgTngService.Render("/tutorials/aa_basic_tutorial.html", templateData) as string;

        response.html(html);

    }

    #escapeHTML(astr: string) {

        return astr
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }
}
