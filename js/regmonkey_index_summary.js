function renderRegmonkeyIndex(el) {
  const codeBlock = el.querySelector("pre code");
  if (!codeBlock) return;

  const rawYaml = codeBlock.innerText.trim();
  let parsedData;
  try {
    parsedData = jsyaml.load(rawYaml);
  } catch(e) {
    console.error("YAML parse error:", e);
    return;
  }

  const data = parsedData.regmonkey_index;
  if (!data || !data.children) return;

  let html = "";

  data.children.forEach((child, idx) => {
    if (!child.title) {
      // Simple numbered-section layout
      html += `<div class="numbered-section">
  <div class="number" style="font-size:${data.title_fontsize || '1.5em'};">${idx + 1}</div>
  <div class="section-text">`;

      if (child.description) {
        if (Array.isArray(child.description)) {
          html += "<ul>";
          child.description.forEach(d => html += `<li>${d}</li>`);
          html += "</ul>";
        } else {
          html += `<p>${child.description}</p>`;
        }
      }

      html += "</div><div class='divider'></div></div>";

    } else {
      // Fancy slide-container layout
      const widths = child.width.map(w => w + "%");
      const wLeft = widths[0];
      const wMid = widths[1];
      const wRight = widths[2] || "0%";

      const left = `<div class="flex flex-col justify-center" style="width:${wLeft};">
<div class="title" style="font-size:${data.title_fontsize}; color: #0e3666; font-weight: bold !important;">${child.title}</div>
</div>`;

      const bullets = child.description.map(li => `<li>${li}</li>`).join("\n");
      const middle = `<div class="flex flex-col justify-center" style="width:${wMid};">
<ul class="bullet-points content-text" style="font-size:${data.bullet_fontsize};">
${bullets}
</ul>
</div>`;

      let right = "";

      html += `<div class="slide-container flex flex-col" id="slide${idx + 1}">
<div class="flex flex-row justify-between h-full px-12 pt-1 pb-1">
${left}
${middle}
${right}
</div>
</div>`;

      if (idx < data.children.length - 1) {
        html += `<hr class="slide-divider my-1 border-gray-300">`;
      }
    }
  });

  // Replace original code block with generated HTML
  el.innerHTML = html;

  // --- MathJax typeset immediately after DOM insertion ---
  if (window.MathJax) {
    MathJax.typesetPromise([el]).catch(console.error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".regmonkey_index").forEach(renderRegmonkeyIndex);

  if (window.Reveal && window.MathJax) {
    Reveal.on("slidechanged", function (event) {
      MathJax.typesetPromise([event.currentSlide]).catch(console.error);
    });
  }
});
