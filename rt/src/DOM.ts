import { LVal } from "./Lval";

export class DOM {
    parent: LVal; // should maybe be lval of DOM
    chrildren; //list of DOMs
    innerHTML: string;
    outerHTML: string;
    addEventListener; // take string, a callback (event handler) and optionaly a useCapture bool. Default is false ie. The event handler is executed in the bubbling phase
    // The type of the event object depends on the specified event. For example, 
    // the "click" event belongs to the MouseEvent object.
    // - where do we get this information from
    // - what is an event object? - so the type of mouseevent object depends on the event "click "

    
    constructor(elem, parent) {
        // if parent is null then elem is the html object
        if (parent != null) 
            this.parent = parent;

        this.addEventListener = (event: string, handler, capture?: boolean) => {
            
        }
    }
}