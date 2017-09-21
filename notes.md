

# parameter mapping

once parameters are retreived from the neural net, a mapping is performed to put them back into pixel space. The limits of this mapping need to be chosen deliberatly because they represent the capacities of the physical structure of all creatures in our simulated world. For example, the upper limit of the `dThresh` mapping controls the maximum "elasticity" of the creature - its ability to stretch the distance between two of its nodes without "breaking", or growing a new node between them. 

| Normalized Output | Mapping |
| ----- |:-----:|
| rForce | 0.1 - 2 |
| rThresh | 3 - 20 |
| dThresh | 3 - 20 |
| aForce | 0.1 - 2 |
| aThresh | 3 - 20 |
| morphogen A | no mapping |
| morphogen B | no mapping |
| die? | boolean: output>0.5 |






# Variant 1: Simple Locomotion
## test 1
this doesn't seem to work very well, and introduces global coordinates into the model by way of x and y position. 

| Input Layer       | Output Layer         | 
| ------------- |:-------------:|
| average of neighbor's morphogen A | rForce | 
| average of neighbor's morphogen B |  rThresh  |
| position x | dThresh |
| position y | aForce |
| | aThresh |
| | morphogen A|
| | morphogen B |
| | die? |


## test 2:

taking out global position and adding current values of all the forces. 


| Input Layer       | Output Layer         | 
| ------------- |:-------------:|
| rForce | rForce | 
| rThresh |  rThresh  |
| dThresh | dThresh |
| aForce | aForce |
| aThresh | aThresh |
| average of neighbor's morphogen A | morphogen A|
| average of neighbor's morphogen B | morphogen B |
| | die? |



It's becoming apparent that you need some way to keep the shapes from degrading into straight lines, to keep the angles open and keep the shape a polygon. Math!