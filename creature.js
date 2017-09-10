// var nodes = [];
// var divisions = 10;
// var r = 200; //100
// var rForce = -0.71;
// var rThresh = 200;
// var dThresh = 53; //53
// var aForce = 0.102;
// var aThresh = 50; //50


function keyPressed() {
    if (key == ' ') {
        noLoop();
    }
}

var Creature = function(vector) {
    /*
    Creature class.
    @param {vector} starting location
    */
    this.nodes = []
    this.maxNodes = 200;
    this.pos = vector

    this.radius = 10; //initial radius
    this.divisions = 10; //initial number of divisions

    this.init(this.divisions, this.radius);



}


Creature.prototype.init = function() {
    angleMode(DEGREES);
    for (var i = 0; i < this.divisions; i++) {
        var vec = createVector(this.radius, 0);
        var angle = 360 / this.divisions * i + random(-10, 10);
        vec.rotate(angle);
        var node = new Node(vec.add(this.pos));
        this.nodes.push(node);
    }
};

Creature.prototype.think = function(brain) {
    /*
    @param {brain} callable neural network

    Updates threshold, forces, and mutagen values 
    */

    //get the average of each neighbor's mutagens



    // this.nodes.forEach(function(node) {
    //     /*
    //     inputs:
    //     mutagenA
    //     mutagenB
    //     position
    //     // eventually the location of the closest obstacle
    //     */
    //     //get the results from the brain

    //     node.rForce =
    //         node.rThresh =
    //         node.dThresh =
    //         node.aForce =
    //         node.aThresh =

    //         node.mutagenA =
    //         node.mutagenB =
    // });


}



Creature.prototype.update = function() {
    /*
    Here we do all the work of updating each node's position based on its parameters.
    */

    this.rejectAll();
    this.edgeSplit();
    this.attractNeighbors();
    this.nodes.forEach(function(node){
        node.applyForce();
    })

}


Creature.prototype.display = function() {
    

    fill(102, 102, 51);
    strokeWeight(5);
    stroke(10);
    beginShape();
    for (var i = 0; i < this.nodes.length; i++) {
        vertex(this.nodes[i].pos.x, this.nodes[i].pos.y);
    }
    endShape(CLOSE);


    this.nodes.forEach(function(node) {
        node.display();
    })
}



Creature.prototype.rejectAll = function() {
    for (var i = 0; i < this.nodes.length; i++) {
        for (var j = 0; j < this.nodes.length; j++) {
            if (i !== j) {
                if (this.nodes[j].pos.dist(this.nodes[i].pos) < this.nodes[i].rThresh) {
                    var force = p5.Vector.sub(this.nodes[i].pos, this.nodes[j].pos);
                    force.normalize();
                    this.nodes[i].addForce(force.mult(this.nodes[i].rForce));
                }
            }
        }
    }
}

Creature.prototype.growMidpoint = function(vec1, vec2) {
    var d = p5.Vector.lerp(vec1, vec2, 0.5);
    var bulb = new Node(d);
    return bulb;
}

Creature.prototype.edgeSplit = function() {
    if(this.nodes.length<this.maxNodes){
        for (var i = 0; i < this.nodes.length; i++) {
            var neighbor = i + 1;
            if (neighbor > this.nodes.length - 1) {
                neighbor = 0
            };
            if (this.nodes[i].pos.dist(this.nodes[neighbor].pos) > this.nodes[i].dThresh) {
                var bulb = this.growMidpoint(this.nodes[i].pos, this.nodes[neighbor].pos);
                this.nodes.splice(neighbor, 0, bulb);
            }
        }
    }
}


Creature.prototype.attractNeighbors = function() {
    for (var i = 0; i < this.nodes.length; i++) {
        var right = i + 1;
        var left = i - 1;
        if (right > this.nodes.length - 1) {
            right = 0
        };
        if (left < 0) {
            left = this.nodes.length - 1
        };
        if (this.nodes[i].pos.dist(this.nodes[right].pos) > this.nodes[i].aThresh) {
            var force = p5.Vector.sub(this.nodes[i].pos, this.nodes[right].pos);
            force.normalize();
            this.nodes[i].addForce(force.mult(-this.nodes[i].aForce));
        }
        if (this.nodes[i].pos.dist(this.nodes[left].pos) > this.nodes[i].aThresh) {
            var force = p5.Vector.sub(this.nodes[i].pos, this.nodes[left].pos);
            force.normalize();
            this.nodes[i].addForce(force.mult(-this.nodes[i].aForce));
        }
    }
}
