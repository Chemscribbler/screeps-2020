const { set, get, filter } = require("lodash")

Object.defineProperty(Room.prototype,'spawn',{
    get: function(){
        if(!this._spawn){
            if(!this.memory.spawnIds) {
                this.memory.spawnIds = this.find(FIND_MY_SPAWNS).map(spawn => spawn.id)
            }
            this._spawn = this.memory.spawnIds.map(id => Game.getObjectById(id))
        }
        return this._spawn[0]
    },
    set: function(newValue) {
        this.memory.sources = newValue.map(spawn => spawn.id)
        this._spawn = newValue
    },
    enumerable: false,
    configurable: true
})

Object.defineProperty(Room.prototype,"free_source",{
    get: function(){
        if(!this._free_source){
            var s_List = this.find(FIND_SOURCES)
            var least_crowded = 100
            for(const i in s_List){
                const nearby_creeps = s_List[i].pos.findInRange(FIND_MY_CREEPS,1)
                // console.log(nearby_creeps.length < least_crowded)
                if(nearby_creeps.length < least_crowded){
                    least_crowded = nearby_creeps.length
                    this._free_source = s_List[i]
                    // console.log(this._free_source)
                }
            }
        }
        return this._free_source
    }
})

Object.defineProperty(Room.prototype,'energy_storage_sites',{
    get: function(){
        if(!this._energy_storage_sites){
            this._energy_storage_sites = this.find(FIND_STRUCTURES,
                {filter: (s) => (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE)})
        }
        return this._energy_storage_sites
    }
})

Object.defineProperty(Room.prototype,'energy_dropoff_sites',{
    get: function(){
        if(!this._energy_dropoff_sites){
            this._energy_dropoff_sites = this.find(FIND_STRUCTURES,
                {filter: (s) => (s.store !== undefined && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
                }).filter(s => (s.pos.findInRange(FIND_SOURCES,1).length === 0))
        }
        return this._energy_dropoff_sites
    }
})

Object.defineProperty(Room.prototype,'free_energy',{
    get: function(){
        if(!this._free_energy){
            this._free_energy = 0
            var search = this.energy_storage_sites
            for (const hit in search) {
                this._free_energy += search[hit].store.getUsedCapacity(RESOURCE_ENERGY)
            }
        }
        return this._free_energy
    },
    set: function(energy_added){
        if(!this._free_energy){
            this.free_energy
        }
        this._free_energy = this.free_energy+energy_added
    }
})

Room.prototype._reset = function(){
    this.memory = {}
}

Room.prototype.target_reset = function(){
    for(cName in Game.creeps){
        c = Game.creeps[cName]
        if(c.memory.role !== 'harvester'){
            c.memory.target = null
        }
    }
}

Object.defineProperty(Room.prototype,'source_storage',{
    get: function(){
        if(!this._source_storage){
            if(!this.memory.source_storage_ids){
                try{
                    this.memory.source_storage_ids = this.energy_storate_sites.filter(
                        s => (s.pos.findInRange(FIND_SOURCES,1) > 0)).map(
                            container => container.id); 
                } catch(TypeError){
                    this.memory.source_storage_ids = []
                }
            }
            this._source_storage = this.memory.source_storage_ids.map(id => Game.getObjectById(id))
        }
        return this._source_storage
    }
})