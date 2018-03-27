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
let lrArrow;
let rlArrow;
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
let heatTitle;
let heatTemp;
let coldTitle;
let coldTemp;
let heatSet;
let coldSet;

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
    lrArrow = createImg("./images/lrarrow.gif");
    lrArrow.size(AUTO, 70);
    rlArrow = createImg("./images/rlarrow.gif")
    rlArrow.size(AUTO, 70);
}

function setup() {
    createCanvas(windowWidth, 400);
    heater = new Heater(100, 450);
    cooler = new Heater(500, 450);
    heatMedia = new Media(2050);
    coldMedia = new Media(4186);
    layer1 = new Room(1, 10, 1085, 401);
    timer = 0;
    countTime = 30;
    imageMode(CENTER);
    heatInput = createInput();
    heatInput.position(80, 500);
    heatSet=createElement('p','Temperature');
    heatSet.position(0,480);
    coldInput = createInput();
    coldInput.position(width / 2 + 50, 500);
    coldSet=createElement('p','Temperature');
    coldSet.position(width / 2 + 200,480);
    heatSetBtn = createButton('Set Temperature');
    heatSetBtn.position(width / 2 - 150, 500);
    heatSetBtn.mousePressed(SetTemp);
    roombutton = createButton('Submit Material');
    roombutton.position(180, 555);
    roombutton.mousePressed(SetMat);
    newMat.thickness = 10;
    newMat.k = 401;
    moveArrowRed.position(150, 280);
    moveArrowBlue.position(500, 280);
    lrArrow.position(width / 2 - 200, height / 2 - 120);
    rlArrow.position(width / 2 - 120, height / 2 - 120);
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
    heatTitle = createElement('p', 'Currnet Temperature:');
    heatTitle.position(0, height / 2 + 70);
    heatTemp = createElement('p');
    heatTemp.position(0, height / 2 + 90);
    coldTitle = createElement('p', 'Currnet Temperature:');
    coldTitle.position(600, height / 2 + 70);
    coldTemp = createElement('p');
    coldTemp.position(600, height / 2 + 90);
    
}



function draw() {
    PauseExperment(stop);
    Calculator();
    AnimationController(heater, cooler);
    showTransformArrow(heatMedia, coldMedia);
    fillCanvas(heatMedia.temperature, heatCavs);
    fillCanvas(coldMedia.temperature, coldCavs);
    heatTemp.html(heatMedia.temperature.toFixed(4));
    coldTemp.html(coldMedia.temperature.toFixed(4));

}

function mouseClicked() {

}

function Calculator() {
    if (timer >= countTime) {
        heater.changePower();
        cooler.changePower();
        heatMedia.captureHeat(heater.power);
        coldMedia.loseHeat(cooler.power);
        record1.temp1 = heatMedia.temperature;
        record1.temp2 = coldMedia.temperature;
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const
        //how to manipulate const
        layer1.tempSide1 = heatMedia.temperature;
        layer1.tempSide2 = coldMedia.temperature;
        HeatExchange(heatMedia, coldMedia, layer1);
        record2.temp1 = heatMedia.temperature;
        record2.temp2 = coldMedia.temperature;
        timer = 0;
        if (Bouncing(record1, record2)) {
            heatMedia.temperature = coldMedia.temperature = totalHeat(heatMedia, coldMedia) / (heatMedia.mass * heatMedia.capacity + coldMedia.mass * coldMedia.capacity);
        }

    }

}




function NumberCheck(v1) {
    if ((typeof v1 != "number") || (v1 === NaN)) {
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
    if (((r1.temp1 > r1.temp2) && (r2.temp1 < r2.temp2)) || ((r1.temp1 < r1.temp2) && (r2.temp1 > r2.temp2))) {
        return true;
    } else {
        return false;
    }
}

let totalHeat = (m1, m2) => m1.capacity * m1.temperature + m2.capacity * m2.temperature;

function SetTemp() {
    let heatTemp;
    let coldTemp;
    heatTemp = Number(heatInput.value());
    coldTemp = Number(coldInput.value());
    if (NumberCheck(heatTemp)&&!isNaN(heatTemp)) {
        heatMedia.temperature = heatTemp;
    }
    else {alert("not number");}
    if (NumberCheck(coldTemp)&&!isNaN(coldTemp)) {
        coldMedia.temperature = coldTemp;
    }
    else {alert("not number");}
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
        alert("invalid input");
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
        let colorr = 250;
        cavs.css("background-color", `rgb(${colorr},${colorg},${colorb})`);
    } else if (temp < 0) {
        let colorg = map(temp, 0, -100, 170, 70);
        let colorr = map(temp, 0, -100, 255, 30);
        let colorb = 250;
        cavs.css("background-color", `rgb(${colorr},${colorg},${colorb})`);
    } else {
        cavs.css("background-color", `rgb(255,255,255)`);
    }
}

function showTransformArrow(media1, media2) {
    if (media1.temperature > media2.temperature && !stop) {
        lrArrow.show();
        rlArrow.hide();
    } else if (media1.temperature < media2.temperature && !stop) {
        lrArrow.hide();
        rlArrow.show();
    } else {
        lrArrow.hide();
        rlArrow.hide();
    }
}
