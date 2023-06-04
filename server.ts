/** -----------------------------------------------------------------------
 * @module [apg-tng]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.1 [APG 2022/09/11] Deno Deploy Beta
 * @version 0.9.2 [APG 2022/10/31] Deliverables
 * @version 0.9.5 [APG 2022/12/29] Partial arguments and new markup
 * @version 0.9.7 [APG 2023/05/27] Separation of concerns lib/srv
 * -----------------------------------------------------------------------
 */
import { Edr, Uts, Tng, Dir } from "./srv/deps.ts";
import { ApgTngResources, ApgTngServices } from "./srv/mod.ts";

const serverInfo = Dir.ApgDirServer.GetInfo(Dir.eApgDirEntriesIds.tng);

const remoteTngHost = Tng.ApgTngService.GetRemoteHostFromEnv(serverInfo.localPort);

Tng.ApgTngService.Init("./srv/templates", remoteTngHost!, {
  useCache: false,
  cacheChunksLongerThan: 100,
  consoleLog: true,
  deliverablesPath: "./srv/templates/deliverables"
});

const server = new Edr.Drash.Server({
  hostname: '0.0.0.0',
  port: serverInfo.localPort,
  resources: ApgTngResources,
  services: ApgTngServices,
  protocol: "http"
});

server.run();

Dir.ApgDirServer.StartupResume(serverInfo);




