/** -----------------------------------------------------------------------
 * @module [Tng/Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.2 [APG 2022/11/01] Deliverable partials
 * -----------------------------------------------------------------------
 */
import { Drash, Uts } from "../../deps.ts";
import { ApgTngService } from "../../mod.ts";
import { TApgTngTemplateFunction } from "../../src/classes/ApgTngService.ts";
import { ApgTngBasicPageResource } from "./ApgTngBasicPageResource.ts";

enum eCacheResurceMode {
    undefined = "undefined",
    menu = "menu",
    files = "files",
    functions = "functions",
    chunks = "chunks",
    examples = "examples",
    schemas = "schemas"
}


export class ApgTngCacheResource extends ApgTngBasicPageResource {

    public override paths = ["/cache"];

    public async GET(request: Drash.Request, response: Drash.Response) {

        let rawMode = request.queryParam("mode");
        if (rawMode == undefined) rawMode = eCacheResurceMode.menu;
        const mode = Uts.ApgUtsEnum.StringContains(eCacheResurceMode, rawMode) ?
            rawMode as eCacheResurceMode : eCacheResurceMode.undefined;

        const toolbarLinks: { href: string; caption: string; }[] = [
            {
                href: "/",
                caption: "Home"
            },
            {
                href: "/cache",
                caption: "Cache menu"
            }
        ];
        
        const templateData: any = {
            site: {
                name: "Apg-Tng",
                title: "SSR Html template engine"
            },
            page: {
                title: "Cache ",
                toolbar: await this.prepareToolbar(toolbarLinks),
                footer: await this.prepareFooter("Pangeli70/apg-tng", "2022/11/01"),
            },
            mode
        };

        switch (mode) {
            case eCacheResurceMode.undefined: {
                templateData.page.title += "Error"
                templateData.rawMode = rawMode;
                break;
            }
            case eCacheResurceMode.menu: {
                templateData.page.title += mode;
                templateData.links = [
                    {
                        href: "/cache?mode=files",
                        caption: "Files",
                        items: ApgTngService.QueryCache(1, true)
                    },
                    {
                        href: "/cache?mode=functions",
                        caption: "Functions",
                        items: ApgTngService.QueryCache(2, true)
                    },
                    {
                        href: "/cache?mode=chunks",
                        caption: "Chunks",
                        items: ApgTngService.QueryCache(3, true)
                    },
                    {
                        href: "/cache?mode=examples",
                        caption: "Examples",
                        items: ApgTngService.QueryCache(4, true)
                    },
                    {
                        href: "/cache?mode=schemas",
                        caption: "Schemas",
                        items: ApgTngService.QueryCache(5, true)
                    },
                    {
                        href: "/cache?mode=enable",
                        caption: "Enable",
                        items: ""
                    },
                    {
                        href: "/cache?mode=disable",
                        caption: "Disable",
                        items: ""
                    },
                    {
                        href: "/cache?mode=clear",
                        caption: "Clear",
                        items: ""
                    }
                ];
                break;
            }
            case eCacheResurceMode.files: {
                templateData.page.title += mode;
                templateData.files = [];
                const it = ApgTngService.QueryCache(1, false) as IterableIterator<[string, string]>;
                for (const [key, rawContent] of it) {
                    const content = Uts.ApgUtsStr.EscapeHTML(rawContent);
                    templateData.files.push({ key, content })
                }
                templateData.files.sort((a: { key: string; }, b: { key: string; }) => a.key > b.key ? 1 : -1);
                break;
            }
            case eCacheResurceMode.functions: {
                templateData.page.title += mode;
                templateData.functions = [];
                const it = ApgTngService.QueryCache(2, false) as IterableIterator<[string, TApgTngTemplateFunction]>;
                for (const [key, rawContent] of it) {
                    const content = Uts.ApgUtsStr.EscapeHTML(rawContent.toString());
                    templateData.functions.push({ key, content })
                }
                templateData.functions.sort((a: { key: string; }, b: { key: string; }) =>  a.key > b.key ? 1 : -1);
                break;
            }
            case eCacheResurceMode.chunks: {
                templateData.page.title += mode;
                templateData.chunks = [];
                const it = ApgTngService.QueryCache(3, false) as IterableIterator<[number, string]>;
                for (const [key, rawContent] of it) {
                    const content = Uts.ApgUtsStr.EscapeHTML(rawContent);
                    templateData.chunks.push({ key, content })
                }
                templateData.chunks.sort((a: { key: number; }, b: { key: number; }) => a.key > b.key ? 1 : -1);
                break;
            }
            case eCacheResurceMode.examples: {
                templateData.page.title += mode;
                templateData.examples = [];
                const it = ApgTngService.QueryCache(4, false) as IterableIterator<[string, string]>;
                for (const [key, rawContent] of it) {
                    const content = Uts.ApgUtsStr.EscapeHTML(rawContent);
                    templateData.examples.push({ key, content })
                }
                templateData.examples.sort((a: { key: string; }, b: { key: string; }) => a.key > b.key ? 1 : -1);
                break;
            }
            case eCacheResurceMode.schemas: {
                templateData.page.title += mode;
                templateData.schemas = [];
                const it = ApgTngService.QueryCache(5, false) as IterableIterator<[string, string]>;
                for (const [key, rawContent] of it) {
                    const content = Uts.ApgUtsStr.EscapeHTML(rawContent);
                    templateData.schemas.push({ key, content })
                }
                templateData.schemas.sort((a: { key: string; }, b: { key: string; }) => a.key > b.key ? 1 : -1);
                break;
            }
        }

        const html = await ApgTngService.Render("/cache.html", templateData) as string;

        response.html(html);

    }

}
