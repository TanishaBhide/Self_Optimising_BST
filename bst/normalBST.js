// bst/normalBST.js
// Normal BST for CONTACT NAME searching (string-based)

class NormalBSTNode {
  constructor(name) {
    this.key = name;   // contact name (string)
    this.left = null;
    this.right = null;
  }
}

export class NormalBST {
  constructor() {
    this.root = null;
    this.nodeVisits = 0;
  }

  /* ===============================
     Resetting
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
    if (!node) return new NormalBSTNode(name);

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
     SEARCH
     =============================== */
  search(name) {
    this.resetVisits();
    return this._search(this.root, name);
  }

  _search(node, name) {
    if (!node) return false;

    this.nodeVisits++;

    const cmp = name.localeCompare(node.key);

    if (cmp === 0) return true;
    if (cmp < 0) return this._search(node.left, name);
    return this._search(node.right, name);
  }

   /* ===============================
     SEARCH DRY RUN (For Timing)
     =============================== */
    searchDryRun(name) {
        let node = this.root;
        while(node) {
            const cmp = name.localeCompare(node.key);
            if (cmp === 0) return true;
            if (cmp < 0) node = node.left;
            else node = node.right;
        }
        return false;
    }

  /* ===============================
     SEARCH WITH PATH (FOR VISUALIZATION)
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
      node = cmp < 0 ? node.left : node.right;
    }

    return { path, found };
  }

  /* ===============================
     DELETE
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
}