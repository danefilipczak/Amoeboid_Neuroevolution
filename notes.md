# love

motivation is a sickly tool



# parameter mapping

once parameters are retreived from the neural net, a mapping is performed to put them back into pixel space. The limits of this mapping need to be chosen deliberatly because they represent the capacities of the physical structure of our creature. For example, the upper limit of the `dThresh` mapping controls the maximum "elasticity" of the creature - its ability to stretch the distance between two of its nodes without "breaking", or growing a new node between them. 

