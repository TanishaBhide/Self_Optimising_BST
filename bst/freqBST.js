// bst/freqBST.js
// Frequency-Aware Self-Optimizing BST for CONTACT NAMES

class FreqBSTNode {
  constructor(name) {
    this.key = name;     // contact name (string)
    this.left = null;
    this.right = null;

    // Frequency counters
    this.leftFreq = 0;
    this.rightFreq = 0;
  }
}

export class FreqBST {
  constructor() {
    this.root = null;
    this.nodeVisits = 0;

    // Optimization parameters
    this.FREQ_THRESHOLD = 3;   // minimum difference to trigger swap
    this.DECAY_FACTOR = 0.8;   // decay old frequencies
  }

  /* ===============================
     BASIC UTILITIES
     =============================== */
  resetVisits() {
    this.nodeVisits = 0;
  }

  /* ===============================
     INSERT (CONTACT NAME)
     =============================== */
  insert(name) {
    if (!name || typeof name !== "string") return;
    this.root = this._insert(this.root, name);
  }

  _insert(node, name) {
    if (!node) return new FreqBSTNode(name);

    const cmp = name.localeCompare(node.key);

    if (cmp < 0) {
      node.left = this._insert(node.left, name);
    } else if (cmp > 0) {
      node.right = this._insert(node.right, name);
    }
    // duplicate names ignored

    return node;
  }

  /* ===============================
     SEARCH (BOOLEAN)
     =============================== */
  search(name) {
    this.resetVisits();
    const found = this._search(this.root, name);

    if (found) {
      this._optimize(this.root);
    }

    return found;
  }

  _search(node, name) {
    if (!node) return false;

    this.nodeVisits++;

    const cmp = name.localeCompare(node.key);

    if (cmp === 0) return true;

    if (cmp < 0) {
      node.leftFreq++;
      return this._search(node.left, name);
    } else {
      node.rightFreq++;
      return this._search(node.right, name);
    }
  }

  /* ===============================
     SEARCH WITH PATH (FOR UI)
     =============================== */
  searchWithPath(name) {
    this.resetVisits();
    const path = [];
    let node = this.root;
    let found = false;

    while (node) {
      path.push(node.key);
      this.nodeVisits++;

      const cmp = name.localeCompare(node.key);

      if (cmp === 0) {
        found = true;
        break;
      }

      if (cmp < 0) {
        node.leftFreq++;
        node = node.left;
      } else {
        node.rightFreq++;
        node = node.right;
      }
    }

    if (found) {
      this._optimize(this.root);
    }

    return path;
  }

  /* ===============================
     SELF-OPTIMIZATION
     =============================== */
  _optimize(node) {
    if (!node) return;

    const diff = node.rightFreq - node.leftFreq;

    // Swap only if difference is significant
    if (Math.abs(diff) >= this.FREQ_THRESHOLD && diff > 0) {
      [node.left, node.right] = [node.right, node.left];
      [node.leftFreq, node.rightFreq] =
        [node.rightFreq, node.leftFreq];
    }

    // Decay frequencies
    node.leftFreq = Math.floor(node.leftFreq * this.DECAY_FACTOR);
    node.rightFreq = Math.floor(node.rightFreq * this.DECAY_FACTOR);

    this._optimize(node.left);
    this._optimize(node.right);
  }

  /* ===============================
     DELETE (CONTACT NAME)
     =============================== */
  delete(name) {
    this.root = this._delete(this.root, name);
  }

  _delete(node, name) {
    if (!node) return null;

    const cmp = name.localeCompare(node.key);

    if (cmp < 0) {
      node.left = this._delete(node.left, name);
    } else if (cmp > 0) {
      node.right = this._delete(node.right, name);
    } else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      const successor = this._minValueNode(node.right);
      node.key = successor.key;
      node.right = this._delete(node.right, successor.key);
    }

    return node;
  }

  _minValueNode(node) {
    while (node.left) node = node.left;
    return node;
  }

  /* ===============================
     HOT NODE DETECTION
     =============================== */
  getHotNodes(threshold = 3) {
    const hotNodes = new Set();

    function dfs(node) {
      if (!node) return;

      if (node.leftFreq + node.rightFreq >= threshold) {
        hotNodes.add(node.key);
      }

      dfs(node.left);
      dfs(node.right);
    }

    dfs(this.root);
    return hotNodes;
  }

  /* ===============================
     INORDER TRAVERSAL
     =============================== */
  inorder() {
    const result = [];
    this._inorder(this.root, result);
    return result;
  }

  _inorder(node, result) {
    if (!node) return;
    this._inorder(node.left, result);
    result.push(node.key);
    this._inorder(node.right, result);
  }
}
