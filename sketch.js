var simulation;
var Neuvol;
var zoom = 1;
function setup() {
    createCanvas(windowWidth, windowHeight);
    var centerX = width / 2;
    var centerY = height / 2;
    Neuvol = new Neuroevolution({
        population: 50,
        network: [7, [7, 7], 8],
        mutationRate:0.05,
        mutationRange: 0.5,
        elitism:0.5,
        nbChild: 5,
        historic: 5,
        randomBehavior: 0
    });
    simulation = new Simulation();
    simulation.start();
}


function draw() {
    background(255);
    translate(width/2, height/2)
    
    scale(zoom);
    //translate(width/(zoom*zoom)-width, height/(zoom*zoom)-height)
    simulation.update();
}