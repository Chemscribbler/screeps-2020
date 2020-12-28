Creep.prototype.init_harvester = function(){
    //Initializing the harvester
    this.room.memory.harvester_creeps[this.id] = this.name
    this.memory.sitting_target = null
    this.memory.target = null
}

Creep.prototype.cleanup_harvester = function(){
    //remove this creep from the active harvesters 
    delete this.room.memory.harvester_creeps[this.id]
    //request a replacement
    // this.room.spawn.request_creep('harvester')
}

Creep.prototype.harvester_role = function(){
    //If the creep is off-rolling, it finds an available source
    //prioritizing sources that have no harvesting going on, then finding the closest linearly
    if(this.memory.target===null){
        const targ_source = this.room.free_source
        this.memory.target = targ_source.id
        try{
            this.memory.sitting_target = targ_source.pos.findInRange(FIND_STRUCTURES,1,{filter: (s) => s.structureType === STRUCTURE_CONTAINER})[0].id
        } catch(TypeError){
            this.memory.sitting_target = targ_source.id
        }
    }
    if (this.harvest(Game.getObjectById(this.memory.target)) == ERR_NOT_IN_RANGE) {
            this.moveTo(Game.getObjectById(this.memory.sitting_target));
    }
}