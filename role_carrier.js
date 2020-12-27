Creep.prototype.init_carrier = function(){
    //Initializing the carrier
    if(this.room.memory.carrier_creeps === undefined){
        this.room.memory.carrier_creeps = {}
    }
    this.room.memory.carrier_creeps[this.id] = this.name
    this.memory.pickup = true
}

Creep.prototype.cleanup_carrier = function(){
    //remove this creep from the active carriers 
    delete this.room.memory.carrier_creeps[this.id]
}

Creep.prototype.find_optimal_dropoff = function(underAttack=false){
    if(underAttack){
        //TODO- prioritize towers > spawner/extentions >>> storage
    } else {
        const all_dropoff_sites = this.room.energy_dropoff_sites
        var least_filled = Math.pow(10,7)
        var dropoff_candidates = []
        all_dropoff_sites.forEach(s =>{
            if(s.store.getFreeCapacity(RESOURCE_ENERGY) < least_filled){
                least_filled = s.store.getFreeCapacity(RESOURCE_ENERGY)
                dropoff_candidates = Array(s)
            } else if (s.store.getFreeCapacity(RESOURCE_ENERGY) === least_filled) {
                dropoff_candidates.push(s)
            }
        })
        return this.pos.findClosestByRange(dropoff_candidates)
    }
}

Creep.prototype.carrier_role = function(){
    // this.say("HI")
    if(this.memory.pickup && this.store.getFreeCapacity(RESOURCE_ENERGY)===0){
        this.memory.pickup = false
        this.memory.target = this.find_optimal_dropoff().id
        // const dropoff_sites = this.room.energy_dropoff_sites
        // var least_filled = 20000000
        // dropoff_sites.forEach(element => {
        //     if(element.store.getFreeCapacity(RESOURCE_ENERGY) < least_filled){
        //         least_filled = element.store.getFreeCapacity(RESOURCE_ENERGY)
        //         this.memory.target = element.id
        //     }
        // });
    }
    if(!this.memory.pickup && this.store.getUsedCapacity(RESOURCE_ENERGY)===0){
        //Get most filled pickup site
        const pickup_sites = this.room.source_storage
        var most_filled = 0
        pickup_sites.forEach(element =>{
            if(most_filled < element.store.getUsedCapacity(RESOURCE_ENERGY)){
                most_filled = element.store.getUsedCapacity(RESOURCE_ENERGY)
                this.memory.target = element.id
            }
        })
        this.memory.pickup = true

    }

    var tgt = Game.getObjectById(this.memory.target)
    if(this.memory.pickup){
        if(this.withdraw(tgt,RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
            this.moveTo(tgt)
        }
    } else{
        if(this.transfer(tgt,RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
            this.moveTo(tgt)
        } else if (this.transfer(tgt,RESOURCE_ENERGY)===ERR_FULL){
        //     const dropoff_sites = this.room.energy_dropoff_sites
        //     var least_filled = 20000000
        //     dropoff_sites.forEach(element => {
        //         if(element.store.getFreeCapacity(RESOURCE_ENERGY) < least_filled){
        //             least_filled = element.store.getFreeCapacity(RESOURCE_ENERGY)
        //             this.memory.target = element.id
        //     }
        // });
            this.memory.target = this.find_optimal_dropoff().id
        }
    }
}