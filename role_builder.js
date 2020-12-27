Creep.prototype.init_builder = function(){
    this.room.memory.builder_creeps[this.id] = this.name
    this.memory.siteID = null
    this.memory.target = null
    this.memory.repair = false
}

Creep.prototype.cleanup_builder = function(){
    delete this.room.memory.builder_creeps[this.id]
}

Creep.prototype.builder_role = function(){
    if(this.memory.repair === undefined){
        this.memory.repair = false
    }

    this.try_build = function(){
        if(Game.getObjectById(this.memory.siteID) === null){
            this.memory.siteID = this.get_next_site()
            this.memory.target = this.memory.siteID 
        }
        const tgt = Game.getObjectById(this.memory.target)
        var output = this.build(tgt)
        switch (output) {
            case ERR_NOT_IN_RANGE:
                this.moveTo(tgt,{reusePath:20})
                break;
            case ERR_INVALID_TARGET:
                this.memory.siteID = null
                this.memory.target = null
                break;
            case ERR_NOT_ENOUGH_RESOURCES:
                this.memory.target = null
                break
            case OK:
                break
            default:
                console.log(`${this.name} had ${output}`);
        }
    }
    
    this.try_repair = function(){
        if(Game.getObjectById(this.memory.siteID) === null){
            this.memory.siteID = this.get_next_site()
            this.memory.target = this.memory.siteID 
        }
        const tgt = Game.getObjectById(this.memory.target)
        var output = this.repair(tgt)
        switch (output) {
            case ERR_NOT_IN_RANGE:
                this.moveTo(tgt,{reusePath:20})
                break;
            case ERR_INVALID_TARGET:
                this.memory.siteID = null
                this.memory.target = null
                break;
            case ERR_NOT_ENOUGH_RESOURCES:
                this.memory.target = null
                break
            case OK:
                break
            default:
                console.log(`${this.name} had ${output}`);
        }
    }

    this.get_next_site= function(){
        if(this.room.memory.repair_sites === undefined){
            this.room.memory.repair_sites = {}
        }
        var max_prio = 0
        if(Object.keys(this.room.memory.repair_sites).length > 0){
            var lowest_site = 1
            for(const key in this.room.memory.repair_sites)
                if(this.room.memory.repair_sites[key] < lowest_site){
                    lowest_site = this.room.memory.repair_sites[key]
                    this.memory.siteID = key
                    this.memory.repair = true
                }
            }
        for(const key in this.room.memory.active_sites){
            // console.log(key)
            if(this.room.memory.active_sites[key]['priority'] > max_prio){
                max_prio = this.room.memory.active_sites[key]['priority']
                this.memory.siteID = key
                this.memory.repair = false
            }
        }
    }

    if(this.memory.siteID === null){
        this.get_next_site()
        if (this.memory.siteID=== null){
            this.suicide()
        }
    }

    if(this.store.getFreeCapacity(RESOURCE_ENERGY) === 0 && this.memory.target !== this.memory.siteID){
            this.memory.target = this.memory.siteID
            this.move(RIGHT)
    }
    if(this.store.getUsedCapacity(RESOURCE_ENERGY) === 0 && this.memory.target === null){
        this.memory.target = this.find_energy().id
    }
    if(this.memory.siteID === this.memory.target && this.store.getUsedCapacity(RESOURCE_ENERGY)>0){
        if(this.memory.repair){
            this.try_repair()
        } else{
            this.try_build()
        }
    } else {
        if(this.memory.target === null || this.memory.target === this.memory.siteID){
            this.memory.target = this.find_energy().id
        }
        const tgt = Game.getObjectById(this.memory.target)
        if(tgt.energyCapacity !== undefined){
            if(this.harvest(tgt) === ERR_NOT_IN_RANGE){
                    this.moveTo(tgt,{reusePath: 20})
                    }
        } else {
            if(this.withdraw(tgt,RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                this.moveTo(tgt)
            }
        }
    }

    //Logic is 4 casscading ifs
    //If full and siteID != null, move and build (also make sure target == siteID)
    //If have energy and target == siteID move and build
    //if have energy- check is mining from source: if so continue, otherwise go build
    //else you have no energy- so set target to this.find_energy()
    // var tgt = Game.getObjectById(this.memory.target)
    // // this.say(this.store.getFreeCapacity(RESOURCE_ENERGY))
    // if(this.store.getFreeCapacity(RESOURCE_ENERGY) === 0 && this.memory.siteID !== null){
    //     if(this.memory.siteID !== this.memory.target){
    //         this.memory.target = this.memory.siteID
    //         tgt = Game.getObjectById(this.memory.target)
    //     }
    //     this.try_build(tgt)
    // } else if(this.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && this.memory.siteID === this.memory.target){
    //     this.try_build(tgt)
    // } else if(this.store.getFreeCapacity(RESOURCE_ENERGY) > 0){
    //     if(tgt.energy !== undefined){
    //         if(this.harvest(tgt) === ERR_NOT_IN_RANGE){
    //             this.moveTo(tgt,{reusePath: 20})
    //         }
    //     } else{
    //         this.memory.target = null
    //     }
    // }
}