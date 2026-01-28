// freqBST.js - OPTIMIZED & ROBUST VERSION

class FreqBSTNode {
  constructor(name) {
    this.key = name;
    this.left = null;
    this.right = null;
    this.frequency = 1; // Start at 1 on creation
  }
}

export class FreqBST {
  constructor() {
    this.root = null;
    this.FREQ_THRESHOLD = 2;
  }

  /* ================= INSERT ================= */

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
    } else {
      // Duplicate insertion = access
      node.frequency++;
    }
    return node;
  }

  /* ================= SEARCH ================= */

  searchDryRun(name) {
    if (!this.root) return false;

    let node = this.root;
    while (node) {
      const cmp = name.localeCompare(node.key);
      if (cmp === 0) return true;
      node = cmp < 0 ? node.left : node.right;
    }
    return false;
  }

  searchWithPath(name) {
    if (!this.root) {
      return { path: [], found: false };
    }

    const path = [];
    let node = this.root;
    let foundNode = null;

    while (node) {
      path.push(node.key);
      const cmp = name.localeCompare(node.key);

      if (cmp === 0) {
        node.frequency++;
        foundNode = node;
        break;
      }
      node = cmp < 0 ? node.left : node.right;
    }

    // Optimize only on successful search
    if (foundNode) {
      this.optimize();
    }

    return { path, found: !!foundNode };
  }

  /* ================= OPTIMIZATION ================= */

  optimize() {
    // No need to optimize empty or single-node trees
    if (!this.root || (!this.root.left && !this.root.right)) return;
    this.root = this._optimizeRecursive(this.root);
  }

  _optimizeRecursive(node) {
    if (!node) return null;

    node.left = this._optimizeRecursive(node.left);
    node.right = this._optimizeRecursive(node.right);

    const leftFreq = node.left ? node.left.frequency : 0;
    const rightFreq = node.right ? node.right.frequency : 0;

    // Rotate based on skewed access
    if (node.left && leftFreq > node.frequency + this.FREQ_THRESHOLD) {
      return this._rotateRight(node);
    }

    if (node.right && rightFreq > node.frequency + this.FREQ_THRESHOLD) {
      return this._rotateLeft(node);
    }

    return node;
  }

  _rotateRight(y) {
    const x = y.left;
    y.left = x.right;
    x.right = y;
    return x;
  }

  _rotateLeft(x) {
    const y = x.right;
    x.right = y.left;
    y.left = x;
    return y;
  }

  /* ================= DELETE ================= */

  delete(name) {
    if (!this.root) return;
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
      node.frequency = successor.frequency;
      node.right = this._delete(node.right, successor.key);
    }
    return node;
  }

  _minValueNode(node) {
    while (node.left) node = node.left;
    return node;
  }
}
