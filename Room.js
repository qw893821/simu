class Room {
    /*k is the thermal conductivity value
     *layer is the one determined the layer place
     *thickness determined the thickness of material
    */
    constructor(layer = 1, thickness = 10, k = 401) {
        this.layer = layer;
        this.thickness = thickness;
        this.area = 100;
        this.tempSide1;
        this.tempSide2;
        this.k = k;
    }
    //this function ccalculate the heat transform value from one side to another.
    innerTransfer() {
        let Q;
        Q = this.k * Math.abs(this.tempSide1 - this.tempSide2) / this.thickness;
        return Q;
    }
    /*this function could change multi value by set.
     *tested in early version
     “Multiple Parameters for Object.defineProperty Setter Function?” Javascript - Multiple Parameters for Object.defineProperty Setter Function? - Stack Overflow, stackoverflow.com/questions/18727205/multiple-parameters-for-object-defineproperty-setter-function. 
    */
    set changeMat(param) {
        this.thickness = param.thickness;
        this.k = param.k;
    }
}
