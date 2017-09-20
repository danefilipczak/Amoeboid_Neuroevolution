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
    this.maxNodes = 30;
    this.minNodes = 5;
    this.initialPos = vector;
    this.alive = true;
    this.radius = 10; //initial radius
    this.divisions = 10; //initial number of divisions

    this.init(this.divisions, this.radius);



}


Creature.prototype.init = function() {
    var self = this;
    angleMode(DEGREES);
    for (var i = 0; i < this.divisions; i++) {
        var vec = createVector(this.radius, 0);
        var angle = 360 / this.divisions * i;
        vec.rotate(angle);
        var node = new Node(vec.add(this.initialPos), self);
        this.nodes.push(node);
    }
    //console.log(this.getCenter());
};

Creature.prototype.think = function(brain) {
    /*
    @param {brain} neural network

    Updates threshold, forces, and mutagen values 
    */

    var averageMorphogensA = this.getAverageMorphogensA();
    var averageMorphogensB = this.getAverageMorphogensB();

    for (var i in this.nodes) {
        //var target = p5.Vector.sub(this.initialPos, createVector(-50, -50));
        var inputs = [
            this.nodes[i].rForce,
            this.nodes[i].rThresh,
            this.nodes[i].dThresh,
            this.nodes[i].aForce,
            this.nodes[i].aThresh,
            averageMorphogensA[i],
            averageMorphogensB[i],
            //this.nodes[i].pos.x / width,
            //this.nodes[i].pos.y / height,
        ]

        res = brain.compute(inputs);

        this.nodes[i].rForce = map(res[0], 0.0, 1.0, 0.0, 0.3);
        this.nodes[i].rThresh = map(res[1], 0.0, 1.0, 10, 50);
        this.nodes[i].dThresh = map(res[2], 0.0, 1.0, 10, 50);
        this.nodes[i].aForce = map(res[3], 0.0, 1.0, 0.0, 0.3);
        this.nodes[i].aThresh = map(res[4], 0.0, 1.0, 10, 50);
        this.nodes[i].morphogenA = res[5];
        this.nodes[i].morphogenB = res[6];
        if (res[7] > 0.5) {
            this.nodes[i].die()
        };
    }
}



Creature.prototype.update = function() {
    /*
    Here we do all the work of updating each node's position based on its parameters.
    */
    if(this.nodes.length<this.maxNodes){

        this.rejectAll();
        this.edgeSplit();
    }
    this.attractNeighbors();
    //this.enforceAngles();
    this.nodes.forEach(function(node) {
        node.applyForce();
    })

}

Creature.prototype.getLocationDifference = function() {
    return this.getCenter().dist(this.initialPos)
}


Creature.prototype.getCenter = function() {
    var average = createVector(0, 0, 0);

    this.nodes.forEach(function(node) {
        average.add(node.pos);
    })

    average.div(this.nodes.length)

    return average;
}


Creature.prototype.display = function() {


    fill(102, 102, 51, 20);
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
    var self = this;
    var d = p5.Vector.lerp(vec1, vec2, 0.5);
    var bulb = new Node(d, self);
    return bulb;
}

Creature.prototype.edgeSplit = function() {

    for (var i = 0; i < this.nodes.length; i++) {
        var neighbor = i + 1;
        if (neighbor > this.nodes.length - 1) {
            neighbor = 0
        };
        if (this.nodes[i].pos.dist(this.nodes[neighbor].pos) > this.nodes[i].dThresh && this.nodes.length < this.maxNodes) {
            var bulb = this.growMidpoint(this.nodes[i].pos, this.nodes[neighbor].pos);
            this.nodes.splice(neighbor, 0, bulb);
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

function findAngle(p0, p1, p2) {
    var b = Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2),
        a = Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2),
        c = Math.pow(p2.x - p0.x, 2) + Math.pow(p2.y - p0.y, 2);
    return Math.acos((a + b - c) / Math.sqrt(4 * a * b));
}

Creature.prototype.enforceAngles = function() {
    for (var i = 0; i < this.nodes.length; i++) {
        var right = i + 1;
        var left = i - 1;
        if (right > this.nodes.length - 1) {
            right = 0
        };
        if (left < 0) {
            left = this.nodes.length - 1
        };
        if(findAngle(this.nodes[left], this.nodes[i], this.nodes[right]<1)){
            var escape = p5.Vector.sub(this.nodes[left], this.nodes[right]);
            this.nodes[left].addForce(escape.mult(-1));
        }
    }
}

Creature.prototype.getAverageMorphogensA = function() {
    averages = [];
    for (var i = 0; i < this.nodes.length; i++) {
        var right = i + 1;
        var left = i - 1;
        if (right > this.nodes.length - 1) {
            right = 0
        };
        if (left < 0) {
            left = this.nodes.length - 1
        };
        averages.push((this.nodes[left].morphogenA + this.nodes[right].morphogenA) / 2)
    }
    return averages;
}

Creature.prototype.getAverageMorphogensB = function() {
    averages = [];
    for (var i = 0; i < this.nodes.length; i++) {
        var right = i + 1;
        var left = i - 1;
        if (right > this.nodes.length - 1) {
            right = 0
        };
        if (left < 0) {
            left = this.nodes.length - 1
        };
        averages.push((this.nodes[left].morphogenB + this.nodes[right].morphogenB) / 2)
    }
    return averages;
}