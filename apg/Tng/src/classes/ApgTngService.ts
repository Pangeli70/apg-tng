import { ApgUtsMath } from "../../../Uts/mod.ts";


type TApgTngTemplateFunction = (a: any) => string;

enum eTngMkpDict {
    YIELD = "yield",
    PARTIAL = "partial",
    EXTENDS = "extends",
    BEGIN = "<%",
    END = "%>",
}

export interface IApgTngServiceOptions {
    useCache?: boolean;
    cacheChunksLongerThan?: number;
    consoleLog?: boolean;
}

/**
 * Modified by APG, starting from the original Drash Template Engine named Jae
 */
export class ApgTngService {

    // Class Name
    static readonly CLASS_NAME = "ApgTngService";

    // Master and partials files
    private static _filesCache: Map<string, string> = new Map();
    // Html chunks hash Cache
    private static _chunksCache: Map<number, string> = new Map();
    // Processed javascript functions
    private static _functionsCache: Map<string, TApgTngTemplateFunction> = new Map();

    private static _templatesPath: string;
    
    private static _options: IApgTngServiceOptions = {
        useCache: false,
        cacheChunksLongerThan: 100,
        consoleLog: false
    }

    // UGLY Code smell too many arguments
    // Create options object 
    // -- APG 20220910
    static Init(
        atemplatesPath: string,
        aoptions?: IApgTngServiceOptions
    ) {
        this._templatesPath = atemplatesPath;
        if (aoptions) {
            if (aoptions.useCache) {
                this._options.useCache = aoptions.useCache;
            }
            if (aoptions.cacheChunksLongerThan) {
                this._options.cacheChunksLongerThan = Math.round(aoptions.cacheChunksLongerThan);
            }
            if (aoptions.consoleLog) {
                this._options.consoleLog = aoptions.consoleLog;
            }
        }

    }

