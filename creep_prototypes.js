if (!Creep.prototype._suicide){
    Creep.prototype._suicide = Creep.prototype.suicide
    
    Creep.prototype.suicide = function(){
        this.cleanup_role(force=true)
        
        console.log(`${this.name}, formerly a ${this.memory.role} has died`)
        return this._suicide()
    }
}


Creep.prototype.initialize = function(){
    if(!this.memory.init && !this.spawning){
        switch (this.memory.role) {
            case 'harvester':
                this.init_harvester()                                
                break;
            case 'upgrader':
                this.init_upgrader()
                break;
            case 'carrier':
                this.init_carrier()
                break;
            case 'builder':
                this.init_builder()
                break
            case 'rcl1':
                this.init_rcl1()
                break
            case 'sapper':
                this.init_sapper()
                break
            case 'claimer':
                this.init_claimer()
                break
            case 'scout':
                this.init_scout()
                break
            case 'dist_builder':
                this.init_builder()
                break
            default:
                break;
        }
        this.memory.init = true
    }
}

Creep.prototype.cleanup_role = function(force=false){
    if(force || this.ticksToLive < 5){
        switch (this.memory.role) {
            case 'harvester':
                    this.cleanup_harvester()                                
                    break;
                case 'upgrader':
                    this.cleanup_upgrader()
                    break;
                case 'carrier':
                    this.cleanup_carrier()
                    break;
                case 'builder':
                    this.cleanup_builder()
                    break
                case 'rcl1':
                    this.cleanup_rcl1()
                    break;
                case 'sapper':
                    this.cleanup_sapper()
                    break;
                case 'claimer':
                    this.cleanup_claimer()
                    break;
                case 'scout':
                    this.cleanup_scout()
                    break
                case 'dist_builder':
                    this.cleanup_dist_builder()
                    break
                default:
                    break;
        }
        this._suicide()
    }
}

Creep.prototype.perform_role = function(){
    switch (this.memory.role) {
        case 'harvester':
            this.harvester_role()            
            break;
        case 'carrier':
            this.carrier_role()
            break;
        case 'builder':
            this.builder_role()
            break;
        case 'upgrader':
            this.upgrader_role()
            break;
        case 'rcl1':
            this.rcl1_role()
            break;
        case 'sapper':
            this.sapper_role()
            break;
        case 'claimer':
            this.claimer_role()
            break;
        case 'scout':
            this.scout_role()
            break;
        case 'dist_builder':
            this.dist_builder()
            break;
        default:
            break;
    }
}


Creep.prototype.move_to_target= function(pathfinding=false){
    this.moveTo(Game.getObjectById(this.memory.target), {noPathFinding: pathfinding})
}

Creep.prototype.run = function(){
    this.initialize()
    this.perform_role()
    this.cleanup_role()
}

Creep.prototype._reset = function(){
    this.memory.init = false
    this.memory.target = null
    this.memory.assigned = false
    return OK
}

Creep.prototype.find_energy = function(){
    if(this.room.free_energy > 0){
        var value =  this.pos.findClosestByRange(
            this.room.energy_storage_sites.filter(s => s.store.getUsedCapacity(RESOURCE_ENERGY) >= this.store.getFreeCapacity(RESOURCE_ENERGY)))
        if(value === null){
            return this.room.free_source
        } else{
            return value
        }
    } else {
        return this.room.free_source
    }
}

Creep.prototype.check_pickup= function(target){
    if(target.structureType !== undefined){
        if(target.store.getUsedCapacity(RESOURCE_ENERGY) > 0){
            return target
        } else{
            return this.find_energy()
        }
    } else {
        if(this.ticksToLive % 20 === 4){
            return this.find_energy()
        } else {
            return target
        }
    }
}