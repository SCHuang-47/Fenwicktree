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

  function lowbit(x: number) {
    return x & -x;
  }

  return (
    <div className="app">
      <h1>Fenwick Tree Visualizer</h1>

      <section className="panel">
        <h2>Setup</h2>

        <label>Size(1 ~ 20): </label>
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
          }}
        >
          Generate array
        </button>
      </section>

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
        {bitArray.map((value, index) => (
          <div
            className={
              addTrace.includes(index + 1)
                ? "cell highlight-add"
                : subtractTrace.includes(index + 1)
                ? "cell highlight-subtract"
                : highlightTrace.includes(index + 1)
                ? "cell highlighted"
                : "cell"
            }
            key={index}
          >
            <div className="cell-index">i = {index + 1}</div>
            <div className="cell-value">{value}</div>
          </div>
        ))}
      </div>

      <section className="panel">
        <h2>Update</h2>

        <div>
          <label>Index: </label>
          <input
            type="number"
            value={targetIndex}
            onChange={(event) => setTargetIndex(Number(event.target.value))}
          />
        </div>

        <div>
          <label>Delta: </label>
          <input
            type="number"
            value={delta}
            onChange={(event) => setDelta(Number(event.target.value))}
          />
        </div>

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
            setHighlightTrace(newTrace);
            setAddTrace([]);
            setSubtractTrace([]);
            setQueryResult(0);

            setTimeout(() => {
              setHighlightTrace([]);
            }, 1000);
          }}
        >
          Update target cell
        </button>
      </section>

      <section className="panel">
        <h2>Query</h2>

        <div>
          <label>Query Index: </label>
          <input
            type="number"
            value={queryIndex}
            onChange={(event) => setQueryIndex(Number(event.target.value))}
          />
        </div>

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

            setTimeout(() => {
              setHighlightTrace([]);
            }, 1000);
          }}
        >
          Query prefix sum
        </button>

        <div>
          <label>Left: </label>
          <input
            type="number"
            value={leftIndex}
            onChange={(event) => setLeftIndex(Number(event.target.value))}
          />
          <label>Right: </label>
          <input
            type="number"
            value={rightIndex}
            onChange={(event) => setRightIndex(Number(event.target.value))}
          />
        </div>

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

            setTimeout(() => {
              setAddTrace([]);
              setSubtractTrace([]);
            }, 1000);
          }}
        >
          Range query
        </button>
      </section>

      <section className="panel">
        <h2>{operation} Trace</h2>
        <p>{trace.join(" → ")}</p>
        <p>Result: {queryResult}</p>
      </section>
    </div>
  );
}

export default App;
