class Media{
    constructor(capacity){
        this.capacity=capacity;
        this.temperature=0;
        this.mass=1;
    }
    
    captureHeat(cHeat){
        this.temperature=this.temperature+(cHeat/this.capacity)/this.mass;
    }
    
    loseHeat(lHeat){
        this.temperature=this.temperature-(lHeat/this.capacity)/this.mass;
    }
    
    
    set change(nCapacity){
        this.capacity=nCapacity;
    }
    
}