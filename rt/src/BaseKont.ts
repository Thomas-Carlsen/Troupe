export class BaseKont {
    env;
    fun;
    constructor(f) {
      this.env = { ret : null }
      this.fun = f;
    }
  }

