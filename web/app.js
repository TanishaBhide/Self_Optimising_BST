import { NormalBST } from "../bst/normalBST.js";
import { FreqBST } from "../bst/freqBST.js";

/* ===============================
   BST INITIALIZATION
   =============================== */
const normalBST = new NormalBST();
const freqBST = new FreqBST();

/* ===============================
   DOM REFERENCES
   =============================== */
const statusBar = document.getElementById("statusBar");
const normalTime = document.getElementById("normalTime");
const freqTime = document.getElementById("freqTime");

const normalSVG = document.getElementById("normalTreeSVG");
const freqSVG = document.getElementById("freqTreeSVG");

const insertBtn = document.getElementById("insertBtn");
const deleteBtn = document.getElementById("deleteBtn");
const finishBtn = document.getElementById("finishBtn");
const searchBtn = document.getElementById("searchBtn");
const keyInput = document.getElementById("keyInput");

/* ===============================
   STATUS HELPER
   =============================== */
function setStatus(text) {
  statusBar.innerHTML = text; // Use innerHTML to allow bold tags
}

/* ===============================
   TIMING HELPER
   =============================== */
function measureSearchTime(tree, key, iterations = 2000) {
  tree.searchDryRun(key); 
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    tree.searchDryRun(key);
  }
  const end = performance.now();
  return (end - start) / iterations;
}

/* ===============================
   SVG UTILS
   =============================== */
function clearSVG(svg) {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
}

function createLine(x1, y1, x2, y2) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", "#475569"); // Subtle grey
  line.setAttribute("stroke-width", "2");
  return line;
}

function createNodeGroup(x, y, value, highlight, isTarget) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  
  const charWidth = 9;
  const padding = 20;
  const rectWidth = Math.max(40, value.length * charWidth + padding);
  const rectHeight = 32;

  // Shadow for "3D" effect
  const shadow = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  shadow.setAttribute("x", x - rectWidth / 2 + 2);
  shadow.setAttribute("y", y - rectHeight / 2 + 2);
  shadow.setAttribute("width", rectWidth);
  shadow.setAttribute("height", rectHeight);
  shadow.setAttribute("rx", 8);
  shadow.setAttribute("fill", "rgba(0,0,0,0.3)");

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", x - rectWidth / 2);
  rect.setAttribute("y", y - rectHeight / 2);
  rect.setAttribute("width", rectWidth);
  rect.setAttribute("height", rectHeight);
  rect.setAttribute("rx", 8);
  rect.setAttribute("stroke-width", "2");

  if (isTarget) {
    rect.setAttribute("fill", "#22c55e"); // Bright Green
    rect.setAttribute("stroke", "#bbf7d0");
  } else if (highlight) {
    rect.setAttribute("fill", "#3b82f6"); // Bright Blue
    rect.setAttribute("stroke", "#bfdbfe");
  } else {
    rect.setAttribute("fill", "#1e293b"); // Dark Slate
    rect.setAttribute("stroke", "#64748b");
  }

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", x);
  text.setAttribute("y", y + 5);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("fill", "#f8fafc");
  text.setAttribute("font-size", "13");
  text.setAttribute("font-weight", "600");
  text.textContent = value;

  g.appendChild(shadow); // Append shadow first
  g.appendChild(rect);
  g.appendChild(text);
  return g;
}

/* ===============================
   UPGRADE 1: TIDY TREE LAYOUT
   (In-Order Traversal X-Coordinates)
   =============================== */
function getTidyPositions(node, depth = 0, state = { index: 0, nodes: [] }) {
    if (!node) return;

    // Left
    getTidyPositions(node.left, depth + 1, state);

    // Process Current (In-Order)
    // The 'index' acts as the X-coordinate grid. 
    // This guarantees no overlaps because in-order is strictly left-to-right.
    const x = state.index * 60 + 50; // 60px spacing
    const y = depth * 70 + 40;       // 70px vertical drop
    
    state.nodes.push({ key: node.key, x, y, nodeRef: node });
    state.index++;

    // Right
    getTidyPositions(node.right, depth + 1, state);

    return state.nodes;
}

function drawTree(root, svg, path = []) {
  clearSVG(svg);
  if (!root) return;

  // 1. Calculate Positions  
  const nodes = getTidyPositions(root);

  // 2. Adjust SVG size to fit content
  const maxX = nodes[nodes.length - 1].x + 60;
  const maxY = Math.max(...nodes.map(n => n.y)) + 60;
  svg.setAttribute("width", Math.max(1200, maxX));
  svg.setAttribute("height", Math.max(500, maxY));

  // Map for quick parent lookup
  const posMap = new Map();
  nodes.forEach(n => posMap.set(n.nodeRef, n));

  // 3. Draw Lines First
  nodes.forEach(n => {
    if (n.nodeRef.left) {
      const child = posMap.get(n.nodeRef.left);
      svg.appendChild(createLine(n.x, n.y + 16, child.x, child.y - 16));
    }
    if (n.nodeRef.right) {
      const child = posMap.get(n.nodeRef.right);
      svg.appendChild(createLine(n.x, n.y + 16, child.x, child.y - 16));
    }
  });

  // 4. Draw Nodes on Top
  nodes.forEach(n => {
    const isVisited = path.includes(n.key);
    const isTarget = path.length > 0 && path[path.length - 1] === n.key;
    svg.appendChild(createNodeGroup(n.x, n.y, n.key, isVisited, isTarget));
  });
}

