/** -----------------------------------------------------------------------
 * @module [Tng_Demo_Application]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.0 [APG 2022/09/11]
 * -----------------------------------------------------------------------
 */
import { ApgTngService } from "./apg/Tng/mod.ts";
import { Drash } from "./deps.ts";
import { resources } from "./res.ts";
import { services } from "./svcs.ts";

const port = 49601;

ApgTngService.Init("./views", false, 100, true);

const server = new Drash.Server({
  hostname: '0.0.0.0',
  port: port,
  resources: resources,
  services: services,
  protocol: "http"
});

server.run();

const now = new Date().toISOString();
console.log(`\n\n\n******************************************************`)
console.log(`                    Apg Tng `)
console.log(`              SSR Html template engine`);
console.log(`               Examples and tutorials`);
console.log(`           ${now} (ISO)`);
console.log(`               http://localhost:${port}`);
console.log(`         Drash Server ready to receive request`);
console.log(`******************************************************\n\n\n`)
