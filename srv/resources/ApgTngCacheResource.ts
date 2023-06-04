/** -----------------------------------------------------------------------
 * @module [apg-tng]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.2 [APG 2022/11/01] Deliverable partials
 * @version 0.9.7 [APG 2023/05/27] Separation of concerns lib/srv
 * -----------------------------------------------------------------------
 */
import { Edr, Uts, Tng } from "../deps.ts";
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

    public async GET(request: Edr.Drash.Request, response: Edr.Drash.Response) {

        let rawMode = request.queryParam("mode");
        if (rawMode == undefined) rawMode = eCacheResurceMode.menu;
        const _mode_ = Uts.ApgUtsEnum.StringContains(eCacheResurceMode, rawMode) ?
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
        const _links_: unknown[] = [];
        const _files_: { key: string, content: string }[] = [];
        const _functions_: { key: string, content: string }[] = [];
        const _chunks_ = "";
        const _examples_ = "";
        const _schemas_: { key: string, content: string }[] = [];

        const templateData = {
            _site_: {
                name: "Apg-Tng",
                title: "SSR Html template engine"
            },
            _page_: {
                title: "Cache ",
                toolbar: await this.prepareToolbar(toolbarLinks),
                released: "2022/10/21"
            },
            _mode_,
            _links_,
            _files_,
            _functions_,
            _chunks_,
            _examples_,
            _schemas_
        };

        switch (_mode_) {
            case eCacheResurceMode.undefined: {
                templateData._page_.title += "Error"
                break;
            }
            case eCacheResurceMode.menu: {
                templateData._page_.title += _mode_;
                templateData._links_ = [
                    {
                        href: "/cache?mode=files",
                        caption: "Files",
                        items: Tng.ApgTngService.QueryCache(1, true)
                    },
                    {
                        href: "/cache?mode=functions",
                        caption: "Functions",
                        items: Tng.ApgTngService.QueryCache(2, true)
                    },
                    {
                        href: "/cache?mode=chunks",
                        caption: "Chunks",
                        items: Tng.ApgTngService.QueryCache(3, true)
                    },
                    {
                        href: "/cache?mode=examples",
                        caption: "Examples",
                        items: Tng.ApgTngService.QueryCache(4, true)
                    },
                    {
                        href: "/cache?mode=schemas",
                        caption: "Schemas",
                        items: Tng.ApgTngService.QueryCache(5, true)
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
                templateData._page_.title += _mode_;
                templateData._files_ = [];
                const it = Tng.ApgTngService.QueryCache(1, false) as IterableIterator<[string, string]>;
                for (const [key, rawContent] of it) {
                    const content = Uts.ApgUtsStr.EscapeHTML(rawContent);
                    templateData._files_.push({ key, content })
                }
                templateData._files_.sort((a: { key: string; }, b: { key: string; }) => a.key > b.key ? 1 : -1);
                break;
            }
            case eCacheResurceMode.functions: {
                templateData._page_.title += _mode_;
                templateData._functions_ = [];
                const it = Tng.ApgTngService.QueryCache(2, false) as IterableIterator<[string, Tng.TApgTngTemplateFunction]>;
                for (const [key, rawContent] of it) {
                    const content = Uts.ApgUtsStr.EscapeHTML(rawContent.toString());
                    templateData._functions_.push({ key, content })
                }
                templateData._functions_.sort((a: { key: string; }, b: { key: string; }) => a.key > b.key ? 1 : -1);
                break;
            }
            case eCacheResurceMode.chunks: {
                templateData._page_.title += _mode_;
                templateData._chunks_ = await this.#prepareChunks();
                break;
            }
            case eCacheResurceMode.examples: {
                templateData._page_.title += _mode_;
                templateData._examples_ = await this.#prepareExamples();
                break;
            }
            case eCacheResurceMode.schemas: {
                templateData._page_.title += _mode_;
                templateData._schemas_ = [];
                const it = Tng.ApgTngService.QueryCache(5, false) as IterableIterator<[string, string]>;
                for (const [key, rawContent] of it) {
                    const content = Uts.ApgUtsStr.EscapeHTML(rawContent);
                    templateData._schemas_.push({ key, content })
                }
                templateData._schemas_.sort((a: { key: string; }, b: { key: string; }) => a.key > b.key ? 1 : -1);
                break;
            }
        }

        const html = await Tng.ApgTngService.Render("/ApgTngCachePage.html", templateData) as string;

        response.html(html);

    }


    async #prepareExamples() {

        const examples = [];
        const it = Tng.ApgTngService.QueryCache(4, false) as IterableIterator<[string, string]>;
        for (const [key, rawContent] of it) {
            const content = Uts.ApgUtsStr.EscapeHTML(rawContent);
            examples.push({ key, content })
        }
        examples.sort((a: { key: string; }, b: { key: string; }) => a.key > b.key ? 1 : -1);

        const partial = "/deliverables/classless/ApgTngClasslessDetailsH4CodeDeliverable.html";
        const partialData = { examples };

        const toolbar = await Tng.ApgTngService.Render(partial, partialData, { args: ["examples"] } ) as string;
        return toolbar;
    }

    
    async #prepareChunks() {

        const chunks = [];
        const it = Tng.ApgTngService.QueryCache(3, false) as IterableIterator<[number, string]>;
        for (const [key, rawContent] of it) {
            const content = Uts.ApgUtsStr.EscapeHTML(rawContent);
            chunks.push({ key, content })
        }
        chunks.sort((a: { key: number; }, b: { key: number; }) => a.key > b.key ? 1 : -1);


        const partial = "/deliverables/classless/ApgTngClasslessDetailsH4CodeDeliverable.html";
        const partialData = { chunks };

        const toolbar = await Tng.ApgTngService.Render(partial, partialData, { args: ["chunks"] } ) as string;
        return toolbar;
    }
}

