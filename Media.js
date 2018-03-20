class Media{
    constructor(capacity,x,y){
        this.capacity=capacity;
        this.temperature=0;
        this.mass=1;
        this.text=createElement('p',`Current Temperature is: ${this.temperature}`)
        this.text.position=(x,y);
    }
    
    captureHeat(cHeat){
        this.temperature=this.temperature+(cHeat/this.capacity)/this.mass;
    }
    
    loseHeat(lHeat){
        this.temperature=this.temperature-(lHeat/this.capacity)/this.mass;
    }
    
    updateText(){
        this.text.html(`Current Temperature is: ${this.temperature}`);
    }
    
    set change(nCapacity){
        this.capacity=nCapacity;
    }
    
}