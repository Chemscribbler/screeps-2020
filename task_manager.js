var manage_harvesting = function(room){
    /*
    Manages harvesters in all rooms
      Requisitions new harvesters
      Estimates energy production
      Gives paths to harvesters
    */
        if(room.memory.num_sources === undefined){
            room.memory.num_sources = room.find(FIND_SOURCES).length
        }
        var active_harvester_work = 0
        if(room.memory.harvester_creeps === undefined){
            room.memory.harvester_creeps = {}
        }
        if(room.spawn !== null){
            if(Object.keys(room.memory.harvester_creeps).length <room.memory.num_sources){
                if(room.source_storage.length === room.memory.num_sources){
                    room.spawn.request_creep('harvester')
                } else{
                 room.spawn.request_creep('rcl1')
                }
            }
        }
    
        for(const cID in room.memory.harvester_creeps){
            try{
                for(const i in Game.getObjectById(cID).body){
                    if(Game.getObjectById(cID).type === WORK){
                        active_harvester_work += 1
                    }
                }
            }
            catch(TypeError){
                console.log(`Removing ${cID} from harvester memory`)
                delete room.memory.harvester_creeps[cID]
            }
        }
    
        return active_harvester_work*2*ENERGY_REGEN_TIME
        //This returns energy harvested per/regen cycle in ideal circumstances
    }
    
    var manage_upgrading = function(room,energy_per_cycle){
        /*
        Manages Upgraders
        Requisitions upgraders
        Estimates energy consumption
        */
        if(room.memory.upgrader_creeps === undefined){
           room.memory.upgrader_creeps = {}
        }
        var work_count = 0
        if(energy_per_cycle >= 0){
            if(room.spawn !== null){
            if(Object.keys(room.memory.upgrader_creeps).length === 0 || (room.free_energy > 40000 && Object.keys(room.memory.upgrader_creeps).length < 2)){
                room.spawn.request_creep('upgrader')
            } else {
                for(creep in room.memory.upgrader_creeps){           
                    for(part in Game.getObjectById(creep)){
                        if(part === WORK){
                            work_count++
                        }
                    }
                }
            }}
            // console.log(Math.max(0,energy_per_cycle-(work_count*ENERGY_REGEN_TIME)))
            energy_per_cycle = Math.max(0,energy_per_cycle-(work_count*ENERGY_REGEN_TIME))
        }
        return energy_per_cycle
    }
    
    var manage_buildings = function(room,energy_per_cycle){
    /* Manages Buildings
      Requisitions builders for tasks
      Orders build tasks by priority
      Estimates energy consumption
    */
        const construction_priority = {
            "extension": 10,
            "storage": 8,
            "container": 8,
            "tower": 6,
            "road": 2
        }
        if(room.memory.active_sites === undefined){
            room.memory.active_sites = {}
        }
        if(room.memory.builder_creeps === undefined){
            room.memory.builder_creeps = {}
        }
        var total_cost = 0
        if(Game.time % 50 === 0){
            var search = room.find(FIND_MY_CONSTRUCTION_SITES)
            if(search.length > 0){
                for(const siteNum in search){
                    const site = search[siteNum]
                    if(room.memory.active_sites[site.id]===undefined){
                        room.memory.active_sites[site.id] = {
                            "EnergyNeeded":site.progressTotal,
                            'active_workers':null,
                            'priority': construction_priority[site.structureType]}
                        total_cost += site.progressTotal
                    }
                }
            }
        }
    
        for(const site in room.memory.active_sites){
            actual_site = Game.getObjectById(site)
            if(actual_site === null){
                delete room.memory.active_sites[site]            
            } else{
                room.memory.active_sites[site]["EnergyNeeded"] = actual_site.progressTotal - actual_site.progress
                room.memory.active_sites[site]['priority'] = construction_priority[actual_site.structureType] + actual_site.progress/actual_site.progressTotal
                total_cost += actual_site.progressTotal - actual_site.progress 
            }       
        }
        var work_capacity = 0
        for (const creepId in room.memory.builder_creeps) {
            for (const part in Game.getObjectById(creepId)) {
                if(part === 'WORK'){
                    work_capacity += 5*ENERGY_REGEN_TIME
                }
            }
        }
        // if((work_capacity*5 < total_cost || (total_cost > 0 && Object.keys(room.memory.builder_creeps).length === 0))&& room.controller.level > 1){
        //     room.spawn.request_creep('builder')
        // }
    
        if(room.spawn !== null &&
        Object.keys(room.memory.active_sites).length > Object.keys(room.memory.builder_creeps).length && 
        Object.keys(room.memory.builder_creeps).length<3){
            room.spawn.request_creep('builder')
        }
        if(work_capacity > total_cost){
            return energy_per_cycle - total_cost
        } else{
            return energy_per_cycle - work_capacity
        }
    }
    
    var manage_defense = function(room,energy_per_cycle){
    /* Manages defender Creeps and towers
        Requisitions defenders
        Targets enemies
    */}
    
    var manage_carriers = function(room){
        if(room.memory.source_storage > 0){
            if(room.memory.carrier_creeps === undefined){
                room.memory.carrier_creeps = {}
            }
            if(Object.keys(room.memory.carrier_creeps).length < 2){
                room.spawn.request_creep('carrier')        
            }
        }
    }
    
    var manage_repairs = function(room){
       if(Game.time % 100 === 0){
           room.memory.repair_sites = {}
           console.log("Scanning for repairs")
           var search = room.find(FIND_STRUCTURES,{filter: s => (s.hits/s.hitsMax < .4 && s.structureType !== STRUCTURE_RAMPART)})
           search.forEach(site =>{
            //   console.log(site)
               room.memory.repair_sites[site.id] = site.hits/site.hitsMax
           })
       }
       if(Object.keys(room.memory.repair_sites).length > 0 && Object.keys(room.memory.builder_creeps).length === 0){
           room.spawn.request_creep("builder")
       }
    }
    
    var energy_report = function(room, energy_avaible, harvesting_rate){
        var def_or_sur = null
        if(energy_avaible > 0){
            def_or_sur = "surpluss"
        } else{
            def_or_sur = 'deficit'
        }
        console.log(`Room ${room.name}: has an energy ${def_or_sur} of ${energy_avaible} per cycle. Harvesting ${harvesting_rate}`)    
    }
    
    var task_manager = function(){
        /*
        Manages all of different sub-managers
        room_dict: enumerated dictionary of room objects
        spawn_dict: enumerated dictionary of spawn object (proxy for Game.)
        */
        for(const r in Game.rooms){
            const room = Game.rooms[r]
            var energy_available = manage_harvesting(room)
            var harvesting_rate = energy_available
            energy_available = manage_buildings(room,energy_available)
            energy_available = manage_upgrading(room,energy_available)
            manage_carriers(room)
            manage_repairs(room)
            // energy_report(room,energy_available,harvesting_rate)
        }
    
    }
    
    module.exports = task_manager;