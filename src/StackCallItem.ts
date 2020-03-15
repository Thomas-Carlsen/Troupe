import { StackItem } from "./StackItem";
import { Level } from "./Level";


export class StackCallItem extends StackItem {
    pc: Level;
    f: any;
    constructor (pc: Level, f: (a:any) => any) {
        super();
        this.pc = pc;        
        this.f = f;
    }
}
