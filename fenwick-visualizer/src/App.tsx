import "./App.css";
import { useState } from "react";

function App() {
  const initialArray = generateFibonacciArray(8);
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

  function generateFibonacciArray(size: number) {
    const result: number[] = [];

    for (let i = 0; i < size; i++) {
      if (i === 0 || i === 1) {
        result.push(1);
      } else {
        result.push(result[i - 1] + result[i - 2]);
      }
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

                const generatedArray = generateFibonacciArray(size);
                const generatedBitArray = buildFenwickArray(generatedArray);

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

                if(newSpeed <= 0){
                  return;
                }

                setAnimationSpeed(Number(event.target.value));
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

                newArray[targetIndex - 1] = newArray[targetIndex - 1] + delta;

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
