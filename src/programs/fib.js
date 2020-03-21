function Top (rt) {
  this.uuid = rt.rt_uuid
  this.libSet = new Set ()
  this.libs = []
  this.addLib = function (lib, decl) { if (!this.libSet.has (lib +'.'+decl)) { this.libSet.add (lib +'.'+decl); this.libs.push ({lib:lib, decl:decl})} }
  this.loadlibs = function (cb) { rt.linkLibs (this.libs, this, cb) }
  this.serializedatoms = "AQAAAAAAAAAA"
  this.fib2 = function ($env,fib_arg13) {
    const gensym12 = rt.mkValPos (2,':2:14');;
    const gensym11 = rt.gt (fib_arg13,gensym12);;
    rt.branch (gensym11);
    if (rt.getVal(gensym11)) {
      const gensym9 = rt.mkValPos (1,':3:21');;
      const gensym8 = rt.minus (fib_arg13,gensym9);;
      rt.push ((gensym4) =>
               {const gensym7 = rt.mkValPos (2,':3:35');;
                const gensym6 = rt.minus (fib_arg13,gensym7);;
                rt.push ((gensym5) =>
                         {const gensym3 = rt.plus (gensym4,gensym5);;
                          rt.ret (gensym3);});
                rt.tailcall ($env.fib2,gensym6);});
      rt.tailcall ($env.fib2,gensym8);
    } else {
      const gensym10 = rt.mkValPos (1,':4:12');;
      rt.ret (gensym10);
    }
  }
  this.fib2.deps = [];
  this.fib2.serialized = "AAAAAAAAAAAEZmliMgAAAAAAAAAJZmliX2FyZzEzAAAAAAAAAAIAAAAAAAAAAAhnZW5zeW0xMgUAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAOAAAAAAAAAAAIZ2Vuc3ltMTEACgAAAAAAAAAACWZpYl9hcmcxMwAAAAAAAAAACGdlbnN5bTEyAgAAAAAAAAAACGdlbnN5bTExAAAAAAAAAAIAAAAAAAAAAAdnZW5zeW05BQAAAAAAAQAAAAAAAAAAAAAAAAAAAAADAAAAAAAAABUAAAAAAAAAAAdnZW5zeW04AAEAAAAAAAAAAAlmaWJfYXJnMTMAAAAAAAAAAAdnZW5zeW05BgAAAAAAAAAHZ2Vuc3ltNAAAAAAAAAAAAAEAAAAAAAAABGZpYjIAAAAAAAAAAAdnZW5zeW04AAAAAAAAAAIAAAAAAAAAAAdnZW5zeW03BQAAAAAAAgAAAAAAAAAAAAAAAAAAAAADAAAAAAAAACMAAAAAAAAAAAdnZW5zeW02AAEAAAAAAAAAAAlmaWJfYXJnMTMAAAAAAAAAAAdnZW5zeW03BgAAAAAAAAAHZ2Vuc3ltNQAAAAAAAAAAAAEAAAAAAAAABGZpYjIAAAAAAAAAAAdnZW5zeW02AAAAAAAAAAEAAAAAAAAAAAdnZW5zeW0zAAAAAAAAAAAAAAdnZW5zeW00AAAAAAAAAAAHZ2Vuc3ltNQEAAAAAAAAAAAdnZW5zeW0zAAAAAAAAAAEAAAAAAAAAAAhnZW5zeW0xMAUAAAAAAAEAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAMAQAAAAAAAAAACGdlbnN5bTEw";
  this.main = function ($env,$$authorityarg) {
    const $$$env0 = new rt.Env();
    const fib2 = rt.mkVal(new rt.Closure($$$env0, this, this.fib2))
    $$$env0.fib2 = fib2;
    $$$env0.fib2.selfpointer = true;
    const gensym23 = rt.mkValPos (10,':5:8');;
    rt.push ((gensym22) =>
             {rt.ret (gensym22);});
    rt.tailcall (fib2,gensym23);
  }
  this.main.deps = ['fib2'];
  this.main.serialized = "AAAAAAAAAAAEbWFpbgAAAAAAAAAOJCRhdXRob3JpdHlhcmcAAAAAAAAAAgEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAARmaWIyAAAAAAAAAARmaWIyAAAAAAAAAAAIZ2Vuc3ltMjMFAAAAAAAKAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAACAYAAAAAAAAACGdlbnN5bTIyAAAAAAAAAAAAAAAAAAAAAAAEZmliMgAAAAAAAAAACGdlbnN5bTIzAAAAAAAAAAABAAAAAAAAAAAIZ2Vuc3ltMjI=";
}
module.exports = Top 