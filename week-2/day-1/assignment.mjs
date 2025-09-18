const students = [
  { name: 'Aisha', score: 88 },
  { name: 'Bilal', score: 95 },
  { name: 'Menahil', score: 95 },
  { name: 'Danyal', score: 72 },
  { name: 'Esha', score: null },
  { name: 'Farah' },
  { name: 'Ayan', score: 88 }
];

// 1. Sort students by score (descending)
const leaderboard = [...students].sort((a, b) => b.score - a.score);

// 2. Calculate class average
const total = students.reduce((acc, s) => acc + s.score, 0);
const average = total / students.length;

// 3. Display results
console.log("=== Leaderboard ===");
console.table(leaderboard);
console.log("Class average:", average.toFixed(2));