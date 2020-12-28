Creep.prototype.init_dist_builder = function(){
    this.memory.origin_room = this.room.name
    if(this.memory.target_room === undefined){
        this.memory.target_room = null
    }
    this.memory.respawn_request = true
    this.memory.target_dest = null
    this.memory.siteID = null
}

Creep.prototype.cleanup_dist_builder = function(){
    if(this.memory.respawn_request){
        Game.rooms[this.memory.origin_room].spawns.request_creep("dist_builder")
    }
}

Creep.prototype.dist_builder_role = function(){
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

    this.get_next_site= function(){
        var max_prio = 0
        for(const key in this.room.memory.active_sites){
            if(this.room.memory.active_sites[key]['priority'] > max_prio){
                max_prio = this.room.memory.active_sites[key]['priority']
                this.memory.siteID = key
                this.memory.repair = false
            }
        }
    }

    //Validate current target
    //Target can be room position or object--- maybe separate these out
    // this.validate_current_goal()
    
    if(this.store.getUsedCapacity === 0){
        if(this.room.name === this.memory.origin_room){
            if(this.memory.target === null){
                this.memory.target = this.find_energy()
            }
            const target = Game.getObjectById(this.memory.target)
            if(this.withdraw(target,RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                this.moveTo(target)
            }
            if(this.store.getUsedCapacity > 0){
                this.memory.target = null
            }
        } else {
            if(this.memory.target_dest.roomName !== this.room.name){
                const find_exit = this.room.findExitTo(this.memory.origin_room)
                this.memory.target_dest = this.pos.findClosestByPath(this.room.find(find_exit))
            }
            this.moveTo(this.memory.target_dest.x, this.memory.target_dest.y)
        }
    } else {
        if(this.room.name === this.memory.target_room){
            if(this.memory.target === null){
                this.memory.target = this.get_next_site()
                if(this.memory.target === null){
                    console.log(`${this.name} can find no projects`)
                }
            }
            this.try_build()
        } else {
            if(this.memory.target_dest.roomName !== this.room.name){
                const find_exit = this.room.findExitTo(this.memory.target_room)
                this.memory.target_dest = this.pos.findClosestByPath(this.room.find(find_exit))
            }
            this.moveTo(this.memory.target_dest.x, this.memory.target_dest.y)
        }
    }
}