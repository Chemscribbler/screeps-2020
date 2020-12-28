const creep_lookup = {
    'harvester':8,
    'carrier':6,
    'builder':4,
    'upgrader':2,
    'rcl1':8
}

Spawn.prototype.request_creep = function(req_string){
    if(this.spawning){
        console.log("Blocked request")
        return -11
    }

    const req_value = creep_lookup[req_string]
    if(this.memory.orders === undefined){
        this.memory.orders = {}
    }
    if(this.memory.orders[req_value] === undefined){
           this.memory.orders[req_value] = req_string
           return 0
    } else{
        return -11
    }

}

Spawn.prototype.choose_next_creep = function(){
    let priority= 0, role=null;
    for(const [key, value] of Object.entries(this.memory.orders)){
        if(key > priority){
            priority = key
            role = value
        }
    }
    return role
}

Spawn.prototype.remove_highest_request = function(){
    const highest_priority_key = Math.max(Object.keys(this.memory.orders))
    delete this.memory.orders[highest_priority_key]
}

Spawn.prototype.print_creep = function(custom_memory){
    if(custom_memory === null){
        custom_memory = {'role': creep_role, 'init':false, 'target': null}
    }
    const creep_role = this.choose_next_creep()
    if(creep_role === null){
        return;
    }
    var creep_template = []
    if(this.room.controller.level === 1){
        creep_template = [WORK,MOVE,MOVE,CARRY,CARRY]
    } else {
        creep_template = this.gen_creep_body(creep_role)
    }
    if(this.spawnCreep(creep_template,creep_role+Game.time%3000,{dryRun: true}) === 0){
        var pre_order = Object.keys(this.memory.orders).length
        for(const key in this.memory.orders){
            if (this.memory.orders[key] === creep_role){
                delete this.memory.orders[key]
            }
        }
        var post_order = Object.keys(this.memory.orders).length
        console.log(`Filling order for ${creep_role}. There were ${pre_order} orders. There are now ${post_order}.`)
        this.spawnCreep(creep_template,
            creep_role+Game.time%3000,
            {memory: custom_memory}
            )
        var pre_order = Object.keys(this.memory.orders).length
    } 
}

Spawn.prototype.gen_creep_body = function(creep_role){
    var energy_budget = this.store.getCapacity(RESOURCE_ENERGY) + this.room.find(FIND_STRUCTURES,{filter: s => s.structureType === STRUCTURE_EXTENSION}).length*50
    // //Each creep has a body plan that is a repitition of some number of body parts
    // //Each one has a cost- and then the plan is repeated to build largest under capacity
    const body_plans = {
        'harvester': {'part_ratios':{'work':2,'move':1},'ratio_cost':250,'special_rules':true},
        'carrier': {'part_ratios':{'carry':2,'move':1},'ratio_cost':150,'special_rules':true},
        'builder': {'part_ratios':{'work':1,'carry':3,'move':1},'ratio_cost':300,'special_rules':false},
        'upgrader': {'part_ratios':{'work':2,'carry':1,'move':1},'ratio_cost':300,'special_rules':false},
        'rcl1': {'part_ratios':{'work':1,'carry':1,'move':1},'ratio_cost':200,'special_rules':true}
    }
    if(body_plans[creep_role]['special_rules']){
        switch(creep_role){
            case 'harvester':
                return Spawn.prototype.gen_harvester_body(energy_budget)
            case 'rcl1':
                return [WORK,CARRY, CARRY,MOVE, MOVE]
            case 'carrier':
                energy_budget = Math.min(energy_budget, BODYPART_COST['move']*5+BODYPART_COST['carry']*10)
                const sections = Math.floor(energy_budget/body_plans[creep_role]['ratio_cost'])
                var body_template = []
                for(let part in body_plans[creep_role]['part_ratios']){
                    for (let index = 0; index < body_plans[creep_role]['part_ratios'][part]*sections; index++) {
                        body_template.push(part)                
                        
                    }
                    
                }
                return body_template
        }
    } else {
        const sections = Math.floor(energy_budget/body_plans[creep_role]['ratio_cost'])
        var body_template = []
        for(let part in body_plans[creep_role]['part_ratios']){
            for (let index = 0; index < body_plans[creep_role]['part_ratios'][part]*sections; index++) {
                body_template.push(part)                
            }
        }
        // console.log(body_template)
        return body_template
    }
}

Spawn.prototype.gen_harvester_body = function(energy_budget){
    var body_template = []
    if(energy_budget >= 750){
        body_template = [WORK,WORK,WORK,WORK,WORK,WORK, MOVE, MOVE, MOVE]
    }
    else if(energy_budget >= 700){
        body_template = [WORK,WORK,WORK,WORK,WORK,WORK, MOVE, MOVE]
    }
    else if(energy_budget >= 650){
        body_template = [WORK,WORK,WORK,WORK,WORK,WORK, MOVE]
    } else if (energy_budget >= 550){
        body_template = [WORK,WORK,WORK,WORK,WORK,MOVE]
    } else{
        const num_works =  Math.floor((energy_budget-50)/100)
        for (let index = 0; index < num_works; index++) {
            body_template.push(WORK)            
        }
        body_template.push(MOVE)
    }
    return body_template
}

Spawn.prototype.print_claimer = function(target_room){
    return this.spawnCreep(
        [CLAIM,MOVE],
        `Claimer${Game.time % 1000}`,
        {memory:{
            "role":'claimer',
            "init":false,
            "target_room":target_room
        }})
}

Spawn.prototype.print_scout = function(target_room){
    return this.spawnCreep(
        [TOUGH,MOVE],
        `scout${Game.time % 1000}`,
        {memory:{
            "role":'scout',
            "init":false,
            "target_room":target_room
        }})
}