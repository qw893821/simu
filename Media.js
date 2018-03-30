class Media {
    /*capacaity is determined by the type of material 
     *x, y is the possition of DOM
     *mass can not be 0, so the mass silder will start with 1 rather than 0
    */
    constructor(capacity,x=100,y=400) {
        this.capacity = capacity;
        this.temperature = 0;
        this.mass=1
        this.slider = createSlider(1, 10,0);
        this.slider.position(x, y);
        this.text=createElement('p','Mass');
        this.text.position(x-40,y-20)
    }
    //get heat to increast the temperature
    captureHeat(cHeat) {
        this.temperature = this.temperature + (cHeat / this.capacity) / this.mass;
    }
    //lost heat will lost temperature
    loseHeat(lHeat) {
        this.temperature = this.temperature - (lHeat / this.capacity) / this.mass;
    }
    //change the mass
    changeMass(){
        this.mass=this.slider.value();
    }
    /*this is the set function set but not used
     *purpose is change the value of capacaity
    */
    set change(nCapacity) {
        this.capacity = nCapacity;
    }

}
