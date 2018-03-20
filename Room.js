class Room{
    constructor(layer=1,thickness=10,meltPoint=1000,k=401){
        this.layer=layer;
        this.thickness=thickness;
        this.area=100;
        this.meltPoint=meltPoint;
        this.tempSide1;
        this.tempSide2;
        this.k=k;
    }
    
    innerTransfer(){
        let Q;
        Q=this.k*Math.abs(this.tempSide1-this.tempSide2)/this.thickness;
        return Q;
    }
    
    set changeMat(param){
        this.thickness=param.thickness;
        this.k=param.k;
    }
}