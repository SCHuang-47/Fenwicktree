import { FenwickTree } from "./fenwick_tree";
// test part
const bit = new FenwickTree(16);
bit.add(3, 5);
bit.add(5, 2);
bit.add(6, 4);
console.log(bit);
console.log(bit);
console.log(bit.prefixSum(3));
console.log(bit.prefixSum(4));
console.log(bit.prefixSum(5));
console.log(bit.prefixSum(6));
console.log(bit.prefixSum(8));
console.log(bit.rangeSum(3, 6));
console.log(bit.rangeSum(4, 5));
console.log(bit.rangeSum(1, 8));
console.log(bit.getTreeArray());
console.log(bit.getArray());
//console.log(bit.getUpdatePath(3)); // [3, 4, 8]
//console.log(bit.getUpdatePath(5)); // [5, 6, 8]
//console.log(bit.getUpdatePath(6)); // [6, 8]
//console.log(bit.getQueryPath(6));
console.log(bit.getQueryPath(15));
//console.log(bit.getQueryPath(0));
//console.log(bit.getCoverRange(6));
//console.log(bit.getCoverRange(8));
//console.log(bit.getCoverRange(3));
console.log(bit.getTreeInfo());
// test: out of range bit.add(0, 5);