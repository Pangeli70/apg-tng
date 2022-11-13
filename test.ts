function t (templateData) {
  const r = [];
  r.push(`<!DOCTYPE html>
<html lang="en">

<head>
  <title>
    `);
  r.push(site.name);
  r.push(`:`);
  r.push(page.title);
  r.push(`</title>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <meta name="author" content="APG Angeli Paolo Giusto" />
  <meta name="generator" content="Deno+Drash" />
  <meta name="keywords" content="Deno, Drash, APG, Angeli Paolo Giusto, Paolo Angeli" />
  <meta name="application-name" content="`);
  r.push(site.name);
  r.push(`" />

  <!-- Favicon -->
  <link rel="shortcut icon" type="image/x-icon" href="https://apg-cdn.deno.dev/public/img/ico/Apg-favicon-2022.ico" />

  <link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.classless.min.css" />
  <link rel="stylesheet" href="https://apg-cdn.deno.dev/public/css/Apg-pico-custom.css" />
</head>

<body>
  <header style="padding: 0">
    <section id="title" style="padding: 0; margin: 0">
      <table>
        <tr>
          <td style="width:4rem">
            <a href="/">
              <img src="https://apg-cdn.deno.dev/public/img/png/APG-logo-2022-128px.png"
                style="min-width:3rem; min-height:3rem; " />
            </a>
          </td>
          <td>
            <h2 style="margin-bottom: 0px">`);
  r.push(site.name);
  r.push(`<br>
              <span style="font-size: 50&">`);
  r.push(site.title);
  r.push(`</span>
            </h2>
          </td>
        </tr>
      </table>
    </section>`);
  if (page.toolbar) {
    r.push(`<section id="bar" style="text-align: center;">`);
    r.push(page.toolbar);
    r.push(`<hr>
      </section>`);
  }
  r.push(`<h1 class="apg-page-title">`);
  r.push(page.title);
  r.push(`</h1>

  </header>

  <main style="padding: 0">`);
  switch (mode) {
r.push(``);
case "undefined": {
    r.push(`<h2>ERROR! The querystring parameter`);
    r.push(rawMode);
    r.push(`is invalid.</h2>`);
    break;
  }
  r.push(``);
case "menu": {
    r.push(``);
    for (const link of links) {
      r.push(`<p>
      <a href="`);
      r.push(link.href);
      r.push(`">`);
      r.push(link.caption);
      r.push(`</a>
    </p>`);
    }
    r.push(``);
    break;
  }
  r.push(``);
case "files": {
    r.push(``);
    for (const file of files) {
      r.push(`<details>
      <summary>
        <h3>`);
      r.push(file.key);
      r.push(`</h3>
      </summary>
      <pre><code>`);
      r.push(file.content);
      r.push(`</code></pre>
    </details>`);
    }
    r.push(``);
    break;
  }
  r.push(``);
case "functions": {
    r.push(``);
    for (const function of functions) {
      r.push(`<details>
      <summary>
        <h3>`);
      r.push(function.key);
      r.push(`</h3>
      </summary>
      <pre><code>`);
      r.push(function.content);
      r.push(`</code></pre>
    </details>`);
    }
    r.push(``);
    break;
  }
  r.push(``);
case "chunks": {
    r.push(``);
    for (const chunk of chunks) {
      r.push(`<details>
      <summary>
        <h3>`);
      r.push(chunk.key);
      r.push(`</h3>
      </summary>
      <pre><code>`);
      r.push(chunk.content);
      r.push(`</code></pre>
    </details>`);
    }
    r.push(``);
    break;
  }
  r.push(``);
}
r.push(`</main>

  <footer style="padding: 0">
    <hr />
    <section id="footer" style="padding: 0; margin: 2em, 0, 0, 0">
      <p style="text-align: center; font-size: 0.5em">
        <em>
          © 2017-2022 APG: free man angeli paolo giusto.<br />
          Made with ❤ using
          <a href="https://deno.land/" target="_blank">Deno</a>,
          <a href="https://drash.land/" target="_blank"> Drash</a>,
          <a href="https://www.picocss.com/" target="_blank">Pico Css</a><br />
          SSR HTML made with APG-TNG.<br />
          Page released:`);
r.push(page.released);
r.push(`</em>
      </p>
    </section>
  </footer>
</body>

</html>`);
return r.join("");
}