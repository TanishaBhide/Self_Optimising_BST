const statusBar = document.getElementById("statusBar");
const normalTree = document.getElementById("normalTree");
const freqTree = document.getElementById("freqTree");
const normalTime = document.getElementById("normalTime");
const freqTime = document.getElementById("freqTime");

const insertBtn = document.getElementById("insertBtn");
const deleteBtn = document.getElementById("deleteBtn");
const finishBtn = document.getElementById("finishBtn");

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

/* BUTTON INTERACTIONS */

insertBtn.onclick = () => {
  setStatus("Insert operation triggered.");
  normalTree.textContent = "🌱 Node inserted";
  freqTree.textContent = "⚡ Node inserted (learning)";
  animateTime(normalTime, 6);
  animateTime(freqTime, 3);
};

deleteBtn.onclick = () => {
  setStatus("Delete operation triggered.");
  normalTree.textContent = "🪓 Node deleted";
  freqTree.textContent = "🧠 Node deleted (re-optimising)";
  animateTime(normalTime, 5);
  animateTime(freqTime, 4);
};

finishBtn.onclick = () => {
  setStatus("Simulation finished. Trees locked.");
  normalTree.textContent = "✅ Final state";
  freqTree.textContent = "🏁 Optimised final state";

  insertBtn.disabled = true;
  deleteBtn.disabled = true;

  insertBtn.style.opacity = "0.4";
  deleteBtn.style.opacity = "0.4";
};
