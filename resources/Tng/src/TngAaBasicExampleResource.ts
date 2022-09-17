/** -----------------------------------------------------------------------
 * @module [Tng/Resource]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.1 [APG 2022/09/11] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */
import { Drash } from "../../../deps.ts";
import { ApgTngService } from "../../../apg/Tng/mod.ts"

export class TngAaBasicExampleResource extends Drash.Resource {

    public paths = ["/basic"];

    public async GET(_request: Drash.Request, response: Drash.Response) {

        const toolBarHtml = `
    <div>
        <a href="/">Home</a> |
        <a href="/basic/tutorial">Tutorial</a>
    </div>
    `

        const templateData = {
            page: {
                title: "Basic Tng example",
                toolbar: toolBarHtml,
                released: "2022/09/10"
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

        const html = await ApgTngService.Render("/examples/aa_basic_example.html", templateData) as string;

        response.html(html);

    }


}
