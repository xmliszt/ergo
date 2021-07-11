export function getNextWeekend() {
  let today = new Date();
  let oneDay = 24 * 60 * 60 * 1000;
  while (today.getDay() !== 6 && today.getDay() !== 0) {
    let nextDay = today.getTime() + oneDay;
    today = new Date(nextDay);
  }
  return today;
}
