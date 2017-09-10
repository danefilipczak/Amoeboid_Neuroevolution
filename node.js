var Node = function(vector) {
	
	this.pos = vector;
	this.diameter = 2;
	this.force = createVector(0, 0, 0);

	this.rForce = 1.3;
	this.rThresh = 10;
	this.dThresh = 5; //53
	this.aForce = 1;
	this.aThresh = 3; //50

	this.mutagenA = 0;
	this.mutagenB = 0;

};

Node.prototype.addForce = function(forceVector){
	this.force.add(forceVector);
}

Node.prototype.applyForce = function(){
	
		this.pos.add(this.force);
		this.force = createVector(0, 0, 0);
	
	
}

Node.prototype.display = function() {
	noStroke();
	fill(0, 255, 255);
	//draw a circle at the node's position with diameter of 10
	ellipse(this.pos.x, this.pos.y, this.diameter, this.diameter);
};