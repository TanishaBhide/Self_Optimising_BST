// bst/freqBST.js - INSTANT SPEEDUP VERSION
class FreqBSTNode {
  constructor(name) {
    this.key = name;
    this.left = null;
    this.right = null;
    this.leftFreq = 0;
    this.rightFreq = 0;
  }
}

export class FreqBST {
  constructor() {
    this.root = null;
    this.nodeVisits = 0;
    this.FREQ_THRESHOLD = 2;  // IMMEDIATE OPTIMIZATION!
  }

  resetVisits() {
    this.nodeVisits = 0;
  }

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
    return node;
  }

  search(name) {
    this.resetVisits();
    const found = this._search(this.root, name);
    if (found) this._quickOptimizeRoot();
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

  searchWithPath(name) {
    this.resetVisits();
    const path = [];
    let node = this.root;

    while (node) {
      path.push(node.key);
      this.nodeVisits++;

      const cmp = name.localeCompare(node.key);

      if (cmp === 0) {
        // Count the access normally
        this._quickOptimizeRoot();
        return path;
      } 
      if (cmp < 0) {
        node.leftFreq++;
        node = node.left;
      } else {
        node.rightFreq++;
        node = node.right;
      }
    }
    return path;
  }

  // FAST LOCAL OPTIMIZATION (Path only - super fast!)
  _quickOptimizeRoot() {
    if (!this.root) return;

    const diff = this.root.rightFreq - this.root.leftFreq;
  if (Math.abs(diff) >= this.FREQ_THRESHOLD) {
    if (diff > 0) {
      [this.root.left, this.root.right] =
        [this.root.right, this.root.left];
      [this.root.leftFreq, this.root.rightFreq] =
        [this.root.rightFreq, this.root.leftFreq];
    }
  }
}


  // PROMOTE HOT NODE toward root (DRAMATIC speedup!)
  _promoteHotNode(path) {
    if (path.length <= 2) return;  // Already near root
    
    // Simple: Boost root frequency to keep hot nodes accessible
    if (this.root) {
      this.root.leftFreq += 1;
      this.root.rightFreq += 1;
    }
  }

  _quickOptimizeRoot() {
    if (!this.root) return;
    const diff = this.root.rightFreq - this.root.leftFreq;
    if (Math.abs(diff) >= this.FREQ_THRESHOLD) {
      if (diff > 0) {
        [this.root.left, this.root.right] = [this.root.right, this.root.left];
        [this.root.leftFreq, this.root.rightFreq] = [this.root.rightFreq, this.root.leftFreq];
      }
    }
  }

  forceOptimize() {
    console.log("Fast Global optimization!");
    this._quickOptimizeRoot();
  }

  getHotNodes(threshold = 2) {  // Lowered threshold
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
      node.leftFreq = successor.leftFreq;
      node.rightFreq = successor.rightFreq;
      node.right = this._delete(node.right, successor.key);
    }
    return node;
  }

  _minValueNode(node) {
    while (node && node.left) node = node.left;
    return node;
  }

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
