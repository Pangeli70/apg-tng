// deno-lint-ignore-file no-explicit-any
/** -----------------------------------------------------------------------
 * @module [Uts]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.2.0 [APG 2018/06/02]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.7.1 [APG 2019/08/27]
 * @version 0.8.0 [APG 2022/03/12] Porting to Deno
 * @version 0.8.0 [APG 2022/05/01] Refactoring names
 * @version 0.9.0 [APG 2022/09/10] Split in several module + Escape Html
 * @version 0.9.1 [APG 2022/09/11] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */

import { StdPath } from "../../deps.ts";

/** 
 * Static general purpose utility functions
 */
export class ApgUtsMath {
    static readonly EPSILON = 0.000001;

    static SafeInteger(atext: string | undefined): number | undefined {
        if (atext && ApgUtsIs.IsInteger(atext)) {
            return parseInt(atext, 10);
        }
        else {
            return undefined;
        }
    }

    static RoundToSignificant(an: number, adigits = 5): number {
        const exponentialNotation = an.toExponential(adigits - 1);
        let r = parseFloat(exponentialNotation);
        const abs = Math.abs(r);
        if (abs < this.EPSILON) r = 0;
        return r;
    }

    /**
     * @param   type  The type of adjustment (round, floor, ceil).
     * @param   avalue The number.
     * @param   aexp   The exponent (the 10 logarithm of the adjustment base).
     * @returns       The adjusted value.
     */
    static #decimalAdjust(atype: string, avalue: number, aexp?: number) {

        // Typescript hack
        const fun =
            (atype === "round") ? "round" :
                (atype === "floor") ? "floor" :
                    (atype === "ceil") ? "ceil" : undefined;

        if (!fun || isNaN(avalue)) {
            return NaN;
        }

        // If the exp is undefined or zero...
        if (!aexp || +aexp === 0) {
            return Math[fun](avalue);
        }

        aexp = +aexp;
        // If the value is not a number or the exp is not an integer...
        if (!(typeof aexp === 'number' && aexp % 1 === 0)) {
            return NaN;
        }
        // Shift
        let values = avalue.toString().split('e');
        avalue = Math[fun](+(values[0] + 'e' + (values[1] ? (+values[1] - aexp) : -aexp)));
        // Shift back
        values = avalue.toString().split('e');
        return +(values[0] + 'e' + (values[1] ? (+values[1] + aexp) : aexp));
    }

    static Round(value: number, exp: number) {
        return this.#decimalAdjust('round', value, exp);
    }

    static Floor(value: number, exp: number) {
        return this.#decimalAdjust('floor', value, exp);
    }

    static Ceil(value: number, exp: number) {
        return this.#decimalAdjust('ceil', value, exp);
    }
}

export class ApgUtsStr {

    static Capitalize(astring: string) {
        // https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
        if (typeof astring !== 'string') { return ''; }
        return astring.charAt(0).toUpperCase() + astring.slice(1).toLowerCase();
    }

    static RandomNumbersAndLetters(alength: number): string {

        let r = '';
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
        for (let i = 0; i < alength; i++) {
            const n = Math.floor(Math.random() * chars.length);
            r += chars.charAt(n);
        }
        return r;
    }

    static RandomWithSymbols(alength: number): string {

        let r = '';
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz_-=*+[]{}()<>?!%$£§|';
        for (let i = 0; i < alength; i++) {
            const n = Math.floor(Math.random() * chars.length);
            r += chars.charAt(n);
        }
        return r;
    }

    static FilledCentered(avalue: string, awidth: number, aborder: string, afiller: string) {
        const borderW = aborder.length;
        if (afiller.length > 1)
            afiller = afiller[0];
        const valueW = avalue.length;
        const tobeFilledW = awidth - valueW - (borderW * 2);
        const leftPadN = Math.trunc(tobeFilledW / 2);
        // const righPadN = leftPadN + (tobeFilledW % 2);
        const central = avalue
            .padStart(leftPadN + valueW, afiller)
            .padEnd(awidth - (2 * borderW), afiller);
        const r = aborder + central + aborder;

        return r
    }

    static FilledRight(avalue: string, awidth: number, aborder: string, afiller: string) {

        const borderW = aborder.length;
        if (afiller.length > 1)
            afiller = afiller[0];
        const leftPad = avalue.length + 1;
        const rightPaddedString = avalue
            .padStart(leftPad, afiller)
            .padEnd(awidth - (2 * borderW), afiller);
        const r = aborder + rightPaddedString + aborder;

        return r
    }

