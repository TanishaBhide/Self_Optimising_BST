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
   STATUS
   =============================== */
function setStatus(text) {
  statusBar.textContent = text;
}

/* ===============================
   SVG HELPERS
   =============================== */
function clearSVG(svg) {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
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

/* ===============================
   RECTANGLE NODE (KEY CHANGE)
   =============================== */
function drawNode(svg, x, y, value, highlight = false, hot = false) {
  const paddingX = 10;
  const paddingY = 6;
  const fontSize = 13;

  const tempText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  tempText.setAttribute("font-size", fontSize);
  tempText.textContent = value;
  svg.appendChild(tempText);

  const textWidth = tempText.getBBox().width;
  svg.removeChild(tempText);

  const rectWidth = textWidth + paddingX * 2;
  const rectHeight = fontSize + paddingY * 2;

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", x - rectWidth / 2);
  rect.setAttribute("y", y - rectHeight / 2);
  rect.setAttribute("width", rectWidth);
  rect.setAttribute("height", rectHeight);
  rect.setAttribute("rx", 6);
  rect.setAttribute("ry", 6);

  if (highlight) rect.setAttribute("fill", "#2563eb");
  else if (hot) rect.setAttribute("fill", "#22c55e");
  else rect.setAttribute("fill", "#020617");

  rect.setAttribute("stroke", "#e5e7eb");
  rect.setAttribute("stroke-width", "2");

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", x);
  text.setAttribute("y", y + fontSize / 3);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("fill", "#e5e7eb");
  text.setAttribute("font-size", fontSize);
  text.setAttribute("font-weight", "600");
  text.textContent = value;

  svg.appendChild(rect);
  svg.appendChild(text);
}

/* ===============================
   TREE DRAWING
   =============================== */
function drawTreeRecursive(svg, node, x, y, spread, path, hotNodes) {
  if (!node) return;

  drawNode(
    svg,
    x,
    y,
    node.key,
    path.includes(node.key),
    hotNodes.has(node.key)
  );

  const nextY = y + 70;

  if (node.left) {
    drawLine(svg, x, y + 18, x - spread, nextY - 18);
    drawTreeRecursive(
      svg,
      node.left,
      x - spread,
      nextY,
      spread * 0.7,
      path,
      hotNodes
    );
  }

  if (node.right) {
    drawLine(svg, x, y + 18, x + spread, nextY - 18);
    drawTreeRecursive(
      svg,
      node.right,
      x + spread,
      nextY,
      spread * 0.7,
      path,
      hotNodes
    );
  }
}

function drawTree(root, svg, path = [], hotNodes = new Set()) {
  clearSVG(svg);
  if (!root) return;

  // Compact, readable start position
  drawTreeRecursive(svg, root, 450, 50, 180, path, hotNodes);
}

/* ===============================
   BUTTON ACTIONS
   =============================== */

/* INSERT */
insertBtn.onclick = () => {
  const name = keyInput.value.trim();
  if (!name) {
    setStatus("Please enter a contact name.");
    return;
  }

  normalBST.insert(name);
  freqBST.insert(name);

  drawTree(normalBST.root, normalSVG);
  drawTree(freqBST.root, freqSVG);

  setStatus(`Inserted contact "${name}"`);
  keyInput.value = "";
};

/* DELETE */
deleteBtn.onclick = () => {
  const name = keyInput.value.trim();
  if (!name) {
    setStatus("Please enter a contact name to delete.");
    return;
  }

  normalBST.delete(name);
  freqBST.delete(name);

  drawTree(normalBST.root, normalSVG);
  drawTree(freqBST.root, freqSVG);

  setStatus(`Deleted contact "${name}"`);
  keyInput.value = "";
};

/* SEARCH */
searchBtn.onclick = () => {
  const name = keyInput.value.trim();
  if (!name) {
    setStatus("Please enter a contact name to search.");
    return;
  }

  let start = performance.now();
  const normalPath = normalBST.searchWithPath(name);
  let end = performance.now();
  normalTime.textContent = `${(end - start).toFixed(3)} ms`;

  start = performance.now();
  const freqPath = freqBST.searchWithPath(name);
  end = performance.now();
  freqTime.textContent = `${(end - start).toFixed(3)} ms`;

  drawTree(normalBST.root, normalSVG, normalPath);
  drawTree(freqBST.root, freqSVG, freqPath, freqBST.getHotNodes());

  setStatus(`Search completed for "${name}"`);
};

/* FINISH */
finishBtn.onclick = () => {
  drawTree(normalBST.root, normalSVG);
  drawTree(freqBST.root, freqSVG, [], freqBST.getHotNodes());

  insertBtn.disabled = true;
  deleteBtn.disabled = true;
  searchBtn.disabled = true;

  setStatus("Simulation finished. Final trees displayed.");
};
