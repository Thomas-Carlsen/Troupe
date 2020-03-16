function Top (rt) {
    this.uuid = rt.rt_uuid
    this.libSet = new Set ()
    this.libs = []
    this.addLib = function (lib, decl) { if (!this.libSet.has (lib +'.'+decl)) { this.libSet.add (lib +'.'+decl); this.libs.push ({lib:lib, decl:decl})} }
    this.loadlibs = function (cb) { rt.linkLibs (this.libs, this, cb) }
    this.serializedatoms = "AQAAAAAAAAAA"
    this.main = function ($env, $$authorityarg) {
      // mkValPos make a LVal with val=42 and posInfo=':1:1'
      // Such put types on gensyms
      const gensym1 = rt.mkValPos(42,':1:1');;
      // This is the halt function within the Scheduler
      rt.ret(gensym1);
    }
    this.main.deps = [];
    this.main.serialized = "AAAAAAAAAAAEbWFpbgAAAAAAAAAOJCRhdXRob3JpdHlhcmcAAAAAAAAAAQAAAAAAAAAAB2dlbnN5bTEFAAAAAAAqAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQEAAAAAAAAAAAdnZW5zeW0x";
  }
  module.exports = Top 