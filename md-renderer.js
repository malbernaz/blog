const { Renderer } = require("marked");
const { getLanguage, highlight } = require("highlight.js");

const renderer = new Renderer();

renderer.code = (code, language) => {
  const validLang = !!(language && getLanguage(language));

  const highlighted = validLang ? highlight(language, code).value : code;

  return `<pre class="highlightjs"><code class="hljs ${language}">${highlighted}</code></pre>`;
};

renderer.list = (body, ordered) => {
  const items = body.split(/<li>|<\/li>/).filter(s => s !== "");

  let hasCheckbox = false;
  const output = items
    .map(i => {
      if (i.match(/\r?\n|\r/)) return i;
      if (i.match(/^\[x\]\s/) || i.match(/^\[\s\]\s/)) {
        hasCheckbox = true;
        return i.match(/^\[x\]\s/)
          ? { text: i.replace(/^\[x\]\s/, ""), checked: "checked" }
          : { text: i.replace(/^\[\s\]\s/, ""), checked: "" };
      }
      return { text: i };
    })
    .map(i => {
      if (typeof i !== "object" && i.match(/\r?\n|\r/)) {
        if (i.length > 1) return `<li>${i}</li>`;
        return i;
      }
      return hasCheckbox
        ? `<li style="list-style:none;">` +
          `<input type="checkbox" disabled ${i.checked}>` +
          `&nbsp;${i.text}` +
          `</input>` +
          `</li>`
        : `<li>${i.text}</li>`;
    });

  if (hasCheckbox) {
    return ordered
      ? `<ol style="margin-left:0;padding:0">${output.join("")}</ol>`
      : `<ul style="margin-left:0;padding:0">${output.join("")}</ul>`;
  }

  return ordered
    ? `<ol>${output.join("")}</ol>`
    : `<ul>${output.join("")}</ul>`;
};

module.exports = renderer;
