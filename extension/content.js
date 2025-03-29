console.log("\ud83d\udcd8 MindLine content script loaded.");

let stylePreset = null;

function detectFontStyle(span) {
  const style = window.getComputedStyle(span);
  stylePreset = {
    fontSize: style.fontSize,
    fontFamily: style.fontFamily,
    color: style.color,
    lineHeight: style.lineHeight,
    fontWeight: style.fontWeight
  };
}

function isLikelyHard(text) {
  return (
    text.includes("=") ||
    text.length > 80 ||
    /\u2211|\u221a|\u222b|\u2192|dx|dy|log|sin|cos/.test(text)
  );
}

function createExplainButton(lineElement) {
  const button = document.createElement("button");
  button.innerText = "\u2728 Explain?";
  button.style.marginLeft = "10px";
  button.style.fontSize = "0.8em";
  button.style.cursor = "pointer";
  button.style.border = "none";
  button.style.background = "none";
  button.style.color = "#00bcd4";

  button.onclick = async () => {
    if (lineElement.nextSibling?.classList?.contains("mindline-explanation")) return;

    const explainBox = document.createElement("div");
    explainBox.className = "mindline-explanation";
    explainBox.innerText = "\u23f3 Asking the AI...";

    if (stylePreset) Object.assign(explainBox.style, stylePreset);
    lineElement.insertAdjacentElement("afterend", explainBox);

    const prompt = `Explain this line like a textbook: "${lineElement.textContent}"`;
    const aiText = await fetchOllamaResponse(prompt);

    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";

    const collapseBtn = document.createElement("button");
    collapseBtn.innerText = "[-]";
    collapseBtn.style.cursor = "pointer";
    collapseBtn.style.border = "none";
    collapseBtn.style.background = "none";
    collapseBtn.style.color = "#aaa";
    collapseBtn.title = "Collapse explanation";

    let isCollapsed = false;

    collapseBtn.onclick = () => {
      isCollapsed = !isCollapsed;
      explanationText.style.display = isCollapsed ? "none" : "block";
      collapseBtn.innerText = isCollapsed ? "[+]" : "[-]";
    };

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "\u274c";
    closeBtn.style.marginLeft = "8px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.border = "none";
    closeBtn.style.background = "none";
    closeBtn.style.color = "#aaa";
    closeBtn.title = "Remove explanation";

    closeBtn.onclick = () => explainBox.remove();

    const explanationText = document.createElement("div");
    explanationText.innerText = `\ud83d\udd0d ${aiText}`;
    explanationText.style.marginTop = "5px";

    header.appendChild(collapseBtn);
    header.appendChild(closeBtn);

    explainBox.innerHTML = "";
    explainBox.appendChild(header);
    explainBox.appendChild(explanationText);
  };

  return button;
}

function injectMindLineHelpers() {
  const textLayer = document.querySelector(".textLayer");
  if (!textLayer) {
    console.warn("❌ No .textLayer found — aborting.");
    return;
  }

  const spans = textLayer.querySelectorAll("span");
  console.log(`🔍 Found ${spans.length} spans inside .textLayer`);

  spans.forEach((span) => {
    const text = span.textContent.trim();
    console.log("Checking:", text);

    if (!text) return;
    if (span.classList.contains("mindline-injected")) return;

    if (!stylePreset) detectFontStyle(span);

    if (isLikelyHard(text)) {
      console.log("🧠 Hard line found:", text);
      span.classList.add("mindline-injected");
      const button = createExplainButton(span);
      span.appendChild(button);
    }
  });
}

// 🧠 Retry until .textLayer and spans are loaded
function observeTextLayerAndInject() {
  const observer = new MutationObserver((mutations, obs) => {
    const textLayer = document.querySelector(".textLayer");
    const spans = textLayer?.querySelectorAll("span") || [];

    if (textLayer && spans.length > 50) {
      console.log("✅ TextLayer loaded via MutationObserver");
      obs.disconnect(); // stop watching
      injectMindLineHelpers();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  console.log("👀 Watching DOM for .textLayer to appear...");
}

observeTextLayerAndInject();

async function fetchOllamaResponse(promptText) {
  try {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "tinyllama", // or mistral if memory allows
        prompt: promptText,
        stream: false
      })
    });

    if (!res.ok) {
      console.error("🛑 Response not OK:", res.status);
      return "⚠️ AI connection failed. Try restarting Ollama.";
    }

    const data = await res.json();
    console.log("🧠 AI said:", data);
    return data.response || "⚠️ No response from AI.";
  } catch (err) {
    console.error("Ollama fetch error:", err);
    return "⚠️ Failed to connect to AI.";
  }
}
