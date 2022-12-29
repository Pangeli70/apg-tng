/** -----------------------------------------------------------------------
 * @module [Tng/Application]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.1 [APG 2022/09/11] Deno Deploy Beta
 * @version 0.9.2 [APG 2022/10/31] Deliverables
 * @version 0.9.5 [APG 2022/12/29] Partial arguments and new markup
 * -----------------------------------------------------------------------
 */
import { Drash, Uts, DotEnv } from "./deps.ts";
import { resources } from "./res.ts";
import { services } from "./svcs.ts";
import { ApgTngService } from "./mod.ts";

const SERVER_INFO: Uts.IApgUtsServerInfo = {
  name: 'Apg-Tng',
  title: 'SSR Html template engine',
  subtitle: 'Examples and tutorials',
  localPort: 49601
}

const host = await getHost(SERVER_INFO.localPort);

ApgTngService.Init("./templates", host, {
  useCache: false,
  cacheChunksLongerThan: 100,
  consoleLog: true,
  deliverablesPath: "./deliverables"
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

async function getHost(alocalPort: number) {
  const isDenoDeploy = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
  let r = "";
  if (isDenoDeploy) {
    const env = await DotEnv.configAsync();
    if (env.HOST_NAME != undefined) {
      r = env.HOST_NAME
    }
    else {
      throw new Error('"HOST_NAME" field is missing the .env file. In Deno Deploy the desired host must be specified.');
    }
  }

  else {
    r = 'http://localhost:' + alocalPort
  }
  return r;
}
