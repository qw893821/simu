"use strict"

let heater;
let cooler;
let heatMedia;
let coldMedia;
let layer1;
let timer;
let countTime;
let img;
let roombutton;
const newMat = {}
let textThickness;
let textK;

function preload() {
    img = loadImage('./images/sample.jpg');
}

function setup() {
    createCanvas(600, 700);
    heater = new Heater();
    cooler = new Heater(500, 100);
    heatMedia = new Media(2050, 0, 50);
    coldMedia = new Media(4186, 0, 0);
    layer1 = new Room(1, 10, 1085, 401);
    timer = 0;
    countTime = 30;
    imageMode(CENTER);
    image(img, width / 2, height / 2);
    textThickness = createInput();
    textThickness.position(width / 2 - 200, 150);
    textK = createInput();
    textK.position(width / 2 + 200, 150);
    roombutton = createButton('Change Material');
    roombutton.position(width / 2, 200);
    roombutton.mousePressed(setMat);
    newMat.thickness = 10;
    newMat.k = 401;
}

function draw() {
    timer++;
    Calculator();
}

function mouseClicked() {

}

function Calculator() {
    if (timer >= countTime) {
        heater.changePower();
        cooler.changePower();
        heatMedia.captureHeat(heater.power);
        coldMedia.loseHeat(cooler.power);
        heatMedia.updateText();
        coldMedia.updateText();
        layer1.tempSide1 = heatMedia.temperature;
        layer1.tempSide2 = coldMedia.temperature;
        coldMedia.captureHeat(layer1.innerTransfer());
        heatMedia.loseHeat(layer1.innerTransfer());
        timer = 0;
    }
}

function setMat() {
    newMat.thickness = Number(textThickness.value());
    newMat.k = Number(textK.value());
    if (NumberCheck(newMat.thickness, newMat.k)) {
        layer1.changeMat = {
            thickness: newMat.thickness,
            k: newMat.k
        };
    }
    else{alert("Invalid Input Value");}
}

function NumberCheck(v1, v2) {
    if ((typeof v1 != "number") || (typeof v2 != "number")||(v1 === NaN)||(v2 === NaN)||(v1 === 0) ) {
        return false;
    }
    return true;
}
