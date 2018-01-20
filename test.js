function debrujin(s, n) {
    let b = s.length,
        r = s[0].repeat(n),
        i = 0;
    while (r.length<b**n+n-1) {
      if (r.match(r.slice(1 - n) + s[i])) {
        if (++i >= base) {
          i = s.indexOf(r.slice(-1)) + 1;
          r = r.slice(0, -1);
        }
      } else {
        r += s[i];
        i = 0;
      }
    }
    return r;
  }
function debrujin(s, n) {
    let b = s.length,
        r = new Array(n).fill(s[0]),
        i = 0;
    while (r.length<b**n+n-1)
        if ((r+"").match(r.slice(1 - n) + s[i])) {
            ++i<b||i=s.indexOf(r.splice(-1,1)[0])+1;
        } else {
            r.push(s[i]);
            i = 0;
        }
    return r;
}