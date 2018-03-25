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
let heatArea;
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
let newMatName;
let matList;
let jSonText;
let heatCavs;
let coldCavs;
let heatTemp;
let coldTemp;

function openDia() {
    $("#MatCreate").dialog('open');
}

function closeDia() {
    $("#MatCreate").dialog('close');
}
$(document).ready(function () {
    $("#MatCreate").dialog();
    $("#MatCreate").dialog('close');
    $("#confirm").click(creatNewMat);
    $("#cancel").click(closeDia);
});

function preload() {
    moveArrowRed = createImg("./images/arrowRed.gif");
    moveArrowRed.size(100, AUTO);
    moveArrowBlue = createImg('./images/arrowBlue.gif');
    moveArrowBlue.size(100, AUTO);

}

function setup() {
    createCanvas(windowWidth, 400);
    heater = new Heater(100,450);
    cooler = new Heater(500, 450);
    heatMedia = new Media(2050);
    coldMedia = new Media(4186);
    layer1 = new Room(1, 10, 1085, 401);
    timer = 0;
    countTime = 30;
    imageMode(CENTER);
    //textThickness = createInput();
    //textThickness.position(width / 2 - 200, 150);
    //textK = createInput();
    //textK.position(width / 2 + 200, 150);
    heatInput = createInput();
    heatInput.position(80, 500);
    coldInput = createInput();
    coldInput.position(width / 2+50, 500);
    heatSetBtn = createButton('Set Temperature');
    heatSetBtn.position(width / 2-150, 500);
    heatSetBtn.mousePressed(SetTemp);
    roombutton = createButton('Submit Material');
    roombutton.position(180, 555);
    roombutton.mousePressed(SetMat);
    newMat.thickness = 10;
    newMat.k = 401;
    moveArrowRed.position(100, 280);
    moveArrowBlue.position(500, 280);
    stopBtn = createButton('Pause Experiment');
    stopBtn.position(width / 2, 555);
    stopBtn.mousePressed(Pause);
    stop = false;
    jSonText = '{"Material":[' +
        '{"Name":"Diamond","k":"1000" },' +
        '{"Name":"Copper","k":"401" },' +
        '{"Name":"Water Vapor","k":"0.6" },' +
        '{"Name":"Mercury","k":"8.34" },' +
        '{"Name":"Silver","k":"420"}]}';
    matList = JSON.parse(jSonText);
    createSelectList();
    heatCavs = $("#heat");
    coldCavs = $("#cold");
    heatTemp=createElement('p');
    heatTemp.position(0,height/2);
    coldTemp=createElement('p');
    coldTemp.position(width-200,height/2);
}



function draw() {
    //timer++;
    PauseExperment(stop);
    Calculator();
    AnimationController(heater, cooler);
    fillCanvas(heatMedia.temperature,heatCavs);
    fillCanvas(coldMedia.temperature,coldCavs);
    heatTemp.html(heatMedia.temperature.toFixed(4));
    coldTemp.html(coldMedia.temperature.toFixed(4));
}

function mouseClicked() {
    console.log(newMat.k);
}

function Calculator() {
    if (timer >= countTime) {
        heater.changePower();
        cooler.changePower();
        heatMedia.captureHeat(heater.power);
        coldMedia.loseHeat(cooler.power);
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

function SetMat() {
    let select = document.getElementById('selector');
    newMatName = select.options[select.selectedIndex].value;
    for (let i = 0; i < matList.Material.length; i++) {
        if (newMatName == matList.Material[i].Name) {
            newMat.k = Number(matList.Material[i].k);
        }
    }
    if (newMatName == "New Material...") {
        AddNewMat(newMatName);
    }
    layer1.k = newMat.k;
}

function AddNewMat(name) {
    //let select = document.getElementById('selector');
    //let option = document.createElement('option');
    //option.text = "test";
    //select.add(option);
    openDia();
}

function creatNewMat() {
    let select = document.getElementById('selector');
    let option = document.createElement('option');
    let name = document.getElementById('name');
    let conducitvity = document.getElementById('conductivity');
    if (createCheck(name, conducitvity)) {
        option.text = name.value;
        select.add(option);
        matList.Material[matList.Material.length] = {
            Name: name.value,
            k: Number(conducitvity.value)
        };
    } else {
        alert("invalid input")
    }
    closeDia();
}

function createCheck(name, num) {
    if ((typeof name.value === 'string') && (NumberCheck(Number(num.value)))) {
        return true;
    } else {
        console.log(typeof name.value)
        return false;
    }
}

function createSelectList() {
    for (let i = 0; i < matList.Material.length; i++) {
        let select = document.getElementById('selector');
        let option = document.createElement('option');
        option.text = matList.Material[i].Name;
        select.add(option);
    }
}

function fillCanvas(temp, cavs) {
    if (temp > 0) {
        let colorg = map(temp, 0, 100, 170, 70);
        let colorb = map(temp, 0, 100, 255, 30);
        let colorr=250;
        cavs.css("background-color", `rgb(${colorr},${colorg},${colorb})`);
    }
    else if(temp<0){
        let colorg = map(temp, 0, 100, 170, 70);
        let colorr = map(temp, 0, -100, 255, 30);
        let colorb=250;
        cavs.css("background-color", `rgb(${colorr},${colorg},${colorb})`);
    }
    else {cavs.css("background-color", `rgb(255,255,255)`);}
}
