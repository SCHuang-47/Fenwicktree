# Fenwick Tree Visualizer

An interactive visualization project for the Fenwick Tree, also known as the Binary Indexed Tree.

This project demonstrates how Fenwick Tree operations work internally, including update, prefix sum query, range query, covered intervals, and the structural relationship between query and update paths.

## Features

- Initialize an array with a selected size
- Build the corresponding Fenwick Tree array
- Visualize `update(index, delta)` step by step
- Visualize `prefixSum(index)` step by step
- Visualize `rangeQuery(left, right)` as:

```text
prefixSum(right) - prefixSum(left - 1)
```

- Show the covered interval of each active BIT node
- Highlight BIT array cells during operations
- Display operation traces
- Display query results only when relevant
- Show a color legend for different operation meanings
- Visualize Query Tree and Update Tree layouts
- Smoothly morph the tree between Query Tree and Update Tree
- Highlight tree nodes together with the operation trace
- Display BIT values inside tree nodes

## Visualization Concepts

### Fenwick Tree Array

Each `bit[i]` stores the sum of a specific interval in the original array.

```text
bit[i] covers [i - lowbit(i) + 1, i]
```

where:

```text
lowbit(i) = i & -i
```

For example:

```text
bit[8] covers [1, 8]
bit[6] covers [5, 6]
bit[7] covers [7, 7]
```

## Operations

### Update

The update operation follows:

```text
i -> i + lowbit(i)
```

Example:

```text
update(3, delta): 3 -> 4 -> 8
```

During the animation, each affected BIT cell is highlighted and updated step by step.

### Prefix Sum Query

The prefix sum query follows:

```text
i -> i - lowbit(i)
```

Example:

```text
query(7): 7 -> 6 -> 4
```

The result is computed by summing the BIT values along the query path.

### Range Query

Range query is computed as:

```text
rangeQuery(left, right) = prefixSum(right) - prefixSum(left - 1)
```

The visualization uses different colors to distinguish:

```text
Blue: nodes added by prefixSum(right)
Orange: nodes subtracted by prefixSum(left - 1)
Overlap: nodes that appear in both paths
Yellow: current update/query step
```

## Tree View

The project includes two Fenwick Tree structural views.

### Query Tree

The Query Tree follows:

```text
i -> i - lowbit(i)
```

This shows how prefix sum queries move toward index `0`.

### Update Tree

The Update Tree follows:

```text
i -> i + lowbit(i)
```

This shows how update operations propagate toward larger BIT buckets.

The tree smoothly morphs between the Query Tree and Update Tree layouts when different operations are performed.

## Project Structure

```text
Fenwicktree/
├── fenwick-visualizer/
│   ├── src/
│   │   ├── App.tsx
│   │   └── App.css
│   ├── package.json
│   └── ...
├── fenwick-backend-logic/
└── README.md
```

## Run Locally

Enter the visualizer directory:

```bash
cd fenwick-visualizer
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open the local URL shown in the terminal, usually:

```text
http://localhost:5173/
```

## Build

To check whether the project builds successfully:

```bash
npm run build
```

## Tech Stack

- React
- TypeScript
- Vite
- CSS

## Notes

This project was created as a personal visualization project to better understand Fenwick Tree behavior through animation and interactive operation traces.
