/** -----------------------------------------------------------------------
 * @module [Tng]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.0 [APG 2022/09/11] Beta
 * @version 0.9.2 [APG 2022/10/31] Deliverables portions
 * @version 0.9.3 [APG 2022/11/05] Host
 * ------------------------------------------------------------------------
 */
import { StdPath } from "../../deps.ts";
import { eApgTngMkpDictionary } from "../enums/eApgTngMkpDictionary.ts";
import type { IApgTngServiceOptions } from "../interfaces/IApgTngServiceOptions.ts";

export type TApgTngTemplateFunction = (a: any) => string;

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

    // Partials/Deliverables schemas in JSON format
    private static _portionsSchemas: Map<string, string> = new Map();

    // Partials/Deliverables examples in JSON format
    private static _deliverableDataExamples: Map<string, string> = new Map();

    private static _templatesPath: string;

    // TODO We still need to implement partial("{Host}/file.html")
    private static _host: string;

    private static _options: IApgTngServiceOptions = {
        useCache: false,
        cacheChunksLongerThan: 100,
        consoleLog: false,
        // TODO remove this from here, maybe move inside ApgTngServer or not? 
        deliverablesPath: ""
    }

    static get TemplatesPath() {
        return this._templatesPath;
    }

    static get Host() {
        return this._host;
    }

    static get DeliverablesPath() {
        return this._options.deliverablesPath;
    }

    static Init(
        atemplatesPath: string,
        ahost: string,
        aoptions?: IApgTngServiceOptions
    ) {
        this._templatesPath = atemplatesPath;
        this._host = ahost;
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
            if (aoptions.deliverablesPath) {
                this._options.deliverablesPath = aoptions.deliverablesPath;
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
        if (this._options.consoleLog)
            console.log(`${this.CLASS_NAME}.${this.Render.name} invoked for template ${atemplateFile}`);

        if (!atemplateData) {
            atemplateData = {};
        }

        if (atemplateFile.includes(eApgTngMkpDictionary.HOST)) {
            atemplateFile.replace(eApgTngMkpDictionary.HOST, this.Host)
        }

        const isHttp = atemplateFile.startsWith("http");

        const template = isHttp ? atemplateFile : StdPath.join(this._templatesPath, atemplateFile);

        const useCache = (auseCache && this._options.useCache!);

        let templateFunction: TApgTngTemplateFunction;

        let weHaveNewFunctionToStoreInCache = false;

        if (useCache && this._functionsCache.has(template)) {
            templateFunction = this._functionsCache.get(template)!;
            if (this._options.consoleLog)
                console.log(`${this.CLASS_NAME}: function for template ${template} retrieved from cache!`);
        }
        else {
            const js = await this.#getTemplateAsJavascript(template, useCache);
            try {
                templateFunction = new Function("templateData", js) as TApgTngTemplateFunction;
                weHaveNewFunctionToStoreInCache = true;
                if (this._options.consoleLog)
                    console.log(`${this.CLASS_NAME}: function for template ${template} was built!`);
            } catch (err) {
                return this.#handleJSError(err, template, js);
            }
        }

        let result = "";
        try {
            result = templateFunction!.apply(this, [atemplateData]);
            // now we are sure that works so we can store!
            if (weHaveNewFunctionToStoreInCache) {
                this._functionsCache.set(template, templateFunction!);
                if (this._options.consoleLog) {
                    console.log(`${this.CLASS_NAME}: function for template ${template} is stored in cache!`);
                    console.log(`${this.CLASS_NAME}: functions cache now contains ${this._functionsCache.size.toString()} items.`);
                }
            }
        } catch (err) {
            result = this.#handleJSError(err, template, templateFunction!.toString());
        }
        return result;
    }


    static async #getTemplateAsJavascript(atemplate: string, auseCache: boolean) {

        const templateHtml = await this.#getTemplate(atemplate, auseCache);

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


    static async #getTemplate(atemplate: string, auseCache: boolean) {

        let templateHtml: string = await this.#getTemplateFile(atemplate, auseCache);

        // Check if the template extends another template typically a master page
        // /<% extends("...") %>
        const ancestorRegExpMkp =
            `${eApgTngMkpDictionary.BEGIN} ${eApgTngMkpDictionary.EXTENDS}\\(\\".*\\"\\) ${eApgTngMkpDictionary.END}`
        const ancestorRegExp = new RegExp(ancestorRegExpMkp, "g")
        const ancestorMatches = templateHtml.match(ancestorRegExp);
        if (ancestorMatches) {
            // Look for all the ancestors
            templateHtml = await ApgTngService.#processAncestors(ancestorMatches, auseCache, templateHtml);
        }

        // Check recursively for nested partials
        // <% partial("...") %>
        const partialRegExpMkp =
            `${eApgTngMkpDictionary.BEGIN} ${eApgTngMkpDictionary.PARTIAL}\\(\\".*\\"\\) ${eApgTngMkpDictionary.END}`;
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
            const partialName = ApgTngService.#getPartialTemplate(partial);
            const partialHtml = await this.#getTemplateFile(partialName, auseCache);

            //insert the partial html inside the template
            r = atemplateHtml.replace(partial, partialHtml);
        }
        return r;
    }


    static async #processAncestors(ancestors: RegExpMatchArray, auseCache: boolean, atemplateHtml: string) {

        let r = atemplateHtml;
        for (let i = 0; i < ancestors.length; i++) {

            const ancestorMarkup = ancestors[i];
            const ancestorName = this.#getAncestorTemplate(ancestorMarkup);
            const ancestorHtml = await this.#getTemplateFile(ancestorName, auseCache);

            const strippedHtml = atemplateHtml.replace(ancestorMarkup, "");

            // insert the current template in the ancestor's one
            const yeldMarkup = `${eApgTngMkpDictionary.BEGIN} ${eApgTngMkpDictionary.YIELD} ${eApgTngMkpDictionary.END}`;
            r = ancestorHtml.replace(yeldMarkup, strippedHtml);
        }
        return r;
    }


    static #getPartialTemplate(apartial: string) {
        // <% partial("...") %>
        const partialBeginMkp = `${eApgTngMkpDictionary.BEGIN} ${eApgTngMkpDictionary.PARTIAL}("`;
        const partialEndMkp = `") ${eApgTngMkpDictionary.END}`;

        const partialName = apartial
            .replace(partialBeginMkp, "")
            .replace(partialEndMkp, "");

        const r = partialName.startsWith("http") ? partialName : this._templatesPath + partialName;

        return r;
    }


    static #getAncestorTemplate(ancestorMarkup: string) {
        // <% extends("...") %>
        const extendsBeginMkp = `${eApgTngMkpDictionary.BEGIN} ${eApgTngMkpDictionary.EXTENDS}("`;
        const extendsEndMkp = `") ${eApgTngMkpDictionary.END}`;

        const ancestorViewName = ancestorMarkup
            .replace(extendsBeginMkp, "")
            .replace(extendsEndMkp, "");
        const r = this._templatesPath + ancestorViewName;

        return r;
    }


    static async #getTemplateFile(atemplate: string, auseCache: boolean) {

        if (this._options.consoleLog)
            console.log(`${this.CLASS_NAME}.${this.#getTemplateFile.name} invoked for template ${atemplate}`);


        if (auseCache && this._filesCache.has(atemplate)) {
            return this._filesCache.get(atemplate)!;
        }
        else {

            let templateContent = "";
            try {

                if (atemplate.startsWith("http")) {
                    const response = await fetch(atemplate);
                    templateContent = await response.text();
                }
                else {
                    templateContent = await Deno.readTextFile(atemplate);
                }

                templateContent = this.#scanTemplateContentForSchemaAndExample(atemplate, templateContent);

            } catch (e) {
                const message = e.message + "{" + atemplate + "}";
                throw new Error(message);
            }
            // save to the cache anyway
            this._filesCache.set(atemplate, templateContent);
            return templateContent;
        }

    }


    static #scanTemplateContentForSchemaAndExample(aportionName: string, acontent: string) {
        let r = this.#scanTemplateContentForExample(aportionName, acontent);
        r = this.#scanTemplateContentForSchema(aportionName, r);
        return r;
    }


    static #scanTemplateContentForExample(aportionName: string, acontent: string) {
        // /<% example({...}) %>
        const exampleBeginMkp = `${eApgTngMkpDictionary.BEGIN} ${eApgTngMkpDictionary.EXAMPLE}({`;
        const exampleEndMkp = `}) ${eApgTngMkpDictionary.END}`;
        let found = false;
        let r = acontent;
        do {
            const i1 = r.indexOf(exampleBeginMkp);
            if (i1 >= 0) {
                const i2 = r.indexOf(exampleEndMkp, i1);
                if (i2 > i1) {
                    const begin = i1 + exampleBeginMkp.length - 1;
                    const end = i2 + 1;
                    const example = r.substring(begin, end);
                    this._deliverableDataExamples.set(aportionName, example);
                    const _e = JSON.parse(example);
                    r = r.substring(0, i1) + r.substring(i2 + exampleEndMkp.length, r.length);
                    found = true;
                }
            }
            else {
                found = false;
            }
        } while (found == true);

        return r;
    }


    static #scanTemplateContentForSchema(aportionName: string, acontent: string) {
        // <% schema({...}) %>
        const schemaBeginMkp = `${eApgTngMkpDictionary.BEGIN} ${eApgTngMkpDictionary.SCHEMA}({`;
        const eschemaEndMkp = `}) ${eApgTngMkpDictionary.END}`;
        let found = false;
        let r = acontent;
        do {
            const i1 = r.indexOf(schemaBeginMkp);
            if (i1 >= 0) {
                const i2 = r.indexOf(eschemaEndMkp, i1);
                if (i2 > i1) {
                    const begin = i1 + schemaBeginMkp.length - 1;
                    const end = i2 + 1;
                    const schema = r.substring(begin, end);
                    this._portionsSchemas.set(aportionName, schema);
                    const _s = JSON.parse(schema);
                    r = r.substring(0, i1) + r.substring(i2 + eschemaEndMkp.length, r.length);
                    found = true;
                }
            }
            else {
                found = false;
            }
        } while (found == true);

        return r;
    }


    static #convertTemplateInJs(atemplateHtml: string) {
        const r: string[] = [];

        const firstSplitChunks = atemplateHtml.split(eApgTngMkpDictionary.BEGIN);
        let first = true;
        for (const chunk of firstSplitChunks) {
            if (first) {
                r.push(this.#convertHtmlChunkToJs(chunk)); // html
                first = false;
            }
            else {
                const secondSplitChunks = chunk.split(eApgTngMkpDictionary.END);

                const jsChunk = secondSplitChunks[0].trim();
                const convertedJsChunk = this.#convertJsChunkToJs(jsChunk);
                r.push(convertedJsChunk);

                const htmlChunk = secondSplitChunks[1].trim();
                const convertedHtmlChunk = this.#convertHtmlChunkToJs(htmlChunk);
                r.push(convertedHtmlChunk);
            }
        }
        return r;
    }


    static #convertJsChunkToJs(achunk: string) {
        let r = "";
        const jsKeywordsAndSymbolsRegex = /(^( )?(var|let|const|=|if|else|switch|case|break|for|do|while|{|}|;))(.*)?/g;
        r = (achunk.match(jsKeywordsAndSymbolsRegex)) ?
            // we expect supported js code, so insert js chunk as is
            achunk :
            // instead insert as value automatically converted in string by interpolation
            `r.push(${achunk});`
        return r;
    }


    static #convertHtmlChunkToJs(achunk: string) {
        let r = "";
        let chunkHash = 0;
        /** Store in cache anyway if larger that specified size */
        if (achunk.length > this._options.cacheChunksLongerThan!) {
            chunkHash = this.#brycHash(achunk);
            if (!this._chunksCache.has(chunkHash)) {
                this._chunksCache.set(chunkHash, achunk)
            }
        }

        if (this._options.useCache) {

            // Insert html chunk as reference to the chunks Cache
            r = `r.push(this.#getChunk(${chunkHash}))`;
        }
        else {
            // Insert html chunk as string
            r = 'r.push(`' + achunk + '`);'
        }

        return r;
    }


    static #handleJSError(aerr: Error, atemplate: string, ajs: string) {
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
                <h2>In the template: ${atemplate}</h2>
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


    static async RenderDeliverableExample(adeliverable: string) {
        let r = "";

        const exampleData = this._deliverableDataExamples.get(adeliverable);
        if (exampleData == undefined) {
            r = "The example data for a demonstrative use of the " + adeliverable + " is not available!"
        }
        else {
            const jsonData = JSON.parse(exampleData);
            r = await this.Render(adeliverable, jsonData);
        }

        return r;

    }


    static QueryCache(acacheID: number, acountOnly = true) {
        let r: number |
            (IterableIterator<[string, string]>) |
            (IterableIterator<[string, TApgTngTemplateFunction]>) |
            (IterableIterator<[number, string]>) = 0;
        if (acountOnly) {
            switch (acacheID) {
                case 1:
                    r = this._filesCache.size;
                    break;
                case 2:
                    r = this._functionsCache.size;
                    break;
                case 3:
                    r = this._chunksCache.size;
                    break;
                case 4:
                    r = this._deliverableDataExamples.size;
                    break;
                case 5:
                    r = this._portionsSchemas.size;
                    break;
            }
        }
        else {
            switch (acacheID) {
                case 1:
                    r = this._filesCache.entries();
                    break;
                case 2:
                    r = this._functionsCache.entries();
                    break;
                case 3:
                    r = this._chunksCache.entries();
                    break;
                case 4:
                    r = this._deliverableDataExamples.entries();
                    break;
                case 5:
                    r = this._portionsSchemas.entries();
                    break;
            }
        }
        return r;

    }
}

