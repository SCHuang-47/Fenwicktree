import "./App.css";
import { useState } from "react";

function App() {
  const initialArray = generateArray(8);
  const [size, setSize] = useState(8);
  const [array, setArray] = useState(initialArray);
  const [bitArray, setBitArray] = useState(buildFenwickArray(initialArray));
  const [targetIndex, setTargetIndex] = useState(1);
  const [queryIndex, setQueryIndex] = useState(1);
  const [delta, setDelta] = useState(1);
  const [trace, setTrace] = useState<number[]>([]);
  const [highlightTrace, setHighlightTrace] = useState<number[]>([]);
  const [queryResult, setQueryResult] = useState(0);
  const [operation, setOperation] = useState("");
  const [leftIndex, setLeftIndex] = useState(1);
  const [rightIndex, setRightIndex] = useState(1);
  const [addTrace, setAddTrace] = useState<number[]>([]);
  const [subtractTrace, setSubtractTrace] = useState<number[]>([]);
  const [activeCoverLeft, setActiveCoverLeft] = useState(0);
  const [activeCoverRight, setActiveCoverRight] = useState(0);
  const [activeBitIndex, setActiveBitIndex] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(700);
  const [coverageMode, setCoverageMode] = useState("");
  const [treeMode, setTreeMode] = useState<"query" | "update">("query");

  const treeSvgWidth = 1700;
  const queryLayout = buildQueryLayout();
  const updateLayout = buildUpdateLayout();
  const [currentPositions, setCurrentPositions] = useState(queryLayout.positions);
  const activeLayout = treeMode === "query" ? queryLayout : updateLayout;
  const treeHeight =
    Math.max(
      ...Object.values(queryLayout.positions).map((pos) => pos.y),
      ...Object.values(updateLayout.positions).map((pos) => pos.y)
    ) + 40;

  function generateArray(size: number) {
    const result: number[] = [];

    for (let i = 0; i < size; i++) {
      result.push(i);
    }

    return result;
  }

  function buildFenwickArray(array: number[]) {
    const bit = Array.from({ length: array.length }, () => 0);

    for (let index = 1; index <= array.length; index++) {
      for (let i = index; i <= array.length; i += lowbit(i)) {
        bit[i - 1] += array[index - 1];
      }
    }

    return bit;
  }

  function lowbit(x: number) {
    return x & -x;
  }

  function coverLeft(index: number) {
    return index - lowbit(index) + 1;
  }

  function queryParent(i: number) {
    return i - lowbit(i);
  }

  function updateNext(i: number) {
    return i + lowbit(i);
  }

  function queryLevel(i: number): number {
    let now = i;
    let cnt = 0;

    while (now !== 0) {
      cnt++;
      now = queryParent(now);
    }

    return cnt;
  }

  function updateLevel(i: number, treeLength = array.length): number {
    let now = i;
    let cnt = 0;

    while (now <= treeLength) {
      cnt++;
      now = updateNext(now);
    }

    return cnt;
  }

  function buildQueryLayout(treeLength = array.length) {
    const positions: Record<number, { x: number; y: number }> = {};
    const edges: { from: number; to: number }[] = [];

    const svgWidth = treeSvgWidth;
    const normalGapX = 90;
    const minGapX = 35;
    const marginX = 40;

    const gapX = Math.max(
      minGapX,
      Math.min(normalGapX, (svgWidth - 2 * marginX) / treeLength)
    );

    const gapY = 60;
    const startX = marginX;
    const startY = 40;

    positions[0] = {
      x: startX,
      y: startY,
    };

    for (let bitIndex = 1; bitIndex <= treeLength; bitIndex++) {
      const parent = queryParent(bitIndex);

      positions[bitIndex] = {
        x: startX + bitIndex * gapX,
        y: startY + queryLevel(bitIndex) * gapY,
      };

      edges.push({
        from: parent,
        to: bitIndex,
      });
    }

    return {
      positions,
      edges,
    };
  }

  function buildUpdateLayout(treeLength = array.length) {
    const positions: Record<number, { x: number; y: number }> = {};
    const edges: { from: number; to: number }[] = [];

    const svgWidth = treeSvgWidth;
    const normalGapX = 90;
    const minGapX = 35;
    const marginX = 40;

    const gapX = Math.max(
      minGapX,
      Math.min(normalGapX, (svgWidth - 2 * marginX) / treeLength)
    );

    const gapY = 60;
    const startX = marginX;
    const startY = 40;

    positions[0] = {
      x: startX,
      y: startY,
    };

    for (let bitIndex = 1; bitIndex <= treeLength; bitIndex++) {
      const next = updateNext(bitIndex);

      positions[bitIndex] = {
        x: startX + bitIndex * gapX,
        y: startY + updateLevel(bitIndex, treeLength) * gapY,
      };

      if (next <= treeLength) {
        edges.push({
          from: bitIndex,
          to: next,
        });
      }
    }

    return {
      positions,
      edges,
    };
  }

  function showCoverage(bitIndex: number) {
    setActiveBitIndex(bitIndex);
    setActiveCoverLeft(coverLeft(bitIndex));
    setActiveCoverRight(bitIndex);
  }

  function clearCoverage() {
    setActiveBitIndex(0);
    setActiveCoverLeft(0);
    setActiveCoverRight(0);
  }

  function animateTreeTo(targetPositions: Record<number, { x: number; y: number }>) {
    const startPositions = currentPositions;
    const frames = 30;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / frames;

      const nextPositions: Record<number, { x: number; y: number }> = {};

      Object.keys(targetPositions).forEach((nodeKey) => {
        const node = Number(nodeKey);
        const start = startPositions[node] ?? targetPositions[node];
        const target = targetPositions[node];

        nextPositions[node] = {
          x: start.x + (target.x - start.x) * progress,
          y: start.y + (target.y - start.y) * progress,
        };
      });

      setCurrentPositions(nextPositions);

      if (frame >= frames) {
        clearInterval(timer);
      }
    }, 16);
  }

  return (
    <div className="app">
      <h1>Fenwick Tree Visualizer</h1>

      <div className="top-panels">
        <section className="panel">
          <h2>Setup</h2>

          <div className="control-row">
            <label>Size(1 ~ 36):</label>
            <input
              type="number"
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
            />
            <button
              onClick={() => {
                if (size < 1 || size > 36) {
                  return;
                }

                const generatedArray = generateArray(size);
                const generatedBitArray = buildFenwickArray(generatedArray);
                const nextQueryLayout = buildQueryLayout(size);

                setOperation("");
                setArray(generatedArray);
                setBitArray(generatedBitArray);
                setTrace([]);
                setHighlightTrace([]);
                setAddTrace([]);
                setSubtractTrace([]);
                setQueryResult(0);
                clearCoverage();
                setCoverageMode("");
                setTreeMode("query");
                setCurrentPositions(nextQueryLayout.positions);
              }}
            >
              Reset
            </button>
          </div>
          <div className="control-row">
            <label>Animation speed(ms): </label>
            <input
              type="number"
              value={animationSpeed}
              onChange={(event) => {
                const newSpeed = Number(event.target.value);

                if (newSpeed <= 0) {
                  return;
                }

                setAnimationSpeed(newSpeed);
              }}
            />
          </div>
        </section>

        <section className="panel">
          <h2>Update</h2>

          <div className="control-row">
            <label>Index:</label>
            <input
              type="number"
              value={targetIndex}
              onChange={(event) => setTargetIndex(Number(event.target.value))}
            />

            <label>Delta:</label>
            <input
              type="number"
              value={delta}
              onChange={(event) => setDelta(Number(event.target.value))}
            />

            <button
              onClick={() => {
                if (targetIndex < 1 || targetIndex > array.length) {
                  return;
                }

                setTreeMode("update");
                animateTreeTo(updateLayout.positions);
                setCoverageMode("");

                const newArray = [...array];
                const newTrace: number[] = [];

                for (let i = targetIndex; i <= array.length; i += lowbit(i)) {
                  newTrace.push(i);
                }

                setTrace(newTrace);
                setHighlightTrace([]);

                newTrace.forEach((bitIndex, step) => {
                  setTimeout(() => {
                    showCoverage(bitIndex);

                    setHighlightTrace((previousHighlightTrace) => [
                      ...previousHighlightTrace,
                      bitIndex,
                    ]);

                    setBitArray((previousBitArray) => {
                      const nextBitArray = [...previousBitArray];
                      nextBitArray[bitIndex - 1] += delta;
                      return nextBitArray;
                    });
                  }, step * animationSpeed);
                });

                setTimeout(() => {
                  setHighlightTrace([]);
                  clearCoverage();
                }, (newTrace.length + 1) * animationSpeed);

                newArray[targetIndex - 1] += delta;

                setOperation("Update");
                setArray(newArray);
                setAddTrace([]);
                setSubtractTrace([]);
                setQueryResult(0);
              }}
            >
              Update target cell
            </button>
          </div>
        </section>
      </div>

      <h2>Original array</h2>
      <div className="array-row">
        {array.map((value, index) => (
          <div className="cell" key={index}>
            <div className="cell-index">i = {index + 1}</div>
            <div className="cell-value">{value}</div>
          </div>
        ))}
      </div>

      <h2>BIT array</h2>
      <div className="array-row">
        {bitArray.map((value, index) => {
          const bitIndex = index + 1;
          const isAdd = addTrace.includes(bitIndex);
          const isSubtract = subtractTrace.includes(bitIndex);
          const isOverlap = isAdd && isSubtract;
          return (
            <div
              className={
                isOverlap
                  ? "cell highlight-overlap"
                  : isAdd
                  ? "cell highlight-add"
                  : isSubtract
                  ? "cell highlight-subtract"
                  : operation === "Update" || operation === "Query"
                  ? highlightTrace.includes(bitIndex)
                    ? "cell highlighted"
                    : "cell"
                  : "cell"
              }
              key={index}
            >
              <div className="cell-index">i = {bitIndex}</div>
              <div className="cell-value">{value}</div>
            </div>
          );
        })}
      </div>

      <section className="panel">
        <h2>{treeMode === "query" ? "Query Tree" : "Update Tree"}</h2>
        <svg className="tree-svg" width={treeSvgWidth} height={treeHeight}>
          {activeLayout.edges.map((edge) => {
            const from = currentPositions[edge.from];
            const to = currentPositions[edge.to];

            if (!from || !to) {
              return null;
            }

            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="black"
              />
            );
          })}

          {Object.entries(currentPositions).map(([node, pos]) => {
            const nodeNumber = Number(node);
            const isHighlighted = highlightTrace.includes(nodeNumber);
            const isAdd = addTrace.includes(nodeNumber);
            const isSubtract = subtractTrace.includes(nodeNumber);
            const isOverlap = isAdd && isSubtract;
            const textNumber = Number(node);

            return (
              <g key={node}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="22"
                  className={
                    isOverlap
                      ? "tree-node-overlap"
                      : isAdd
                      ? "tree-node-add"
                      : isSubtract
                      ? "tree-node-subtract"
                      : isHighlighted
                      ? "tree-node-highlighted"
                      : "tree-node-normal"
                  }
                />
                <text
                  x={pos.x}
                  y={pos.y - 6}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="tree-node-index"
                >
                  {node}
                </text>
                {textNumber !== 0 && (
                  <text
                    x={pos.x}
                    y={pos.y + 9}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="tree-node-value"
                  >
                    {bitArray[textNumber - 1]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </section>

      <section className="panel coverage-panel">
        <h2>Coverage</h2>

        <p className="coverage-text">
          Current: bit[{activeBitIndex}] = {activeBitIndex === 0 ? "-" : bitArray[activeBitIndex - 1]} covers [{activeCoverLeft}, {activeCoverRight}]
        </p>

        <div className="coverage-row">
          {array.map((_, arrayIndex) => {
            const position = arrayIndex + 1;
            const isActive =
              position >= activeCoverLeft && position <= activeCoverRight;
            const className = isActive
              ? coverageMode === "subtract"
                ? "coverage-cell covered-subtract"
                : "coverage-cell covered-add"
              : "coverage-cell";

            return <div className={className} key={arrayIndex}></div>;
          })}
        </div>
      </section>

      <section className="panel">
        <h2>Query</h2>

        <div className="control-row">
          <label>Query Index:</label>
          <input
            type="number"
            value={queryIndex}
            onChange={(event) => setQueryIndex(Number(event.target.value))}
          />

          <button
            onClick={() => {
              if (queryIndex < 1 || queryIndex > array.length) {
                return;
              }

              setTreeMode("query");
              animateTreeTo(queryLayout.positions);
              setCoverageMode("");

              const newTrace: number[] = [];
              let sum = 0;

              for (let i = queryIndex; i > 0; i -= lowbit(i)) {
                newTrace.push(i);
                sum += bitArray[i - 1];
              }

              setOperation("Query");
              setQueryResult(sum);
              setTrace(newTrace);
              setHighlightTrace([]);
              setAddTrace([]);
              setSubtractTrace([]);
              clearCoverage();

              newTrace.forEach((bitIndex, step) => {
                setTimeout(() => {
                  showCoverage(bitIndex);

                  setHighlightTrace((previousHighlightTrace) => [
                    ...previousHighlightTrace,
                    bitIndex,
                  ]);
                }, step * animationSpeed);
              });
              setTimeout(() => {
                setHighlightTrace([]);
                clearCoverage();
              }, (newTrace.length + 1) * animationSpeed);
            }}
          >
            Query prefix sum
          </button>
        </div>

        <div className="control-row">
          <label>Left:</label>
          <input
            type="number"
            value={leftIndex}
            onChange={(event) => setLeftIndex(Number(event.target.value))}
          />

          <label>Right:</label>
          <input
            type="number"
            value={rightIndex}
            onChange={(event) => setRightIndex(Number(event.target.value))}
          />

          <button
            onClick={() => {
              if (
                leftIndex < 1 ||
                rightIndex < 1 ||
                leftIndex > rightIndex ||
                rightIndex > array.length
              ) {
                return;
              }

              setTreeMode("query");
              animateTreeTo(queryLayout.positions);

              const rightTrace: number[] = [];
              const leftTrace: number[] = [];

              let rightSum = 0;
              for (let i = rightIndex; i > 0; i -= lowbit(i)) {
                rightSum += bitArray[i - 1];
                rightTrace.push(i);
              }

              let leftSum = 0;
              for (let i = leftIndex - 1; i > 0; i -= lowbit(i)) {
                leftSum += bitArray[i - 1];
                leftTrace.push(i);
              }

              setOperation("Range Query");
              setQueryResult(rightSum - leftSum);
              setTrace([...rightTrace, ...leftTrace]);
              setHighlightTrace([]);
              setAddTrace([]);
              setSubtractTrace([]);
              clearCoverage();

              rightTrace.forEach((bitIndex, step) => {
                setTimeout(() => {
                  setCoverageMode("add");
                  showCoverage(bitIndex);

                  setAddTrace((previousAddTrace) => [
                    ...previousAddTrace,
                    bitIndex,
                  ]);
                }, step * animationSpeed);
              });

              leftTrace.forEach((bitIndex, step) => {
                setTimeout(() => {
                  setCoverageMode("subtract");
                  showCoverage(bitIndex);

                  setSubtractTrace((previousSubtractTrace) => [
                    ...previousSubtractTrace,
                    bitIndex,
                  ]);
                }, (rightTrace.length + step) * animationSpeed);
              });

              setTimeout(() => {
                setAddTrace([]);
                setSubtractTrace([]);
                setCoverageMode("");
                clearCoverage();
              }, (rightTrace.length + leftTrace.length + 1) * animationSpeed);
            }}
          >
            Range query
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>{operation || "Operation"} Trace</h2>
        <p>{trace.join(" → ")}</p>
        {(operation === "Query" || operation === "Range Query") && (
          <p>Result: {queryResult}</p>
        )}

        <div className="legend">
          <div className="legend-row">
            <span>
              <span className="legend-add">Blue</span>: prefixSum(right)
            </span>

            <span>
              <span className="legend-subtract">Orange</span>: prefixSum(left - 1)
            </span>

            <span>
              <span className="legend-overlap">Overlap</span>: added and subtracted
            </span>

            <span>
              <span className="legend-current">Yellow</span>: current step
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
