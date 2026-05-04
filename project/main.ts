import { FenwickTree } from "./fenwick_tree";
// test part
const bit = new FenwickTree(16);
function assertEqual(actual: number, expected: number, message: string): void {
  if (actual !== expected) {
    throw new Error(
      `${message}\nExpected: ${expected}\nActual: ${actual}`
    );
  }
  console.log(`PASS: ${message}`);
}

function assertArrayEqual(actual: number[], expected: number[], message: string): void {
  if (actual.length !== expected.length) {
    throw new Error(
      `${message}\nLength mismatch\nExpected: [${expected}]\nActual: [${actual}]`
    );
  }

  for (let i = 0; i < actual.length; i++) {
    if (actual[i] !== expected[i]) {
      throw new Error(
        `${message}\nMismatch at index ${i}\nExpected: [${expected}]\nActual: [${actual}]`
      );
    }
  }

  console.log(`PASS: ${message}`);
}

function assertThrows(fn: () => void, message: string): void {
  try {
    fn();
  } catch {
    console.log(`PASS: ${message}`);
    return;
  }

  throw new Error(`${message}\nExpected error, but no error was thrown`);
}

function testBuildAndQueries(): void {
  console.log("\n=== testBuildAndQueries ===");

  const bit = new FenwickTree(8);
  bit.build([0, 0, 5, 0, 2, 4, 0, 0]);

  assertArrayEqual(
    bit.getArray(),
    [0, 0, 5, 0, 2, 4, 0, 0],
    "getArray after build"
  );

  assertArrayEqual(
    bit.getTreeArray(),
    [0, 0, 0, 5, 5, 2, 6, 0, 11],
    "getTreeArray after build"
  );

  assertEqual(bit.query(0), 0, "query(0)");
  assertEqual(bit.query(3), 5, "query(3)");
  assertEqual(bit.query(4), 5, "query(4)");
  assertEqual(bit.query(5), 7, "query(5)");
  assertEqual(bit.query(6), 11, "query(6)");
  assertEqual(bit.query(8), 11, "query(8)");

  assertEqual(bit.rangeQuery(3, 6), 11, "rangeQuery(3, 6)");
  assertEqual(bit.rangeQuery(4, 5), 2, "rangeQuery(4, 5)");
  assertEqual(bit.rangeQuery(1, 8), 11, "rangeQuery(1, 8)");
}

function testPathsAndRanges(): void {
  console.log("\n=== testPathsAndRanges ===");

  const bit = new FenwickTree(8);
  bit.build([0, 0, 5, 0, 2, 4, 0, 0]);

  assertArrayEqual(bit.getUpdatePath(3), [3, 4, 8], "getUpdatePath(3)");
  assertArrayEqual(bit.getUpdatePath(5), [5, 6, 8], "getUpdatePath(5)");
  assertArrayEqual(bit.getUpdatePath(6), [6, 8], "getUpdatePath(6)");

  assertArrayEqual(bit.getQueryPath(6), [6, 4], "getQueryPath(6)");
  assertArrayEqual(bit.getQueryPath(8), [8], "getQueryPath(8)");
  assertArrayEqual(bit.getQueryPath(0), [], "getQueryPath(0)");

  assertArrayEqual(bit.getCoverRange(6), [5, 6], "getCoverRange(6)");
  assertArrayEqual(bit.getCoverRange(8), [1, 8], "getCoverRange(8)");
  assertArrayEqual(bit.getCoverRange(3), [3, 3], "getCoverRange(3)");
  assertArrayEqual(bit.getCoverRange(4), [1, 4], "getCoverRange(4)");
}

