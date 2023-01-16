function rawJavascript(templateData) {

  with (templateData) {
    const r = [];
    r.push(`<!DOCTYPE html>
  <html lang="en">
  
    <head>
      <title>
        `);
    r.push(site.name);
    r.push(`:`);
    r.push(page.title);
    r.push(`</title>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
      <meta name="author" content="APG Angeli Paolo Giusto" />
      <meta name="generator" content="Deno+Drash" />
      <meta name="keywords" content="Deno, Drash, APG, Angeli Paolo Giusto, Paolo Angeli" />
      <meta name="application-name" content="`);
    r.push(site.name);
    r.push(`" />
  
      <!-- Favicon -->
      <link rel="shortcut icon" type="image/x-icon"
            href="https://apg-cdn.deno.dev/public/img/ico/Apg-favicon-2022.ico" />
  
      <link rel="stylesheet"
            href="https://unpkg.com/@picocss/pico@latest/css/pico.classless.min.css" />
      <link rel="stylesheet" href="https://apg-cdn.deno.dev/public/css/Apg-pico-custom.css" />
    </head>
  
    <body>
      <header style="padding: 0">
        <section id="title" style="padding: 0; margin: 0">
          <table>
            <tr>
              <td style="width:4rem">
                <a href="/">
                  <img src="https://apg-cdn.deno.dev/public/img/png/APG-logo-2022-128px.png"
                       style="min-width:3rem; min-height:3rem; " />
                </a>
              </td>
              <td>
                <h2 style="margin-bottom: 0px">`);
    r.push(site.name);
    r.push(`<br>
                  <span style="font-size: 50&">`);
    r.push(site.title);
    r.push(`</span>
                </h2>
              </td>
              <td>
                <h1 class="apg-page-title">`);
    r.push(page.title);
    r.push(`</h1>`);
    const args = [page.menu]
    r.push(`<pre hidden>
    
  </pre>`);
    if (page.menu != undefined) {
      r.push(`<p style="text-align: center;">`);
      for (const link of page.menu) {
        r.push(`<a href="`);
        r.push(link.href);
        r.push(`" style="margin: 0 0 0 1rem;" role="button">`);
        r.push(link.caption);
        r.push(`</a>`);
      }
      r.push(`</p>`);
    }
    r.push(`</td>
            </tr>
          </table>
        </section>`);
    if (page.toolbar) {
      r.push(`<section id="bar" style="text-align: center;">`);
      r.push(page.toolbar);
      r.push(`<hr>
        </section>`);
    }
    r.push(`</header>
  
      <main style="padding: 0; display: flex; justify-content: center;">
        
  
  <section>`);
    if (testLogger.hasErrors) {
      r.push(`<div id="pico_logger">`);
      if (testLogger.hasErrors) {
        r.push(`<p>`);
        for (let i = 0; i != testLogger.events.length - 1; i++) {

          const event = testLogger.events[i];

          const padding = " ".repeat(event.depth * 2);

          r.push(padding);

          r.push(event.className);
          r.push(`.`);
          r.push(event.method);

          if (event.result.payload && event.result.payload.data) {
            r.push(`.`);
            r.push(event.result.payload.data);

          }

          if (event.result.error != 0) {
            r.push(`<br>
              <span style="color: red;">`);
            r.push(padding);

            let codedMessage = event.result.codedMessage.template;

            if (event.result.codedMessage.params && event.result.codedMessage.params.length > 0) {

              const params = event.result.codedMessage.params;

              for (let i = 0; i != params.length; i++) {

                const param = `${params[i]}`;

                const placeholder = `&${i + 1}`;

                codedMessage = codedMessage.replaceAll(placeholder, param)

                r.push(codedMessage)

              }

            }

            if (event.result.payload && event.result.payload.data && event.result.payload.data.errors) {
              r.push(`<br>`);
              r.push(padding);

              const dataErrors = JSON.stringify(event.result.payload.data.errors)

              r.push(dataErrors);

            }
            r.push(`</span>`);
          }

          if (event.result.message) { r.push(`<span style:"color:blue">  ${event.result.message}</span>`            }
          r.push(`<br>`);
        }
        r.push(`</p>`);
      }
      r.push(`</div>
      <p>
          <code>`);
      JSON.stringify(testLogger, undefined, '  ').replaceAll('\n', '<br>').replaceAll(' ', ' ')
      r.push(`</code>
      </p>`);
    } else {
      r.push(`<script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.1/dist/svg-pan-zoom.min.js"></script>
  
  <section id="inline-svg"
           style="background-color: #ffffff; width: 100vw; display:flex; justify-content: center;">`);
      r.push(svgContent);
      r.push(`</section>
  
  <script>
    document.getElementById('APG_SVG_DOC').addEventListener('load', function () {
      // Will get called after embed element was loaded
      svgPanZoom(
        document.getElementById('APG_SVG_DOC'),
        {
          panEnabled: true,
          controlIconsEnabled: true,
          zoomEnabled: true,
          dblClickZoomEnabled: true,
          mouseWheelZoomEnabled: true,
          preventMouseEventsDefault: true,
          zoomScaleSensitivity: 0.2,
          minZoom: 0.5,
          maxZoom: 10,
          fit: true,
          contain: false,
          center: true,
          refreshRate: 'auto'
        }
      );
    })
  </script>`);
    }
    r.push(`</section>
      </main>
  
      <footer style="padding: 0">
        <hr />
        <section id="footer" style="padding: 0; margin: 2em, 0, 0, 0">
          <p style="text-align: center; font-size: 0.5em">
            <em>
              © 2017-2022 APG: free man angeli paolo giusto.<br />
              Made with ❤ using
              <a href="https://deno.land/" target="_blank">Deno</a>,
              <a href="https://drash.land/" target="_blank"> Drash</a>,
              <a href="https://www.picocss.com/" target="_blank">Pico Css</a><br />
              SSR HTML made with
              <a href="https://apg-tng.deno.dev/" target="_blank">Apg-TNG</a><br />
              Page released:`);
    r.push(page.released);
    r.push(`</em>
          </p>
        </section>
      </footer>
    </body>
  
  </html>`);
    return r.join("");
  }
}
}
