# Fenwick Tree Visualizer

This repository contains a Fenwick Tree / Binary Indexed Tree visualization project.

The project is divided into two parts:

```text
DSA_Software_Engineer/
├── fenwick-visualizer/       React + TypeScript visualization UI
└── fenwick-backend-logic/    Earlier TypeScript backend logic implementation
```

---

## 1. fenwick-visualizer

`fenwick-visualizer` is the main React frontend project.

It visualizes basic Fenwick Tree operations, including:

- Generate an array
- Update an index by a delta
- Show the Fenwick Tree internal BIT array
- Show update trace
- Query prefix sum
- Show query trace
- Range query using prefix sums
- Highlight the BIT indices used during operations

### Run the visualizer

```bash
cd fenwick-visualizer
npm install
npm run dev
```

Then open the local URL shown in the terminal, usually:

```text
http://localhost:5173/
```

---

## 2. fenwick-backend-logic

`fenwick-backend-logic` contains the earlier TypeScript implementation of the Fenwick Tree logic.

It includes:

- `lowbit(x)`
- `update(index, delta)`
- `query(index)`
- `rangeQuery(left, right)`
- Fenwick Tree internal array logic
- Simple test / demo code

This folder was used as the backend logic prototype before building the React visualization.

---

## Project Goal

The goal of this project is to visualize how a Fenwick Tree works internally.

A Fenwick Tree supports:

- Point update in `O(log n)`
- Prefix sum query in `O(log n)`
- Range sum query in `O(log n)`

The visualization helps show which BIT indices are visited during update and query operations.

---

## Current Features

### Update

When updating `array[index] += delta`, the visualizer highlights the BIT indices affected by:

```text
i += lowbit(i)
```

Example:

```text
update(3, 5)
trace: 3 → 4 → 8
```

### Prefix Query

When querying `prefixSum(index)`, the visualizer highlights the BIT indices used by:

```text
i -= lowbit(i)
```

Example:

```text
query(7)
trace: 7 → 6 → 4
```

### Range Query

Range query is computed as:

```text
rangeQuery(left, right) = prefixSum(right) - prefixSum(left - 1)
```

The visualizer uses different colors to distinguish:

- indices added from `prefixSum(right)`
- indices subtracted from `prefixSum(left - 1)`

---

## Tech Stack

- TypeScript
- React
- Vite
- HTML / CSS
- GitHub
