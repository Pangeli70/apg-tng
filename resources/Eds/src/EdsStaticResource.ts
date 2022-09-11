/** -----------------------------------------------------------------------
 * @module [Eds/Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2021/02/21]
 * @version 0.8.0 [APG 2022/04/03]
 * @version 0.9.1 [APG 2022/09/10]
 * -----------------------------------------------------------------------
 */
import { Drash } from "../../../deps.ts";
import { ApgUtsFs } from "../../../apg/Uts/mod.ts";

interface IApgEdsStaticResourceCacheableItem {
  count: number;
  content: string | Uint8Array;
  lastRequest: number;
}

const CACHE_EXPIRATION = 1000;

const staticResouceCache: { [key: string]: IApgEdsStaticResourceCacheableItem } = {};

/**
 * Process static files syncronously using an in memory cache to speed up the process
 */
export abstract class EdsStaticResource extends Drash.Resource {

  protected processSync(aresourceFile: string, aisText: boolean): string | Uint8Array {

    try {
      let staticContent: string | Uint8Array;

      if (staticResouceCache[aresourceFile] == undefined) {
        if (aisText) {
          staticContent = ApgUtsFs.ReadTextFileSync(aresourceFile);
        }
        else {
          staticContent = ApgUtsFs.ReadBinFileSync(aresourceFile);
        }

        const staticCacheableItem: IApgEdsStaticResourceCacheableItem = {
          count: 1,
          content: staticContent,
          lastRequest: performance.now()
        }
        staticResouceCache[aresourceFile] = staticCacheableItem;
      }
      else {

        const staticCacheableItem: IApgEdsStaticResourceCacheableItem = staticResouceCache[aresourceFile];
        const currentTime = performance.now();
        const deltaTime = currentTime - staticCacheableItem.lastRequest;

        if (deltaTime > CACHE_EXPIRATION) {
          if (aisText) {
            staticCacheableItem.content = ApgUtsFs.ReadTextFileSync(aresourceFile);
          }
          else {
            staticCacheableItem.content = ApgUtsFs.ReadBinFileSync(aresourceFile);
          }
        }

        staticCacheableItem.count++;
        staticCacheableItem.lastRequest = currentTime;
        staticContent = staticCacheableItem.content;

      }

      return staticContent;

    } catch (_error) {

      throw new Drash.Errors.HttpError(
        400,
        `Error reading static resource (${aresourceFile}).`,
      );

    }

  }

}
