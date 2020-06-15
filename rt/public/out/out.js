function Top (rt) {
  this.libSet = new Set ()
  this.libs = []
  this.addLib = function (lib, decl) { if (!this.libSet.has (lib +'.'+decl)) { this.libSet.add (lib +'.'+decl); this.libs.push ({lib:lib, decl:decl})} }
  this.loadlibs = function (cb) { rt.linkLibs (this.libs, this, cb) }
  this.serializedatoms = "AQAAAAAAAAAA"
  this.main = function ($env,$$authorityarg) {
    const gensym2 = rt.mkCopy(rt.localStorage);
    const gensym3 = rt.__unit;
    rt.push ((gensym1) =>
             {rt.ret (gensym1);});
    rt.tailcall (gensym2,gensym3);
  }
  this.main.deps = [];
  this.main.libdeps = [];
  this.main.serialized = "AAAAAAAAAAAEbWFpbgAAAAAAAAAOJCRhdXRob3JpdHlhcmcAAAAAAAAAAgAAAAAAAAAAB2dlbnN5bTIGAAAAAAAAAAxsb2NhbFN0b3JhZ2UAAAAAAAAAAAdnZW5zeW0zBQMGAAAAAAAAAAdnZW5zeW0xAAAAAAAAAAAAAAAAAAAAAAAHZ2Vuc3ltMgAAAAAAAAAAB2dlbnN5bTMAAAAAAAAAAAEAAAAAAAAAAAdnZW5zeW0x";
}
module.exports = Top 