    /**
     * @return {RegExp} Regular Expression per il pattern passato
     * @param {string} afilter Pattern per il filtro es. 'start*', '*something', 'test*test', 'a*@*.com'
     */
    static RegExpFromFilter(afilter: string): RegExp {

        let r: RegExp;

        const starPositions: number[] = [];
        let ok = true;
        let lstarPosition = 0;
        while (ok) {
            lstarPosition = afilter.indexOf('*', lstarPosition);
            if (lstarPosition === -1) {
                ok = false;
            }
            else {
                starPositions.push(lstarPosition);
                lstarPosition++;
            }
        }

        // No *
        if (starPositions.length === 0) {
            r = new RegExp('.*' + afilter + '.*');
        }
        // Two or more *
        else if (starPositions.length > 1) {
            const filterParts: string[] = afilter.split('*');
            const l = filterParts.length;
            let pattern = '';

            for (let i = 0; i < l; i++) {
                if (i === 0) {
                    if (filterParts[i] !== '') {
                        pattern += '^';
                    }
                }
                pattern += filterParts[i];
                if (i === l - 1) {
                    if (filterParts[i] !== '') {
                        pattern += '$';
                    }
                    else {
                        pattern += '';
                    }
                }
                else {
                    pattern += '.*';
                }
            }

            r = new RegExp(pattern);
        }
        // Only one *
        else {

            let pattern = '';
            if (starPositions[0] === 0) {
                pattern = '.*' + afilter.replace('*', '') + '$';
            }
            else if (starPositions[0] === afilter.length) {
                pattern = '^' + afilter.replace('*', '') + '.*';
            }
            else {
                const filterParts: string[] = afilter.split('*');
                pattern = '^' + filterParts[0] + '.*' + filterParts[1] + '$';
            }
            r = new RegExp(pattern);
        }
        return r;
    }

    static EscapeHTML(ahtml: string) {

        return ahtml
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    static Urlify(apath: string) {
        let r = apath;
        let i = 0;
        const l = r.length;
        do {
            i = r.indexOf('=');
            if (i !== -1) {
                let b = true;
                let j = i;
                do {
                    j++;
                    if (r[j] === '&' || j === l) {
                        r = r.substring(0, i) + r.substring(j, l);
                        b = false;
                    }
                } while (b);
            }
        } while (i !== -1);
        r = r
            .replace(/[\/?&]/g, '_')
            .replace(/[:=]/g, '');
        return r;
    }

}

export class ApgUtsObj {
    static TypeOf(aunknown: unknown): string {
        if (aunknown === undefined) {
            return 'undefined';
        }
        if (aunknown === null) {
            return 'null';
        }
        if (Array.isArray(aunknown)) {
            return 'array';
        }
        return typeof aunknown;
    }

    static DeepCopy(aobj: any): any {
        return JSON.parse(JSON.stringify(aobj));
    }

    static DeepFreeze(aobject: any, alevel = 0): any {

        const deepCopy = (alevel == 0) ? this.DeepCopy(aobject) : aobject;
        alevel++;

        if (Array.isArray(deepCopy)) {
            for (let i = 0; i < deepCopy.length; i++) {
                if (deepCopy[i] && typeof deepCopy[i] === "object") {
                    deepCopy[i] = this.DeepFreeze(deepCopy[i], alevel);
                }
            }
        }
        else if (typeof deepCopy === "object") {
            // Retrieve the property names defined on object
            const propNames = Object.keys(deepCopy);

            // Freeze properties before freezing self
            for (const name of propNames) {
                const value = deepCopy[name];

                if (value && typeof value === "object") {
                    deepCopy[name] = this.DeepFreeze(value, alevel);
                }
            }
        }

        return Object.freeze(deepCopy);
    }

    static DeepCopyTo(asrc: any, adest: any): void {
        const temp = JSON.parse(JSON.stringify(asrc));
        Object.keys(temp).forEach(k => {
            adest[k] = temp[k];
        });
    }

