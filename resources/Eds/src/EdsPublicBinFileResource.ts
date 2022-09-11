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
    "/public/ico/.*\.(ico)",
    "/public/img/.*\.(jpg|png|svg)",
    "/public/pdf/.*\.(pdf)"
  ];

  public GET(request: Drash.Request, response: Drash.Response) {

    const file = "./" + new URL(request.url).pathname;
    
    // TODO set up a configuration setting for this
    // -- APG 20220910
    const maxAge = 6 * 60 * 60; //6hr
    response.headers.append("Cache-Control", `private, max-age=${maxAge}, immutable`)
    
    response.file(file);
  }

}