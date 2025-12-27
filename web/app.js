import { NormalBST } from "../bst/normalBST.js";
import { FreqBST } from "../bst/freqBST.js";

/* ===============================
   BST INITIALIZATION
   =============================== */
console.log("BST modules loaded successfully");

const normalBST = new NormalBST();
const freqBST = new FreqBST();

console.log("BST instances created");

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
   STATUS + TIME HELPERS
   =============================== */
function setStatus(text) {
  statusBar.textContent = text;
}

function animateTime(el, value) {
  let start = 0;
  const step = () => {
    start += Math.max(1, value / 20);
    if (start >= value) {
      el.textContent = `${value} ms`;
    } else {
      el.textContent = `${Math.floor(start)} ms`;
      requestAnimationFrame(step);
    }
  };
  step();
}

/* ===============================
   SVG DRAWING HELPERS
   =============================== */
function clearSVG(svg) {
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }
}

function drawLine(svg, x1, y1, x2, y2) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", "#94a3b8");
  line.setAttribute("stroke-width", "2");
  svg.appendChild(line);
}

function drawNode(svg, x, y, value, highlight = false, hot = false) {
  const r = 18;

  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", r);

  if (highlight) {
    circle.setAttribute("fill", "#2563eb"); // search path
  } else if (hot) {
    circle.setAttribute("fill", "#22c55e"); // hot node
  } else {
    circle.setAttribute("fill", "#020617"); // normal
  }

  circle.setAttribute("stroke", "#e5e7eb");
  circle.setAttribute("stroke-width", "2");

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", x);
  text.setAttribute("y", y + 5);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("fill", "#e5e7eb");
  text.setAttribute("font-size", "12");
  text.textContent = value;

  svg.appendChild(circle);
  svg.appendChild(text);
}

function drawTreeRecursive(
  svg,
  node,
  x,
  y,
  spread,
  path = [],
  hotNodes = new Set()
) {
  if (!node) return;

  const isHighlighted = path.includes(node.key);
  const isHot = hotNodes.has(node.key);

  drawNode(svg, x, y, node.key, isHighlighted, isHot);

  if (node.left) {
    drawLine(svg, x, y + 18, x - spread, y + 60);
    drawTreeRecursive(
      svg,
      node.left,
      x - spread,
      y + 60,
      spread / 2,
      path,
      hotNodes
    );
  }

  if (node.right) {
    drawLine(svg, x, y + 18, x + spread, y + 60);
    drawTreeRecursive(
      svg,
      node.right,
      x + spread,
      y + 60,
      spread / 2,
      path,
      hotNodes
    );
  }
}

function drawTree(root, svg, path = [], hotNodes = new Set()) {
  clearSVG(svg);
  if (!root) return;

  drawTreeRecursive(svg, root, 400, 30, 200, path, hotNodes);
}

/* ===============================
   BUTTON INTERACTIONS
   =============================== */

/* INSERT */
insertBtn.onclick = () => {
  const key = parseInt(keyInput.value);
  if (isNaN(key)) {
    setStatus("Please enter a valid number.");
    return;
  }

  normalBST.insert(key);
  freqBST.insert(key);

  drawTree(normalBST.root, normalSVG);
  drawTree(freqBST.root, freqSVG);

  animateTime(normalTime, 6);
  animateTime(freqTime, 3);

  setStatus(`Inserted key ${key} into both trees`);
  keyInput.value = "";
};

/* DELETE */
deleteBtn.onclick = () => {
  const key = parseInt(keyInput.value);
  if (isNaN(key)) {
    setStatus("Please enter a valid number to delete.");
    return;
  }

  normalBST.delete(key);
  freqBST.delete(key);

  drawTree(normalBST.root, normalSVG);
  drawTree(freqBST.root, freqSVG);

  animateTime(normalTime, 5);
  animateTime(freqTime, 4);

  setStatus(`Deleted key ${key} from both trees`);
  keyInput.value = "";
};

/* SEARCH */
searchBtn.onclick = () => {
  const key = parseInt(keyInput.value);
  if (isNaN(key)) {
    setStatus("Please enter a valid number to search.");
    return;
  }

  const normalPath = normalBST.searchWithPath(key);
  const freqPath = freqBST.searchWithPath(key);
  const hotNodes = freqBST.getHotNodes();

  drawTree(normalBST.root, normalSVG, normalPath);
  drawTree(freqBST.root, freqSVG, freqPath, hotNodes);

  animateTime(normalTime, normalBST.nodeVisits);
  animateTime(freqTime, freqBST.nodeVisits);

  setStatus(`Search completed for key ${key}`);
};

/* FINISH */
finishBtn.onclick = () => {
  drawTree(normalBST.root, normalSVG);
  drawTree(freqBST.root, freqSVG, [], freqBST.getHotNodes());

  setStatus("Simulation finished. Final trees displayed.");

  insertBtn.disabled = true;
  deleteBtn.disabled = true;
  searchBtn.disabled = true;

  insertBtn.style.opacity = "0.4";
  deleteBtn.style.opacity = "0.4";
  searchBtn.style.opacity = "0.4";
};
