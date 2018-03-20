class Heater {
    constructor(x=100,y=100) {
        this.power = 2000;
        this.slider = createSlider(0, 100, 0);
        this.slider.position(x,y);
    }

    changePower() {
        this.power = 2000 * (this.slider.value() / 100);
    }

}
