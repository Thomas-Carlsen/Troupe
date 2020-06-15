class RtClosure {
  env;
  fun;
  namespace;
  stringRep;
  
  constructor(env, p, fun) {
    console.log("New Closure");
    this.env = env;
    this.fun = fun;
    this.namespace = p // pointer. So we can fields of this object i.e. namespace
    this.stringRep = (omitLevels = false) => {
      return "fn => .."
    }
  }
}

export {RtClosure};