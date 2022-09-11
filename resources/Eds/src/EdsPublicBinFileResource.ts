/** -----------------------------------------------------------------------
 * @module [Tng/Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/04/03]
 * @version 0.9.1 [APG 2022/09/10]
 * -----------------------------------------------------------------------
 */
import { Drash } from "../../../deps.ts";
import { EdsStaticResource } from "./EdsStaticResource.ts";

/** Resource to deliver static files in binary format, stored in public folder */
export class EdsPublicBinFileResource extends EdsStaticResource {

  public paths = [
    "/public/img/ico/.*\.(ico)",
    "/public/img/jpg/.*\.(jpg|jpeg)",
    "/public/img/png/.*\.(png)",
    "/public/img/gif/.*\.(gif)",
    "/public/pdf/.*\.(pdf)",
    "/public/zip/.*\.(zip)"
  ];

  public async GET(request: Drash.Request, response: Drash.Response) {

    const extension = request.url.split(".").at(-1);
    let type: string;
    switch (extension) {
      case 'ico':
        type = 'image/x-icon'
        break;
      case 'jpg':
        type = 'image/jpeg'
        break;
      case 'png':
        type = 'image/png'
        break;
      case 'pdf':
        type = 'application/pdf'
        break;
      case 'zip':
        type = 'application/zip'
        break;
      default:
        type = 'application/octet-stream'
    }

    const file = Deno.cwd() + new URL(request.url).pathname;
    
    const content = await this.processBin(file) as Uint8Array;
    
    response.body = content;
    response.headers.set("Content-Type", type);

    // TODO set up a configuration setting for this
    // -- APG 20220910
    const maxAge = 6 * 60 * 60; //6hr
    response.headers.append("Cache-Control", `private, max-age=${maxAge}, immutable`)
  }

}