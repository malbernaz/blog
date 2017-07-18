import { h } from "preact";

const Html = ({ component, assets }) =>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Document</title>
    </head>
    <body>
      <div id="mnt" dangerouslySetInnerHTML={{ __html: component }} />
      <script src={Array.isArray(assets.main) ? assets.main[0] : assets.main} />
    </body>
  </html>;

export default Html;
