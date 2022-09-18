/** -----------------------------------------------------------------------
 * @module [Tng_Demo_Application]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.1 [APG 2022/09/11] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */
import { Drash, Uts } from "./deps.ts";
import { resources } from "./res.ts";
import { services } from "./svcs.ts";
import { ApgTngService } from "./mod.ts";

const SERVER_INFO: Uts.IApgUtsServerInfo = {
  name: 'Apg-Tng',
  title: 'SSR Html template engine',
  subtitle: 'Examples and tutorials',
  localPort: 49601
}

ApgTngService.Init("./templates", {
  useCache: false,
  cacheChunksLongerThan: 100,
  consoleLog: true
});

const server = new Drash.Server({
  hostname: '0.0.0.0',
  port: SERVER_INFO.localPort,
  resources: resources,
  services: services,
  protocol: "http"
});

server.run();

Uts.ApgUtsServer.StartupResume(SERVER_INFO);
