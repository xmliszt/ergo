export function getRewardMarks() {
  var marks = Object();
  for (var i = 1; i <= 10; i++) {
    marks[i] = `${i}`;
  }
  return marks;
}