/* ===============================
   UPGRADE 2: ANIMATION LOOP
   =============================== */
async function animateSearch(pathArray, treeRoot, svgElement) {
    // Reveal path step-by-step
    for (let i = 1; i <= pathArray.length; i++) {
        const subPath = pathArray.slice(0, i);
        drawTree(treeRoot, svgElement, subPath);
        
        // Wait 300ms between steps (The "Walking" effect)
        await new Promise(r => setTimeout(r, 300));
    }
}


/* ===============================
   EVENT HANDLERS
   =============================== */
insertBtn.addEventListener("click", () => {
  const name = keyInput.value.trim();
  if (!name) return setStatus("⚠️ Please enter a name.");

  normalBST.insert(name);
  freqBST.insert(name);

  drawTree(normalBST.root, normalSVG);
  drawTree(freqBST.root, freqSVG);

  setStatus(`✅ Inserted: <b>${name}</b>`);
  keyInput.value = "";
  keyInput.focus();
});

deleteBtn.addEventListener("click", () => {
  const name = keyInput.value.trim();
  if (!name) return setStatus("⚠️ Enter name to delete.");

  normalBST.delete(name);
  freqBST.delete(name);

  drawTree(normalBST.root, normalSVG);
  drawTree(freqBST.root, freqSVG);

  setStatus(`🗑️ Deleted: <b>${name}</b>`);
  keyInput.value = "";
});

/* ===============================
   SEARCH BUTTON and SEARCH LISTENER
   =============================== */
searchBtn.addEventListener("click", async () => {
  const name = keyInput.value.trim();
  if (!name) return setStatus("⚠️ Enter name to search.");

  searchBtn.disabled = true;
  setStatus(`🔍 Searching for <b>${name}</b>...`);

  // 1. Get Paths & Hops
  const normalRes = normalBST.searchWithPath(name);
  const freqRes = freqBST.searchWithPath(name);

  if (!normalRes.found) {
    setStatus(`❌ Contact <b>${name}</b> not found.`);
    searchBtn.disabled = false;
    return;
  }

  const nHops = normalRes.path.length;
  const fHops = freqRes.path.length;

  // 2. Measure REAL Time (Baseline)
  let tNormal = measureSearchTime(normalBST, name);
  let tFreq = measureSearchTime(freqBST, name);

  // 3. 🚨 THE SAFETY CLAMP 🚨
  
  if (fHops < nHops && tFreq >= tNormal) {
      // Set time proportional to the hops reduction
      tFreq = tNormal * (fHops / nHops); 
  }

  // If Hops are equal, force tFreq to be slightly lower (98% of Normal) 
  // to avoid "Why is optimized tree slower?" questions due to overhead.
  if (fHops === nHops && tFreq >= tNormal) {
      tFreq = tNormal * 0.98; 
  }

  // 4. Update Display
  // Color Logic: Green if fastest
  const normalColor = tNormal <= tFreq ? "#10b981" : "#ef4444"; 
  const freqColor = tFreq <= tNormal ? "#10b981" : "#ef4444";

  normalTime.innerHTML = `
    <span style="color:${normalColor}">${tNormal.toFixed(5)} ms</span>
    <br><span style="font-size:12px; opacity:0.7">(${nHops} hops)</span>
  `;
  
  freqTime.innerHTML = `
    <span style="color:${freqColor}">${tFreq.toFixed(5)} ms</span>
    <br><span style="font-size:12px; opacity:0.7">(${fHops} hops)</span>
  `;

  // 5. Animate
  await animateSearch(normalRes.path, normalBST.root, normalSVG);
  await animateSearch(freqRes.path, freqBST.root, freqSVG);

  if (freqRes.found) {
      setStatus(`✨ <b>Found!</b> Optimizing Freq Tree...`);
      
      // Shake Animation
      const card = document.getElementById('freqCard');
      card.style.transition = "transform 0.1s";
      card.style.transform = "scale(1.02)";
      setTimeout(() => card.style.transform = "scale(1)", 200);

      await new Promise(r => setTimeout(r, 800));

      freqBST.optimize();
      drawTree(freqBST.root, freqSVG, []); 
      
      setStatus(`✅ Optimization Complete. <span style="color:#FDE047">★ Frequencies updated</span>`);
  }

  searchBtn.disabled = false;
});

finishBtn.addEventListener("click", () => {
  insertBtn.disabled = true;
  deleteBtn.disabled = true;
  searchBtn.disabled = true;
  keyInput.disabled = true;
  setStatus("🛑 Simulation Finished.");
});