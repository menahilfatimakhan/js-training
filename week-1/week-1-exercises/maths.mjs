import { myReduce } from './reduce.mjs';
import { myMap } from './map.mjs';
import { myFilter } from './filter.mjs';

// Sum using myReduce
export function sum(arr) {
  return myReduce(arr, (a, b) => a + b, 0);
}

// Average = sum / length
export function avg(arr) {
  return sum(arr) / arr.length;
}

// Median calculation
export function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    return sorted[mid];
  }
}

// Squares using myMap
export function squares(arr) {
  return myMap(arr, x => x * x);
}

// Evens using myFilter
export function evens(arr) {
  return myFilter(arr, x => x % 2 === 0);
}
