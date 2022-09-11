/** -----------------------------------------------------------------------
 * @module [Eds/Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.8.0 [APG 2022/04/09] Implemented mime types
 * @version 0.9.1 [APG 2022/09/10]
 * -----------------------------------------------------------------------
 */
import { Drash } from "../../../deps.ts";
import { EdsStaticResource } from "./EdsStaticResource.ts";

/** Deliver static text files stored in public and test folder */
export class EdsPublicTextFileResource extends EdsStaticResource {

  public paths = [
    "/public/html/.*\.(html)",
    "/public/css/.*\.(css)",
    "/public/js/.*\.(js)",
    "/public/txt/.*\.(txt)",
    "/public/csv/.*\.(csv)",
    "/test/svg/.*\.(svg)",
  ];

  public GET(request: Drash.Request, response: Drash.Response) {

    const extension = request.url.split(".").at(-1);
    let type: string;
    switch (extension) {
      case 'html':
        type = 'text/html'
        break;
      case 'css':
        type = 'text/css'
        break;
      case 'csv':
        type = 'text/csv'
        break;
      case 'svg':
        type = 'image/svg+xml'
        break;
      case 'js':
        type = 'application/javascripot'
        break;
      default:
        type = 'text/plain'
    }

    const file = "./" + new URL(request.url).pathname;

    const text = <string>this.processSync(file, true);

    // TODO setup a configurable Browser's cache expiration setting like in binFileResource
    // -- APG 20220910

    response.text(text, 200, { 'Content-Type': type });
  }

}