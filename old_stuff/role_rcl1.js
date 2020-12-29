Creep.prototype.init_rcl1 = function(){
    this.memory.harvesting = false
    this.room.memory.harvester_creeps[this.id] = this.name
}

Creep.prototype.cleanup_rcl1 = function(){
    //remove this creep from the active harvesters 
    delete this.room.memory.harvester_creeps[this.id]
}

Creep.prototype.rcl1_role = function(){
    // this.say("hi")
    //Manage switching between tasks
    //Stop harvesting if full
    //Start harvesting when empty
    if(this.store.getUsedCapacity(RESOURCE_ENERGY) === 0 && !this.memory.harvesting){
        this.memory.harvesting = true
        this.memory.target = this.room.free_source.id
    }
    if(this.store.getFreeCapacity(RESOURCE_ENERGY) === 0 && this.memory.harvesting){
        this.memory.harvesting = false
        try{
            this.memory.target = this.pos.findClosestByRange(this.room.energy_dropoff_sites).id
        } catch(TypeError) {
            this.memory.target = this.room.spawn.id
            
        }
    } else if(this.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && this.memory.target === null){
        // console.log(this.room.energy_dropoff_sites)
        try{
            this.memory.target = this.pos.findClosestByRange(this.room.energy_dropoff_sites).id
        } catch(TypeError){
            this.say("❄️")
        }
        
    }

    //if you're harvesting do that- otherwise find a place 
    var target = Game.getObjectById(this.memory.target)
    if(this.memory.harvesting){
        if(this.harvest(target) === ERR_NOT_IN_RANGE){
            this.moveTo(target)
        }
    } else {
        var output = this.transfer(target,RESOURCE_ENERGY)
        if(output === ERR_NOT_IN_RANGE){
            this.moveTo(target)
        } else if (output === ERR_FULL){
            this.memory.target = null
        } else{
            // console.log(`RCL1 creep ${this.name} had error ${output}`)
        }
    }
}