// bst/freqBST.js

class FreqBSTNode {
  constructor(key) {
    this.key = key;
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
     INSERT
     =============================== */
  insert(key) {
    this.root = this._insert(this.root, key);
  }

  _insert(node, key) {
    if (!node) return new FreqBSTNode(key);

    if (key < node.key) {
      node.left = this._insert(node.left, key);
    } else if (key > node.key) {
      node.right = this._insert(node.right, key);
    }

    return node;
  }

  /* ===============================
     SEARCH (BOOLEAN)
     =============================== */
  search(key) {
    this.resetVisits();
    const found = this._search(this.root, key);

    if (found) {
      this._optimize(this.root);
    }

    return found;
  }

  _search(node, key) {
    if (!node) return false;

    this.nodeVisits++;

    if (node.key === key) return true;

    if (key < node.key) {
      node.leftFreq++;
      return this._search(node.left, key);
    } else {
      node.rightFreq++;
      return this._search(node.right, key);
    }
  }

  /* ===============================
     SEARCH WITH PATH (FOR VISUALIZATION)
     =============================== */
  searchWithPath(key) {
    this.resetVisits();
    const path = [];
    let node = this.root;
    let found = false;

    while (node) {
      path.push(node.key);
      this.nodeVisits++;

      if (node.key === key) {
        found = true;
        break;
      }

      if (key < node.key) {
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
     SELF-OPTIMIZATION (THRESHOLD + DECAY)
     =============================== */
  _optimize(node) {
    if (!node) return;

    const diff = node.rightFreq - node.leftFreq;

    // Swap only if frequency difference is significant
    if (Math.abs(diff) >= this.FREQ_THRESHOLD) {
      if (diff > 0) {
        // Right branch is hotter → bring it to preferred side
        [node.left, node.right] = [node.right, node.left];
        [node.leftFreq, node.rightFreq] =
          [node.rightFreq, node.leftFreq];
      }
    }

    // Frequency decay (prevents stale hot branches)
    node.leftFreq = Math.floor(node.leftFreq * this.DECAY_FACTOR);
    node.rightFreq = Math.floor(node.rightFreq * this.DECAY_FACTOR);

    this._optimize(node.left);
    this._optimize(node.right);
  }

  /* ===============================
     DELETE
     =============================== */
  delete(key) {
    this.root = this._delete(this.root, key);
  }

  _delete(node, key) {
    if (!node) return null;

    if (key < node.key) {
      node.left = this._delete(node.left, key);
    } else if (key > node.key) {
      node.right = this._delete(node.right, key);
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
     HOT NODE DETECTION (FOR UI)
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
