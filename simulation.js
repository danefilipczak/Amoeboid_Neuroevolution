var Simulation = function() {
	/*
	this should only reference creatures. never nodes. 
	*/

	this.timeStep = 0; //ticker
	this.length = 300; //length of each round
	this.obstacles = [];
	this.creatures = [];
	this.gen = []; //array of neural networks
	this.generation = 0;
	this.maxFitness = 0;
	this.cycles = 1; //how fast the simulation runs
}

Simulation.prototype.start = function() {
	console.log("generation #" + this.generation)
	this.timeStep = 0;
	this.obstacles = [];
	this.creatures = [];
	this.gen = Neuvol.nextGeneration();
	for (var i in this.gen) {
		var c = new Creature(createVector(width/this.gen.length*i- (width/2), 0));
		this.creatures.push(c)
	}
	this.generation++;
}

Simulation.prototype.update = function() {
	for (var t = 0; t < this.cycles; t++) {
		for (var i in this.creatures) {
			if (this.creatures[i].alive) {
				//var res = this.gen[i].compute(inputs);

				this.creatures[i].think(this.gen[i]);
				this.creatures[i].update();

				//check collisions, or whatever, if applicable
				// if (this.creatures[i].collidesWithPoison()) {
				// 	this.creatures[i].alive = false;
				// }

				if (this.isItOver) {
					//var fitness = this.creatures[i].getLocationDifference();
					target = p5.Vector.sub(this.creatures[i].initialPos, createVector(-50, -50));
					var fitness = this.creatures[i].getCenter().dist(target)
					Neuvol.networkScore(this.gen[i], fitness);
				}
			}
		}
		this.timeStep++;
	}


	this.creatures.forEach(function(creature) {
		creature.display();
	});

	if (this.isItOver()) {
		this.start();
	};
}

Simulation.prototype.isItOver = function() {
	if (this.timeStep > this.length) {
		return true;
	} else {
		return false;
	}
}