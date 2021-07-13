export function getTomorrow() {
  let today = new Date();
  let oneDay = 24 * 60 * 60 * 1000;
  return new Date(today.getTime() + oneDay);
}

export function getThisWeekend() {
  let today = new Date();
  let oneDay = 24 * 60 * 60 * 1000;
  while (today.getDay() !== 6 && today.getDay() !== 0) {
    let nextDay = today.getTime() + oneDay;
    today = new Date(nextDay);
  }
  return today;
}

export function getNextWeekend() {
  let today = new Date();
  let oneDay = 24 * 60 * 60 * 1000;
  today = new Date(today.getTime() + oneDay * 7);
  while (today.getDay() !== 6 && today.getDay() !== 0) {
    let nextDay = today.getTime() + oneDay;
    today = new Date(nextDay);
  }
  return today;
}
