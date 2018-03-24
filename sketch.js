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
let moveArrowRed;
let moveArrowBlue;
let roombutton;
const newMat = {}
let textThickness;
let textK;
let heatInput;
let coldInput;
let heatSetBtn;
const record1 = {}
const record2 = {}
let stopBtn;
let stop;
let selectMenu=$(".selector").selectmenu("wood","metal");

function preload() {
    img = loadImage('./images/sample.jpg');
    moveArrowRed = createImg("./images/arrowRed.gif");
    moveArrowRed.size(100, AUTO);
    moveArrowBlue = createImg('./images/arrowBlue.gif');
    moveArrowBlue.size(100, AUTO);

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
    heatInput = createInput();
    heatInput.position(50, 50);
    coldInput = createInput();
    coldInput.position(450, 50);
    heatSetBtn = createButton('Set Temperature');
    heatSetBtn.position(width / 2, 0);
    heatSetBtn.mousePressed(SetTemp);
    roombutton = createButton('Change Material');
    roombutton.position(width / 2, 200);
    roombutton.mousePressed(setMat);
    newMat.thickness = 10;
    newMat.k = 401;
    moveArrowRed.position(100, 100);
    moveArrowBlue.position(500, 100);
    stopBtn = createButton('Pause');
    stopBtn.position(width / 2, 600);
    stopBtn.mousePressed(Pause);
    stop = false;
    
}

function draw() {
    //timer++;
    PauseExperment(stop);
    Calculator();
    AnimationController(heater, cooler);

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
    if (Bouncing(record1, record2)) {
        //console.log("bouncing");
        heatMedia.temperature = coldMedia.temperature = totalHeat(heatMedia, coldMedia) / (heatMedia.mass * heatMedia.capacity + coldMedia.mass * coldMedia.capacity);
    }
    //console.log(totalHeat(heatMedia,coldMedia));
}

function setMat() {
    newMat.thickness = Number(textThickness.value());
    newMat.k = Number(textK.value());
    if (NumberCheck(newMat.thickness) && NumberCheck(newMat.k)) {
        layer1.changeMat = {
            thickness: newMat.thickness,
            k: newMat.k
        };
    } else {
        alert("Invalid Input Value");
    }
}

function NumberCheck(v1) {
    if ((typeof v1 != "number") || (v1 === NaN) || (v1 === 0)) {
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
    if (((r1.temp1 > r1.temp2) && (r2.temp1 < r2.temp2)) || ((r1.temp1 < r1.temp2) && (r2.temp1 > !r2.temp2))) {
        return true;
    } else return false;
}

let totalHeat = (m1, m2) => m1.capacity * m1.temperature + m2.capacity * m2.temperature;


//have conflict with bouncing fucntion
function SetTemp() {
    let heatTemp;
    let coldTemp;
    heatTemp = Number(heatInput.value());
    coldTemp = Number(coldInput.value());
    if (NumberCheck(heatTemp)) {
        heatMedia.temperature = heatTemp;
    }
    if (NumberCheck(coldTemp)) {
        coldMedia.temperature = coldTemp;
    }
}

function AnimationController(heater, cooler) {
    if (heater.power > 0 && !stop) {
        moveArrowRed.show();
    } else {
        moveArrowRed.hide();
    }
    if (cooler.power > 0 && !stop) {
        moveArrowBlue.show();
    } else {
        moveArrowBlue.hide();
    }

}

function Pause() {
    if (!stop) {
        stop = true;
    } else {
        stop = false;
    }

}

function PauseExperment(stop) {
    if (stop) {
        timer = 0;
    } else {
        timer++;
    }
}

