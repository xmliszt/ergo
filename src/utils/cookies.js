export function setCookie(name, value, expireInSeconds) {
  let date = new Date();
  date.setTime(date.getTime() + expireInSeconds * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie =
    name + "=" + value + "; " + expires + "; path=/; SameSite=Strict; Secure";
}

export function deleteCookie(name) {
  document.cookie =
    name +
    "=" +
    "; " +
    "Thu, 01 Jan 1970 00:00:00 UTC" +
    "; path=/; SameSite=Strict; Secure";
}

export function getCookie(name) {
  name += "=";
  const decded = decodeURIComponent(document.cookie);
  const arr = decded.split("; ");
  let res;
  arr.forEach((val) => {
    if (val.indexOf(name) === 0) res = val.substring(name.length);
  });
  return res;
}
