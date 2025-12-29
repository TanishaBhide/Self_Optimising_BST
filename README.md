# Frequency-Aware Self-Optimizing Binary Search Tree (BST)

## Introduction

A **Binary Search Tree (BST)** is a widely used data structure that supports efficient searching, insertion, and deletion operations. Traditional BSTs are static in nature — once constructed, their structure does not adapt based on how frequently elements are accessed.  

In real-world systems, some data elements are accessed far more often than others. Treating all elements equally can lead to inefficient access patterns and slower practical performance.  

This project proposes a **Frequency-Aware Self-Optimizing BST** that learns from runtime access behavior and automatically reorganizes itself to improve search efficiency over time.

---

## Problem Statement

Traditional BSTs have the following limitations:

- They do not adapt to user access behavior.  
- Frequently accessed elements may remain deep in the tree.  
- The tree structure remains fixed during runtime.  
- No mechanism exists to optimize the tree based on real-time usage.  

**Need:** A self-adaptive BST that dynamically adjusts its structure based on search frequency to improve practical performance.

---
## Project Folder Structure

```frequency-aware-bst/
│
├─ web/                # UI part of the project
│   ├─ index.html           # Main HTML page
│   ├─ style.css            # Stylesheet for UI
│   └─ app.js            # Frontend JS, may handle form submission and table display
│
├─ bst/                 # BST logic and frequency-aware operations
│   ├─ normalBST.js         # Standard BST implementation
│   ├─ freqBST.js      # Frequency-aware self-optimizing BST (optional)
├─ README.md                # Project documentation
```
---
## Objectives

1. Implement a standard Binary Search Tree for insertion, searching, and traversal.  
2. Track access frequency of left and right branches at each node.  
3. Identify frequently accessed (hot) and rarely accessed (cold) branches.  
4. Dynamically reorder child pointers based on access frequency.  
5. Compare the performance of a traditional BST with the proposed self-optimizing BST.

---

## Proposed Methodology

### 1. BST Construction

- Elements are inserted using standard BST rules.  
- Each node contains:
  - Data value  
  - Left and right child pointers  
  - Left and right access frequency counters  

### 2. Frequency Tracking

- During searching:
  - If the search moves to the left child, the **left frequency counter** is incremented.  
  - If the search moves to the right child, the **right frequency counter** is incremented.  

### 3. Hot–Cold Branch Identification

- The branch with the **higher frequency** is treated as the **hot branch**.  
- The branch with the **lower frequency** is treated as the **cold branch**.  

### 4. Self-Optimization by Child Reordering

- If one branch is accessed significantly more than the other:
  - Swap the left and right child pointers.  
  - Swap their frequency counters.  
- This ensures that frequently accessed nodes are reachable faster.  

### 5. Performance Comparison

- Measure **search time** and **number of node visits**:
  - Before optimization (traditional BST)  
  - After optimization (self-optimizing BST)  
- Analyze the results to validate performance improvement.  

> A menu-driven program will be developed to allow insertion, searching, display, optimization, and performance comparison.

---

## Expected Outcome

- A fully functional self-optimizing BST.  
- Improved search performance for frequently accessed elements.  
- Clear numerical comparison between traditional BST and optimized BST.  

---

## Conclusion

This project introduces a novel enhancement to the classical Binary Search Tree by incorporating **frequency-based learning** and **adaptive reorganization**. By allowing the tree to modify itself based on real-time access patterns, the system improves practical performance while preserving fundamental BST properties.

---

## Usage

**To run the program:**

1. Clone the repository:
   ```bash
   git clone <repository-url>
2. Navigate to the project directory:
    ```bash
    cd frequency-aware-bst
3. Open index.html using live server 