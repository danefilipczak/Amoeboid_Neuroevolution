
var creature;

function setup() {
    createCanvas(windowWidth, windowHeight);
    var centerX = width / 2;
    var centerY = height / 2;
    creature = new Creature(createVector(centerX, centerY))
    
}


function draw() {
    background(255);
    //translate(centerX, centerY);
    //scale(scalar);
    fill(0);
    //noFill();
    
    fill(0);
    noStroke();
    




    //
    //creature.think(brain);
    creature.update();
    creature.display();
}