    static #getChunk(achunkHash: number) {
        const maybeChunk = this._chunksCache.get(achunkHash);
        if (!maybeChunk) {
            return `<p>Chunk with hash ${achunkHash} is not present in the chunks' Cache</p>`
        }
        else {
            return maybeChunk!;
        }
    }


    static async Render(
        atemplateFile: string,
        atemplateData: unknown,
        auseCache = true // we can override cache usage per single call
    ) {

        if (!atemplateData) {
            atemplateData = {};
        }

        const viewName = this.#normalizeViewName(this._templatesPath, atemplateFile);

        const useCache = (auseCache && this._options.useCache!);

        let templateFunction: TApgTngTemplateFunction;

        let weHaveNewFunctionToStoreInCache = false;

        if (useCache && this._functionsCache.has(viewName)) {
            templateFunction = this._functionsCache.get(viewName)!;
            if (this._options.consoleLog)
                console.log(`${this.CLASS_NAME}: function ${viewName} retrieved from cache!`);
        }
        else {
            const js = await this.#getTemplateAsJavascript(viewName, useCache);
            try {
                templateFunction = new Function("templateData", js) as TApgTngTemplateFunction;
                weHaveNewFunctionToStoreInCache = true;
                if (this._options.consoleLog)
                    console.log(`${this.CLASS_NAME}: function for ${viewName} was built!`);
            } catch (err) {
                return this.#handleJSError(err, viewName, js);
            }
        }

        let result = "";
        try {
            result = templateFunction!.apply(this, [atemplateData]);
            // now we are sure that works so we can store!
            if (weHaveNewFunctionToStoreInCache && this._options.useCache) {
                this._functionsCache.set(viewName, templateFunction!);
                if (this._options.consoleLog) {
                    console.log(`${this.CLASS_NAME}: function ${viewName} is stored in cache!`);
                    console.log(`${this.CLASS_NAME}: cache now contains ${this._functionsCache.size.toString()} items.`);
                }
            }
        } catch (err) {
            result = this.#handleJSError(err, viewName, templateFunction!.toString());
        }
        return result;
    }


    static async #getTemplateAsJavascript(aviewName: string, auseCache: boolean) {

        const templateHtml = await this.#getTemplate(aviewName, auseCache);

        const rawJs: string[] = [];
        rawJs.push("with(templateData) {");
        rawJs.push("const r=[];");

        const templateRows = this.#convertTemplateInJs(templateHtml);
        rawJs.push(...templateRows);

        rawJs.push('return r.join("");');
        rawJs.push('}');

        const js = rawJs.join("\r\n");
        return js;

    }


    static #normalizeViewName(aviewsPath: string, atemplateFile: string) {
        if (this._templatesPath.endsWith("/") && atemplateFile.startsWith("/")) {
            aviewsPath += atemplateFile.slice(1);
        }
        else if (!this._templatesPath.endsWith("/") && !atemplateFile.startsWith("/")) {
            aviewsPath += `/${atemplateFile}`;
        }
        else {
            aviewsPath += atemplateFile;
        }
        return aviewsPath;
    }


    static async #getTemplate(aviewName: string, auseCache: boolean) {

        let templateHtml: string = await this.#getTemplateFile(aviewName, auseCache);

        // Check if the template extends another template typically a master page
        // /<% extends.* %>/g
        const ancestorRegExpMkp = `${eTngMkpDict.BEGIN} ${eTngMkpDict.EXTENDS}.* ${eTngMkpDict.END}`
        const ancestorRegExp = new RegExp(ancestorRegExpMkp, "g")
        const ancestorMatches = templateHtml.match(ancestorRegExp);
        if (ancestorMatches) {
            // Look for all the ancestors
            templateHtml = await ApgTngService.#processAncestors(ancestorMatches, auseCache, templateHtml);
        }

        // Check recursively for nested partials
        // /<% partial.* %>/g
        const partialRegExpMkp = `${eTngMkpDict.BEGIN} ${eTngMkpDict.PARTIAL}.* ${eTngMkpDict.END}`;
        const partialRegExp = new RegExp(partialRegExpMkp, "g")

        // since we can have nested sub partials we need a loop for Regex match
        let partialMatches;
        do {
            partialMatches = templateHtml.match(partialRegExp);
            if (partialMatches != null) {
                templateHtml = await ApgTngService.#processPartials(partialMatches, auseCache, templateHtml);
            }
        } while (partialMatches != null);

        return templateHtml;
    }


    static async #processPartials(partials: RegExpMatchArray, auseCache: boolean, atemplateHtml: string) {
        let r = atemplateHtml;
        for (let i = 0; i < partials.length; i++) {

            const partial = partials[i];
            const partialView = ApgTngService.#getPartialView(partial);
            const partialHtml = await this.#getTemplateFile(partialView, auseCache);

            //insert the partial html inside the template
            r = atemplateHtml.replace(partial, partialHtml);
        }
        return r;
    }

    static async #processAncestors(ancestors: RegExpMatchArray, auseCache: boolean, atemplateHtml: string) {

        let r = atemplateHtml;
        for (let i = 0; i < ancestors.length; i++) {

            const ancestorMarkup = ancestors[i];
            const ancestorView = this.#getAncestorView(ancestorMarkup);
            const ancestorHtml = await this.#getTemplateFile(ancestorView, auseCache);

            const strippedHtml = atemplateHtml.replace(ancestorMarkup, "");

            // insert the current template in the ancestor's one
            const yeldMarkup = `${eTngMkpDict.BEGIN} ${eTngMkpDict.YIELD} ${eTngMkpDict.END}`;
            r = ancestorHtml.replace(yeldMarkup, strippedHtml);
        }
        return r;
    }

    static #getPartialView(apartial: string) {
        const partialBeginMkp = `${eTngMkpDict.BEGIN} ${eTngMkpDict.PARTIAL}("`;
        const partialEndMkp = `") ${eTngMkpDict.END}`;

        const partialName = apartial
            .replace(partialBeginMkp, "")
            .replace(partialEndMkp, "");
        const partialView = this._templatesPath + partialName;

        return partialView;
    }

    static #getAncestorView(ancestorMarkup: string) {
        // TODO Change logic use substring insetead that replace
        // -- APG 20220910
        const extendsBeginMkp = `${eTngMkpDict.BEGIN} ${eTngMkpDict.EXTENDS}("`;
        const extendsEndMkp = `") ${eTngMkpDict.END}`;

        const ancestorViewName = ancestorMarkup
            .replace(extendsBeginMkp, "")
            .replace(extendsEndMkp, "");
        const ancestorView = this._templatesPath + ancestorViewName;

        return ancestorView;
    }

    static async #getTemplateFile(aviewName: string, auseCache: boolean) {

        if (auseCache && this._filesCache.has(aviewName)) {
            return this._filesCache.get(aviewName)!;
        }
        else {

            let templateContent = ""
            try {
                templateContent = await Deno.readTextFile(aviewName);
            } catch (e) {
                console.log(e.message)
                throw e;
            }
            // CHECK Could be redundant in some cases if we overwite the cache. 
            // Or we waste memory since cache wont be used
            // -- APG 20220802
            this._filesCache.set(aviewName, templateContent);
            return templateContent;
        }

    }

    static #convertTemplateInJs(atemplateHtml: string) {
        const r: string[] = [];

        const firstSplitChunks = atemplateHtml.split(eTngMkpDict.BEGIN);
        let first = true;
        for (const chunk of firstSplitChunks) {
            if (first) {
                r.push(this.#convertHtmlChunkToJs(chunk)); // html
                first = false;
            }
            else {
                const secondSplitChunks = chunk.split(eTngMkpDict.END);
                r.push(this.#convertJsChunkToJs(secondSplitChunks[0])); // js
                r.push(this.#convertHtmlChunkToJs(secondSplitChunks[1])); // html
            }
        }
        return r;
    }

    static #convertJsChunkToJs(achunk: string) {
        let r = "";
        const supportedJsKeywordsAndSymbolsRegex = /(^( )?(let|const|if|else|switch|case|break|for|do|while|{|}|;))(.*)?/g;
        r = (achunk.match(supportedJsKeywordsAndSymbolsRegex)) ?
            // we expect supported js code, so insert js chunk as is
            achunk :
            // instead insert as value automatically converted in string by interpolation
            `r.push(${achunk});`
        return r;
    }

    static #convertHtmlChunkToJs(achunk: string) {
        let r = "";

        if (this._options.useCache && achunk.length > this._options.cacheChunksLongerThan!) {
            const chunkHash = this.#brycHash(achunk);
            if (!this._chunksCache.has(chunkHash)) {
                this._chunksCache.set(chunkHash, achunk)
            }
            // Insert html chunk as reference to the chunks Cache
            r = `r.push(this.#getChunk(${chunkHash}))`;
        }
        else {
            // Insert html chunk as string
            r = 'r.push(`' + achunk + '`);'
        }

        return r;
    }

    static #handleJSError(aerr: Error, aviewName: string, ajs: string) {
        const notDefIndex = (<string>aerr.message).indexOf(" is not defined");

        console.error(`${this.CLASS_NAME} Error: ${aerr.message}`);
        let printableJS = ajs
            .replaceAll(">", "&gt")
            .replaceAll("<", "&lt")
            .replaceAll("%", "&amp");

        // Highlight recognized errors
        if (notDefIndex != -1) {
            const missingItem = (<string>aerr.message).substring(0, notDefIndex);
            const missingmarkup = `<span style="color:red"><b>${missingItem}</b></span>`;
            printableJS = printableJS.replaceAll(missingItem, missingmarkup);
        }

        // printableJS = `function anonymous (templateData){\n${printableJS}\n}`;

        const r = `
        <!doctype html>
        <html lang=it-IT>
            <head>
                <meta charset=utf-8>
                <title>ERROR</title>
            </head>
            <body style="margin-left:20%; margin-right:20%; font-family: 'Segoe UI', 'Verdana';">
                <h1>${this.CLASS_NAME} Error!</h1>
                <h2>In the view: ${aviewName}</h2>
                <h3 style="color:red;">${aerr.message}</h3>
                <p>Cut and paste following code to a linter as potentially invalid javascript.</p>
                <hr>
                <pre style="font-family: 'Lucida console','Courier new'">${printableJS}</pre>
            </body>
        </html>
        `;

        return r;
    }

    static #brycHash(astr: string, aseed = 0) {

        let h1 = 0xdeadbeef ^ aseed;
        let h2 = 0x41c6ce57 ^ aseed;
        for (let i = 0; i < astr.length; i++) {
            const ch = astr.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        const hash = 4294967296 * (2097151 & h2) + (h1 >>> 0);
        return hash;

    }

}


