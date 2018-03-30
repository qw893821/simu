"use strict"
/*All image is draw by myself*/
/*heat related staff
 *heater is one to create heat to the left media called heatMedia
 *heatTitle is the test show "current tempeature"
 *heatTemp is the one show temperature value
 *heatSet is the text indicate filed for manually set heat temperature
 *heatInput is the input filed for manually set heat temperature
 */
let heater;
let heatMedia;
let heatCavs;
let heatTitle;
let heatTemp;
let heatSet;
let heatInput;
//layer1 is the media in the center to transfer heat
let layer1;
//timer and countTime are used to make sure the calculate work 2fps
let timer;
let countTime;
//images
let moveArrowRed;
let moveArrowBlue;
let lrArrow;
let rlArrow;
/*roombutton the button used to submit material selection
 *heatSetBtn the button to set temperature
 *stopBtn the button to stop simulation
 */
let heatSetBtn;
let roombutton;
let stopBtn;
//boolean value to determin if the simulation is stopped
let stop;
let newMatName;

let matList;
let jSonText;

/*cold related staff
 *cooler is one to create heat to the right media called coldMedia
 *coldTitle is the test show "current tempeature"
 *coldTemp is the one show temperature value
 *coldSet is the text indicate filed for manually set heat temperature
 *coldInput is the input filed for manually set heat temperature
 */
let coldMedia;
let cooler;
let coldTitle;
let coldTemp;
let coldSet;
let coldCavs;
let coldInput;
//test shows the material name in when mouse is overthe media
let text1;
//this two const record records the temperature before and after the temperature have changed.
const record1 = {}
const record2 = {}
//const of the newMat, record the new material name and k
const newMat = {}

//this function open the material input field
function openDia() {
    $("#MatCreate").dialog('open');
}
//this function close the material input field
function closeDia() {
    $("#MatCreate").dialog('close');
}
//when DOM are fully initialized load the follow things.
$(document).ready(function () {
    $("#MatCreate").dialog();
    $("#MatCreate").dialog('close');
    $("#confirm").click(creatNewMat);
    $("#cancel").click(closeDia);
    $("#mat_window").dialog();
    $("#mat_window").dialog('close');
    //mousemover the media to show current material k value
    $("#material_cavs").mouseenter(function () {
        $("#mat_window").dialog('open');
        $("#text1").html(text1);
    });
    $("#material_cavs").mouseleave(function () {
        $("#mat_window").dialog('close');
    });
});
//image in P5js should be load in preload
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
    heatMedia = new Media(2050,100,400);
    coldMedia = new Media(4186,500,400);
    layer1 = new Room(1, 10, 1085, 401);
    timer = 0;
    countTime = 30;
    imageMode(CENTER);
    heatInput = createInput();
    heatInput.position(80, 500);
    heatSet = createElement('p', 'Temperature');
    heatSet.position(0, 480);
    coldInput = createInput();
    coldInput.position(width / 2 + 50, 500);
    coldSet = createElement('p', 'Temperature');
    coldSet.position(width / 2 + 200, 480);
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
    heatTemp.html(`${heatMedia.temperature.toFixed(4)}F`);
    coldTemp.html(`${coldMedia.temperature.toFixed(4)}F`);
}

/*main function of the simulation
 *this calculator will run 2 times per second becuase of the timer check(default 60fps)
 */
