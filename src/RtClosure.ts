class RtClosure {
  env;
  fun;
  namespace;
  stringRep;
  constructor(e, p, f) {
    this.env = e;
    this.fun = f;
    this.namespace = p
    this.stringRep = function (omitLevels = false) {
      return "fn => .."
    }
  }
}

export {RtClosure};