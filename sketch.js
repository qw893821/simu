"use strict"
/*comment img related code to make it work on chrome*/
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
const record1 = {}
const record2 = {}

function preload() {
    img = loadImage('./images/sample.jpg');
    moveArrowRed=loadImage('./images/arrowRed.gif');
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
        image(moveArrowRed,100,400);
        heater.changePower();
        cooler.changePower();
        heatMedia.captureHeat(heater.power);
        coldMedia.loseHeat(cooler.power);
        heatMedia.updateText();
        coldMedia.updateText();
        record1.temp1 = heatMedia.temperature;
        record1.temp2 = coldMedia.temperature;
        layer1.tempSide1 = heatMedia.temperature;
        layer1.tempSide2 = coldMedia.temperature;
        //coldMedia.captureHeat(layer1.innerTransfer());
        //heatMedia.loseHeat(layer1.innerTransfer());
        //extream condition will case bug.
        HeatExchange(heatMedia, coldMedia, layer1);
        record2.temp1 = heatMedia.temperature;
        record2.temp2 = heatMedia.temperature;
        timer = 0;
    }
    if (Bouncing(record1,record2)) {
        //console.log("bouncing");
        heatMedia.temperature = coldMedia.temperature = totalHeat(heatMedia,coldMedia) / (heatMedia.mass * heatMedia.capacity + coldMedia.mass * coldMedia.capacity);
    }
    //console.log(totalHeat(heatMedia,coldMedia));
}

function setMat() {
    newMat.thickness = Number(textThickness.value());
    newMat.k = Number(textK.value());
    if (NumberCheck(newMat.thickness, newMat.k)) {
        layer1.changeMat = {
            thickness: newMat.thickness,
            k: newMat.k
        };
    } else {
        alert("Invalid Input Value");
    }
}

function NumberCheck(v1, v2) {
    if ((typeof v1 != "number") || (typeof v2 != "number") || (v1 === NaN) || (v2 === NaN) || (v1 === 0)) {
        return false;
    }
    return true;
}

function HeatExchange(m1, m2, layer) {
    if (m1.temperature > m2.temperature) {
        m1.loseHeat(layer.innerTransfer());
        m2.captureHeat(layer.innerTransfer());
    } else {
        m1.captureHeat(layer.innerTransfer());
        m2.loseHeat(layer.innerTransfer());
    }
}

function Bouncing(r1, r2) {
    if (((r1.temp1 > r1.temp2) && (r2.temp1 < r2.temp2)) || ((r1.temp1 < r1.temp2) && (r2.temp1 >! r2.temp2))) {
        return true;
    } else return false;
}

let totalHeat=(m1, m2) => m1.capacity * m1.temperature + m2.capacity * m2.temperature;
