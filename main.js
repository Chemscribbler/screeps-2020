const profiler = require('screeps-profiler');
const tm = require(task_manager)
require(task_class)

profiler.enable();
if(Memory.tasks === undefined){
    Memory.tasks = {}
}

module.exports.loop = function (){
    
}