function testUpdateAndUpdateWithTrace(): void {
  console.log("\n=== testUpdateAndUpdateWithTrace ===");

  const bit = new FenwickTree(8);
  bit.build([0, 0, 5, 0, 2, 4, 0, 0]);

  const trace = bit.updateWithTrace(3, 2);

  assertEqual(trace.length, 3, "updateWithTrace(3, 2) trace length");

  assertEqual(trace[0].updatedIndex, 3, "update trace step 1 index");
  assertArrayEqual(trace[0].affectedRange, [3, 3], "update trace step 1 range");
  assertEqual(trace[0].oldValue, 5, "update trace step 1 oldValue");
  assertEqual(trace[0].newValue, 7, "update trace step 1 newValue");

  assertEqual(trace[1].updatedIndex, 4, "update trace step 2 index");
  assertArrayEqual(trace[1].affectedRange, [1, 4], "update trace step 2 range");
  assertEqual(trace[1].oldValue, 5, "update trace step 2 oldValue");
  assertEqual(trace[1].newValue, 7, "update trace step 2 newValue");

  assertEqual(trace[2].updatedIndex, 8, "update trace step 3 index");
  assertArrayEqual(trace[2].affectedRange, [1, 8], "update trace step 3 range");
  assertEqual(trace[2].oldValue, 11, "update trace step 3 oldValue");
  assertEqual(trace[2].newValue, 13, "update trace step 3 newValue");

  assertArrayEqual(
    bit.getArray(),
    [0, 0, 7, 0, 2, 4, 0, 0],
    "getArray after updateWithTrace(3, 2)"
  );

  assertArrayEqual(
    bit.getTreeArray(),
    [0, 0, 0, 7, 7, 2, 6, 0, 13],
    "getTreeArray after updateWithTrace(3, 2)"
  );

  assertEqual(bit.query(6), 13, "query(6) after update");
  assertEqual(bit.rangeQuery(3, 6), 13, "rangeQuery(3, 6) after update");
}

function testQueryTrace(): void {
  console.log("\n=== testQueryTrace ===");

  const bit = new FenwickTree(8);
  bit.build([0, 0, 5, 0, 2, 4, 0, 0]);

  const trace = bit.getQueryTrace(6);

  assertEqual(trace.length, 2, "getQueryTrace(6) length");

  assertEqual(trace[0].currentIndex, 6, "query trace step 1 index");
  assertEqual(trace[0].lowbit, 2, "query trace step 1 lowbit");
  assertArrayEqual(trace[0].range, [5, 6], "query trace step 1 range");
  assertEqual(trace[0].bitValue, 6, "query trace step 1 bitValue");
  assertEqual(trace[0].partialSum, 6, "query trace step 1 partialSum");

  assertEqual(trace[1].currentIndex, 4, "query trace step 2 index");
  assertEqual(trace[1].lowbit, 4, "query trace step 2 lowbit");
  assertArrayEqual(trace[1].range, [1, 4], "query trace step 2 range");
  assertEqual(trace[1].bitValue, 5, "query trace step 2 bitValue");
  assertEqual(trace[1].partialSum, 11, "query trace step 2 partialSum");
}

function testInvalidInputs(): void {
  console.log("\n=== testInvalidInputs ===");

  const bit = new FenwickTree(8);

  assertThrows(() => new FenwickTree(0), "constructor rejects size 0");
  assertThrows(() => new FenwickTree(-1), "constructor rejects negative size");
  assertThrows(() => bit.build([]), "build rejects empty / wrong length array");
  assertThrows(() => bit.build([1, 2, 3]), "build rejects wrong length array");

  bit.build([0, 0, 5, 0, 2, 4, 0, 0]);

  assertThrows(() => bit.update(0, 5), "update rejects index 0");
  assertThrows(() => bit.update(9, 5), "update rejects index > size");
  assertThrows(() => bit.query(-1), "query rejects negative index");
  assertThrows(() => bit.query(9), "query rejects index > size");
  assertThrows(() => bit.rangeQuery(0, 3), "rangeQuery rejects left < 1");
  assertThrows(() => bit.rangeQuery(6, 3), "rangeQuery rejects left > right");
  assertThrows(() => bit.rangeQuery(1, 9), "rangeQuery rejects right > size");
}

function runAllTests(): void {
  testBuildAndQueries();
  testPathsAndRanges();
  testUpdateAndUpdateWithTrace();
  testQueryTrace();
  testInvalidInputs();

  console.log("\nAll tests passed!");
}

runAllTests();