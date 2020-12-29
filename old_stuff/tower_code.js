StructureTower.prototype.closest_hostile_creep = function(){
    var enemy_creeps = this.pos.findInRange(FIND_CREEPS,10,{filter: c => c.my === false})
    if(enemy_creeps.length === 0){
        return null
    } else {
        var close_enemies = this.pos.findInRange(FIND_CREEPS,5,{filter: c => c.my === false})
        var most_damaged = 1.1
        var target = null
        if(close_enemies.length > 0){
            close_enemies.forEach(e_creep =>{
                if(e_creep.hits/e_creep.hitsMax < most_damaged){
                    target = e_creep
                    most_damaged =e_creep.hits/e_creep.hitsMax
                }
            })
            return target
        } else{
            enemy_creeps.forEach(e_creep =>{
                if(e_creep.hits/e_creep.hitsMax < most_damaged){
                    target = e_creep
                    most_damaged =e_creep.hits/e_creep.hitsMax
                }
            })
            return target
        }
    }
}

StructureTower.prototype.find_repair_target = function(){
    return this.pos.findClosestByRange(FIND_STRUCTURES,{filter:
        s => s.hits/s.hitsMax < .5 && s.structureType !== STRUCTURE_RAMPART
    })
}

StructureTower.prototype.run = function(){
    const hostile = this.closest_hostile_creep()
    if(hostile === null){
        const rep = this.find_repair_target()
        if(rep !== null){
            this.repair(rep)
        }
    } else{
        this.attack(hostile)
    }
    
}