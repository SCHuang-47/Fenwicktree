import "./App.css";
import { useState } from "react";

function App() {
  const [size, setSize] = useState(8);
  const [array, setArray] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [bitArray, setBitArray] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
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

  function lowbit(x: number) {
    return x & -x;
  }

  function coverLeft(index: number) {
    return index - lowbit(index) + 1;
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

  function animateTrace(trace: number[]) {
    trace.forEach((bitIndex, step) => {
      setTimeout(() => {
        showCoverage(bitIndex);
      }, step * animationSpeed);
    });

    setTimeout(() => {
      setActiveBitIndex(0);
      setActiveCoverLeft(0);
      setActiveCoverRight(0);
    }, trace.length * animationSpeed);
  }

  return (
    <div className="app">
      <h1>Fenwick Tree Visualizer</h1>

      <div className="top-panels">
        <section className="panel">
          <h2>Setup</h2>

          <div className="control-row">
            <label>Size(1 ~ 20):</label>
            <input
              type="number"
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
            />
            <button
              onClick={() => {
                if (size < 1 || size > 20) {
                  return;
                }

                const generatedArray = Array.from({ length: size }, () => 0);
                const generatedBitArray = Array.from({ length: size }, () => 0);

                setOperation("");
                setArray(generatedArray);
                setBitArray(generatedBitArray);
                setTrace([]);
                setHighlightTrace([]);
                setAddTrace([]);
                setSubtractTrace([]);
                setQueryResult(0);
                clearCoverage();
              }}
            >
              Generate array
            </button>
          </div>
          <div className="control-row">
            <label>Animation speed(ms): </label>
            <input
              type="number"
              value={animationSpeed}
              onChange={(event) => setAnimationSpeed(Number(event.target.value))}
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

                const newArray = [...array];
                const newBitArray = [...bitArray];
                const newTrace: number[] = [];

                newArray[targetIndex - 1] = newArray[targetIndex - 1] + delta;

                for (let i = targetIndex; i <= array.length; i += lowbit(i)) {
                  newBitArray[i - 1] = newBitArray[i - 1] + delta;
                  newTrace.push(i);
                }

                setOperation("Update");
                setArray(newArray);
                setBitArray(newBitArray);
                setTrace(newTrace);
                setAddTrace([]);
                setSubtractTrace([]);
                setQueryResult(0);
                clearCoverage();

                animateTrace(newTrace);
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
                  : operation === "Query" || operation === "Update"
                  ? bitIndex === activeBitIndex
                    ? "cell highlighted"
                    : "cell"
                  : highlightTrace.includes(bitIndex)
                  ? "cell highlighted"
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

              const newTrace: number[] = [];
              let sum = 0;

              for (let i = queryIndex; i > 0; i -= lowbit(i)) {
                newTrace.push(i);
                sum += bitArray[i - 1];
              }

              setOperation("Query");
              setQueryResult(sum);
              setTrace(newTrace);
              setHighlightTrace(newTrace);
              setAddTrace([]);
              setSubtractTrace([]);

              animateTrace(newTrace);
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
              setAddTrace(rightTrace);
              setSubtractTrace(leftTrace);
              clearCoverage();
              setCoverageMode("add");
              animateTrace(rightTrace);
              setTimeout(() => {
                setCoverageMode("subtract");
                animateTrace(leftTrace);
              }, rightTrace.length * animationSpeed);

              setTimeout(() => {
                setAddTrace([]);
                setSubtractTrace([]);
                setCoverageMode("");
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
        <p>Result: {queryResult}</p>

        <div className="legend">
          <div className="legend-row">
            <span>
              <span className="legend-add">Blue</span>: prefixSum(right)
            </span>

            <span>
              <span className="legend-subtract">Orange</span>: prefixSum(left - 1)
            </span>
            
            <span>
              <span className="legend-overlap">Gray</span>: overlap / canceled
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