function Calculator() {
    if (timer >= countTime) {
        heater.changePower();
        cooler.changePower();
        heatMedia.captureHeat(heater.power);
        coldMedia.loseHeat(cooler.power);
        record1.temp1 = heatMedia.temperature;
        record1.temp2 = coldMedia.temperature;
        /*“Const.” MDN Web Docs, developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const. 
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const
        how to manipulate const*/
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
    text1 = "Current Conductivity: " + layer1.k.toString();
}



/*this numberCheck function is inappropriate. 
 ×must be missing somthing but cannot figure out
 *first step check if v1's type is number
 *check if v1 is "not a number"
 *I will pass a variable which is converted to number type with Number() function so the first check is useless. So I use the second check to make sure the input value is not "NaN"
*/
function NumberCheck(v1) {
    if ((typeof v1 != "number") || (v1 === NaN)) {
        return false;
    }
    return true;
}
/*Check the thermal transfor direction, which with high temperature value will transfor heat to the lower one.
 *one with higher temperature will lost temperature and the lower one will get the heat
 */
function HeatExchange(m1, m2, layer) {
    if (m1.temperature > m2.temperature) {
        m1.loseHeat(layer.innerTransfer());
        m2.captureHeat(layer.innerTransfer());
    } else {
        m1.captureHeat(layer.innerTransfer());
        m2.loseHeat(layer.innerTransfer());
    }
}
/*when the transform rate is two high, either a high thermal conducition value of large temperature gap, the thermal transform data will be extream large which make the lower temperature become high than the former higher one become lower, I call it bouncing
 *to avoid bouncing, I check the value before(r1) and after(r2) the heat transform, the if bouncing apperas, is will return true.
 */
function Bouncing(r1, r2) {
    if (((r1.temp1 > r1.temp2) && (r2.temp1 < r2.temp2)) || ((r1.temp1 < r1.temp2) && (r2.temp1 > r2.temp2))) {
        return true;
    } else {
        return false;
    }
}
//try to use ES6 arrow function. look cool, with the function in one line
/*This line is the same as the following function
fucntion totaHeat(m1,m2){
    return m1.capacity * m1.temperature + m2.capacity * m2.temperature;
}
*/
let totalHeat = (m1, m2) => m1.capacity * m1.temperature + m2.capacity * m2.temperature;

/*Function used to set the temperature of the input value from the temperature input box.
 *heatMedia will have the the value from heatInput input box
 *coldMedia will have the value from coldInput input box
 *when the value is not a number, user will get a alter, and number will not set.
 *can set one value at a time 
 *isNaN() is the better way to check if the input is number;
 “IsNaN().” MDN Web Docs, developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN. 
 */
function SetTemp() {
    let heatTemp;
    let coldTemp;
    heatTemp = Number(heatInput.value());
    coldTemp = Number(coldInput.value());
    if (NumberCheck(heatTemp) && !isNaN(heatTemp)) {
        heatMedia.temperature = heatTemp;
    } else {
        alert("not number");
    }
    if (NumberCheck(coldTemp) && !isNaN(coldTemp)) {
        coldMedia.temperature = coldTemp;
    } else {
        alert("not number");
    }
}

//this function shows/hide the .git file. when there is no input, the image will hide.
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
/*pause the simulation by setting the value to true
 *continue when the value is false
 */
function Pause() {
    if (!stop) {
        stop = true;
    } else {
        stop = false;
    }
}
//force to set the timer to 0 to stop the calculation
function PauseExperment(stop) {
    if (stop) {
        timer = 0;
    } else {
        timer++;
    }
}
/*set the material type
 *if select meun is with a certain type of name, if will set to the chiosen material
 *if select one is "New material", then show the input field to set a new material
 */
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
//this fucntion opens the material create input box
function AddNewMat(name) {
    openDia();
}
/*it is also used to creat new material
 *the newly created material will be add to the matList object
 */
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
/*check if the input is valid
 *name.value maybe not necessar because the input value will be string
 */
function createCheck(name, num) {
    if ((typeof name.value === 'string') && (NumberCheck(Number(num.value)))) {
        return true;
    } else {
        return false;
    }
}
/*this function will create the mateial list.
 *create the selection meun based on the element have in matList
 */
function createSelectList() {
    for (let i = 0; i < matList.Material.length; i++) {
        let select = document.getElementById('selector');
        let option = document.createElement('option');
        option.text = matList.Material[i].Name;
        select.add(option);
    }
}
/*this function change the fill color of canvas in html
 *`${}`is useful when combine string and variable
 *when temp is above 0, if will choose a warm tone, when below 0, will choose a cool tone
 *the color change will work in 100 to -100
 *default value is white
 */
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
//show the heat transform direction arrow based on the heat transform direction
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
