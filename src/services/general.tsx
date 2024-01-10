export function log(display: boolean, ...messages: any[]) {
  // console.log(JSON.stringify(msg));
  if (display) {
    let full_message = "";
    messages.forEach((msg) => {
      if (typeof msg === "object") {
        full_message = full_message.concat("\n", JSON.stringify(msg), " \n");
      } else {
        full_message = full_message.concat(msg.toString(), " ");
      }
      alert(full_message);
      console.log(full_message);
    });
  } else {
    console.log(...messages);
  }
}

export function convertSecToString(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  let m = minutes.toString();
  let s = sec.toString();
  return joinTimePartitions(undefined, m, s);
}
export function joinTimePartitions(
  h: string | undefined,
  m: string,
  s: string | undefined
): string {
  const prefix = (i: string) => {
    i = i.length > 1 ? i : "0" + i;
    return i;
  };
  const join = (...l: string[]) => {
    return l.join(":");
  };
  if (h && parseInt(h) && s && parseInt(s)) {
    m = prefix(m);
    s = prefix(s);
    return join(h, m, s);
  } else if (h && parseInt(h)) {
    m = prefix(m);
    return join(h, m);
  } else if (s && parseInt(s)) {
    s = prefix(s);
    return join(m, s);
  }
  return "None";
}
export async function get(url: URL, preErrorMsg: string) {
  let result;
  try {
    const response = await fetch(url);
    if ([400, 401, 402, 403, 404, 409, 410].includes(response.status)) {
      console.log("bad request", response);
      throw Error("bad request ");
    }
    result = await response.json();
  } catch (error) {
    console.error(preErrorMsg, error, ` at: ${url.href}`);
    alert(preErrorMsg + "\n" + error + ` at: ${url.href}`);
    return undefined;
  }
  return result;
}
export function spaceOut(s: string) {
  return " " + s + " ";
}
export function formatDate(date: Date | undefined, hour12: boolean) {
  if (!date) return "";
  var strTime = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: hour12,
  });
  return strTime;
}
