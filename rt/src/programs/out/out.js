function Top (rt) {
  this.libSet = new Set ()
  this.libs = []
  this.addLib = function (lib, decl) { if (!this.libSet.has (lib +'.'+decl)) { this.libSet.add (lib +'.'+decl); this.libs.push ({lib:lib, decl:decl})} }
  this.loadlibs = function (cb) { rt.linkLibs (this.libs, this, cb) }
  this.serializedatoms = "AQAAAAAAAAAA"
  this.main = function ($env,$$authorityarg) {
    const gensym11 = rt.mkValPos ("1",'');;
    const gensym12 = rt.mkLabel("sec");
    const gensym10 = rt.raisedTo (gensym11,gensym12);;
    rt.push (($decltemp$4) =>
             {rt.push (($decltemp$6) =>
                       {const gensym3 = rt.mkValPos ("0",'');;
                        const gensym4 = rt.mkLabel("pub");
                        const gensym2 = rt.raisedTo (gensym3,gensym4);;
                        const gensym1 = rt.eq ($decltemp$6,gensym2);;
                        rt.ret (gensym1);});
              const gensym5 = rt.mkCopy(rt.localStorageRead);
              const gensym6 = rt.mkValPos ("secVar",'');;
              rt.tailcall (gensym5,gensym6);});
    const gensym7 = rt.mkCopy(rt.localStorageWrite);
    const gensym8 = rt.mkValPos ("secVar",'');;
    const gensym9 = rt.mkVal(rt.mkTuple([gensym8, gensym10]));
    rt.tailcall (gensym7,gensym9);
  }
  this.main.deps = [];
  this.main.libdeps = [];
  this.main.serialized = "AAAAAAAAAAAEbWFpbgAAAAAAAAAOJCRhdXRob3JpdHlhcmcAAAAAAAAAAwAAAAAAAAAACGdlbnN5bTExBQEAAAAAAAAAATEAAAAAAAAAAAhnZW5zeW0xMgUCAAAAAAAAAANzZWMAAAAAAAAAAAhnZW5zeW0xMAAOAAAAAAAAAAAIZ2Vuc3ltMTEAAAAAAAAAAAhnZW5zeW0xMgYAAAAAAAAACyRkZWNsdGVtcCQ0AAAAAAAAAAMAAAAAAAAAAAdnZW5zeW03BgAAAAAAAAARbG9jYWxTdG9yYWdlV3JpdGUAAAAAAAAAAAdnZW5zeW04BQEAAAAAAAAABnNlY1ZhcgAAAAAAAAAAB2dlbnN5bTkCAAAAAAAAAAIAAAAAAAAAAAdnZW5zeW04AAAAAAAAAAAIZ2Vuc3ltMTAAAAAAAAAAAAAHZ2Vuc3ltNwAAAAAAAAAAB2dlbnN5bTkAAAAAAAAAAAYAAAAAAAAACyRkZWNsdGVtcCQ2AAAAAAAAAAIAAAAAAAAAAAdnZW5zeW01BgAAAAAAAAAQbG9jYWxTdG9yYWdlUmVhZAAAAAAAAAAAB2dlbnN5bTYFAQAAAAAAAAAGc2VjVmFyAAAAAAAAAAAAB2dlbnN5bTUAAAAAAAAAAAdnZW5zeW02AAAAAAAAAAQAAAAAAAAAAAdnZW5zeW0zBQEAAAAAAAAAATAAAAAAAAAAAAdnZW5zeW00BQIAAAAAAAAAA3B1YgAAAAAAAAAAB2dlbnN5bTIADgAAAAAAAAAAB2dlbnN5bTMAAAAAAAAAAAdnZW5zeW00AAAAAAAAAAAHZ2Vuc3ltMQAFAAAAAAAAAAALJGRlY2x0ZW1wJDYAAAAAAAAAAAdnZW5zeW0yAQAAAAAAAAAAB2dlbnN5bTE=";
}
module.exports = Top 