class Heater {
    /*x,y value determine the slider location
     *max is the maxmium out put of heater
     *power is the out put of the heater
     */
    constructor(x = 100, y = 100) {
        this.max = 2000;
        this.power = this.max;
        this.slider = createSlider(0, 100,0);
        this.slider.position(x, y);
        this.text=createElement('p','Output');
        this.text.position(x-50,y-20)
    }
    /*use the silder to determin the output of heater
     *divide the slider value by 100 to make it the out put easy to control.
     *may the silder with small range could have to same result, but will smooth. the value of slider is an integer
     */
    changePower() {
        this.power = this.max * (this.slider.value() / 50);
    }

}