    static DeepCompare(a: any, b: any): boolean {
        let r = true;
        const aa = Array.isArray(a);
        // if first is array
        if (aa) {
            // if both are arrays
            if (aa !== Array.isArray(b)) {
                return false;
            }
            else {
                r = (a.length !== b.length);
                // if have the same number of keys
                if (r) {
                    for (let i = 0; i < a.length; i++) {
                        const typeOfA = this.TypeOf(a[i]);
                        const typeOfB = this.TypeOf(b[i]);
                        // if type of each item match
                        if (typeOfA !== typeOfB) {
                            r = false;
                            break;
                        }
                        else {
                            // recurse
                            if (typeOfA === 'object' || typeOfA === 'array') {
                                r = this.DeepCompare(a[i], b[i]);
                            }
                            else {
                                r = a[i] === b[i];
                                // if content of each item match
                                if (!r) {
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        else {
            const typeOfA = this.TypeOf(a);
            r = typeOfA === 'object';
            // if first is object
            if (r) {
                r = typeOfA === this.TypeOf(b);
                // if both are object
                if (r) {
                    const keysOfA = Object.keys(a);
                    const keysOfB = Object.keys(b);
                    r = (keysOfA.length === keysOfB.length);
                    // if have the same number of keys
                    if (r) {
                        // if all the keys match
                        for (let i = 0; i < keysOfA.length; i++) {
                            if (keysOfA[i] != keysOfB[i]) {
                                r = false;
                                break;
                            }
                        }
                    }
                    if (r) {
                        // if type of each item match
                        for (let i = 0; i < keysOfA.length; i++) {
                            const typeOfA = this.TypeOf(a[keysOfA[i]]);
                            const typeOfB = this.TypeOf(b[keysOfB[i]]);
                            if (typeOfA !== typeOfB) {
                                r = false;
                                break;
                            }
                            else {
                                // recurse
                                if (typeOfA === 'object' || typeOfA === 'array') {
                                    r = this.DeepCompare(a[keysOfA[i]], b[keysOfB[i]]);
                                }
                                // for this couple we reached the primary types level
                                else {
                                    const valA = a[keysOfA[i]];
                                    const valB = b[keysOfB[i]];
                                    // numbers need further comparison due to floating point artifacts
                                    if (typeOfA == 'number') {
                                        const delta = valA - valB;
                                        r = Math.abs(delta) < ApgUtsMath.EPSILON;
                                    }
                                    else {
                                        r = valA === valB;
                                    }
                                    // if content of each item match
                                    if (!r) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return r;
    }

}

export class ApgUtsFs {
    static FolderExistsSync(apath: string): boolean {
        let r = false;
        try {
            const fileInfo = Deno.statSync(apath);
            r = fileInfo.isDirectory;
        } catch (error) {
            if (error && error.code === 'ENOENT') {
                // file or directory does not exist
                r = false;
            } else {
                // unexpected error, maybe permissions, pass it along
                throw error;
            }
        }
        return r;
    }


    static FolderOfFileExistsSync(afile: string): boolean {
        let r = false;
        const path = StdPath.dirname(afile);
        try {
            const fileInfo = Deno.statSync(path);
            r = fileInfo.isDirectory;
        } catch (error) {
            if (error && error.code === 'ENOENT') {
                // directory does not exist
                r = false;
            } else {
                // unexpected error, maybe permissions, pass it along
                throw error;
            }
        }
        return r;
    }


    static IsFolderSync(apath: string): boolean {

        if (apath.indexOf(".") > 0) return false; // it was a path for a file maybe

        const r = this.FolderExistsSync(apath);

        return r;

    }


    static GetSubFoldersSortedSync(apath: string): string[] {

        const entries: string[] = [];

        if (!this.IsFolderSync(apath)) {
            return entries;
        }

        for (const entry of Deno.readDirSync(apath)) {
            if (entry.isDirectory) {
                entries.push("/" + entry.name);
            }
        }
        const sortedEntries = entries.sort((a: string, b: string) =>
            a < b ? -1 : a === b ? 0 : 1);

        return sortedEntries;

    }


    static GetFileNamesSortedSync(apath: string, aext = '*'): string[] {
        const entries: string[] = [];

        if (!this.IsFolderSync(apath)) {
            return entries;
        }

        for (const entry of Deno.readDirSync(apath)) {
            if (entry.isFile) {
                entries.push(entry.name);
            }
        }

        const filteredEntries = (aext === "*") ?
            entries :
            entries.filter((a: string) => StdPath.extname(a) === aext)


        const sortedEntries = filteredEntries
            .sort((a: string, b: string) => a.localeCompare(b));

        return sortedEntries;

    }


    /** @remark This cannot run in production */
    static ClearFolderSync(apath: string, aext = '*') {
        const files = this.GetFileNamesSortedSync(apath, aext);
        const deletedFiles: string[] = [];
        let ok = true;
        let message = "Ok";
        files.forEach(fileName => {
            try {
                const file = apath + fileName;
                Deno.removeSync(file); // TODO test this
                deletedFiles.push(file);
            }
            catch (error) {
                ok = false;
                message = error.message;
                console.log(error);
            }
        });
        return { deletedFiles, ok, message };
    }


    static FileExistsSync(afile: string) {

        try {
            const stat = Deno.statSync(afile);
            if (stat.isFile) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            if (error && (
                (error.kind === Deno.errors.NotFound) ||
                (error.code === 'ENOENT')
            )) {
                return false;
            } else {
                // unexpected error, maybe permissions, pass it along
                throw error;
            }
        }
    }


    /**
     * @param afile complete file path with extension
     * @returns Decoded UTF-8 File Content
     * @warnings Can throw exception if file is not found
     */
    static ReadTextFileSync(afile: string): string {
        const decoder = new TextDecoder("utf-8");
        // TODO this can fail badly throwing 
        const fileContent = Deno.readFileSync(afile);
        const r = decoder.decode(fileContent);
        return r;
    }


    /**
     * @param afile complete file path with extension
     * @returns File Content
     * @warnings Can throw exception if file is not found
     */
    static ReadBinFileSync(afile: string) {

        // TODO this can fail badly throwing 
        const r = Deno.readFileSync(afile);

        return r;
    }

}

export class ApgUtsMap {

    static Stringify(_key: string, apotentialMap: unknown) {
        if (apotentialMap instanceof Map) {

            let newValue: any;
            const mapEntries = apotentialMap.entries();
            const arrayOfEntries = Array.from(mapEntries);
            const res = arrayOfEntries.map((keyValuePairAsArray) => {

                const res: any = {
                    [keyValuePairAsArray[0]]: keyValuePairAsArray[1],
                };
                newValue = {
                    ...newValue,
                    ...res,
                };
                return newValue;
            });
            return res[res.length - 1];
            /* return {
                    dataType: 'Map',
                    apotentialMap: Array.from(apotentialMap.entries()), // or with spread: apotentialMap: [...apotentialMap]
                  }; */
        } else {
            return apotentialMap;
        }
    }

    static ToArray(amap: Map<string, any>) {
        const r: any[] = [];
        amap.forEach((v, key) => {
            const item = { ...v };
            item.$key = key;
            r.push(item);
        });
        return r;
    }

    static ToObject(amap: Map<string, any>) {
        const r: any = {};
        amap.forEach((v, key) => {
            r[key] = v;
        });
        return r;
    }

}

export class ApgUtsEnum {
    static StringContains(aenum: any, avalue: string): boolean {
        return (Object.values(aenum).includes(avalue));
    }

    static StringValues(aenum: any) {
        return Object.values(aenum) as string[];
    }

    static NumericContains(aenum: any, avalue: number): boolean {
        return (Object.values(aenum).includes(avalue));
    }

    static NumericValues(aenum: any) {
        return Object.values(aenum) as number[];
    }

}

export class ApgUtsIs {

    static IsNumber(an: any): boolean {
        return (!isNaN(parseFloat(an)) && isFinite(an));
    }

    static IsInteger(an: any): boolean {
        let r = this.IsNumber(an);

        if (r) {
            const n = parseFloat(an);
            if (!Number.isInteger(n)) {
                r = false;
            }
        }

        return r;
    }

    static IsDigitChar(acharCode: number): boolean {
        return (acharCode >= "0".charCodeAt(0) && acharCode <= "9".charCodeAt(0));
    }

    static IsTrueish(avalue?: string) {

        if (!avalue) return false;
        const value = avalue.trim().toLowerCase();

        switch (value) {
            case "true":
            case "1":
            case "on":
            case "yes":
                return true;
            default:
                return false;
        }
    }

    static IsNumeric(an: string) {
        const isNumber: boolean = /^-?[\d.]+(?:e-?\d+)?$/.test(an);
        if (!isNumber) {
            return false;
        } else {
            return ApgUtsIs.IsNumber(an);
        }
    }

}
