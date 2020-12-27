Creep.prototype.init_upgrader = function(){
    this.room.memory.upgrader_creeps[this.id] = this.name
}

Creep.prototype.cleanup_upgrader = function(){
    //remove this creep from the active upgraders 
    delete this.room.memory.upgrader_creeps[this.id]
}

Creep.prototype.upgrader_role = function(){
    // this.say(this.store.getUsedCapacity(RESOURCE_ENERGY))
    if(this.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && this.memory.target === null){
        this.memory.target = this.find_energy().id
    }
    var tgt = Game.getObjectById(this.memory.target)
    
    if(tgt === null){
        this.memory.target = this.room.controller.id
        tgt = this.room.controller
    }
    //This is just picking up from sources- dropped energy will never be picked up
    if(tgt.structureType === undefined){
        //Harvest until full
        if(this.store.getFreeCapacity(RESOURCE_ENERGY) > 0){
            if(this.harvest(tgt) === ERR_NOT_IN_RANGE){
                this.moveTo(tgt)
            }
        } else{
            this.memory.target = this.room.controller.id
        }
    } else if(tgt.structureType === STRUCTURE_CONTROLLER){
        if(this.store.getUsedCapacity(RESOURCE_ENERGY) > 0){
            if(this.upgradeController(tgt) === ERR_NOT_IN_RANGE){
                this.moveTo(tgt)
            }
        } else{
            this.memory.target = null
        }
        //Drawing from storage- once you do, set target to controller
    } else {
        var output = this.withdraw(tgt,RESOURCE_ENERGY)
        switch (output) {
            case 0:
                this.memory.target = this.room.controller.id
                break;
            case -9:
                this.moveTo(tgt)
                break;
            case -6:
                this.withdraw(tgt,RESOURCE_ENERGY,tgt.store.getUsedCapacity(RESOURCE_ENERGY))
                this.memory.target = this.room.controller.id
            default:
                break;
        }
    }
}