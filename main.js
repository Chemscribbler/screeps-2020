const profiler = require('screeps-profiler');
const task_manager = require('task_manager');
require('room_prototypes')
require('spawn_prototypes')
require('creep_prototypes')
require('role_harvester')
require('role_carrier')
require('role_rcl1')
require('role_upgrader')
require('role_builder')
require('tower_code')

profiler.enable();
module.exports.loop = function (){
    profiler.wrap(function(){
        if(Game.time % 10 === 0){
            task_manager()
        }
        if(Game.time % 10 === 1){
            for(const roomName in Game.rooms){
                const room = Game.rooms[roomName]
                room.spawn.print_creep()
                if(Game.time % 1000 === 1){
                    Game.rooms[roomName].memory.towers = Game.rooms[roomName].find(FIND_STRUCTURES,{filter: s => s.structureType === STRUCTURE_TOWER})
                }
            }
        }
        for(const creepName in Game.creeps){
            Game.creeps[creepName].run()
        }
    
        if(Game.time % 100 === 2){
            for(const cName in Memory.creeps){
                if(Game.creeps[cName] === undefined){
                    console.log(`Deleting ${cName} from memory`)
                    delete Memory.creeps[cName]
                    
                }
            }
        }
        
        for(const rName in Game.rooms){
            const t_search = Game.rooms[rName].find(FIND_MY_STRUCTURES,{filter: s => s.structureType === STRUCTURE_TOWER})
            if(t_search.length > 0){
                t_search.forEach(tower =>{
                    tower.run()
                })
            }
        }
    })
}
