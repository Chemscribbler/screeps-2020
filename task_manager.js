var task_runner = function(){
    var tasks = find_tasks()
    tasks.sort((a,b) => a[priority] - b[priority])
    var assigned_tasks = distribute_tasks(tasks)
    run_tasks(assigned_tasks)    
}

var find_tasks = function(){
    //Loop through different sources of tasks and create them
    //Returns an arry of tasks, each one containing a key'd priority value, and ID

    for(const task in Memory.storeTasks){
        tasks.push(JSON.parse(Memory.storeTasks[task]))
    }

    var tasks = []
    for(const room in Game.rooms){
        for(const task in Game.rooms[room].find_tasks()){
            tasks.push(task)
        }
    }

    for(const creepName in Game.creeps){
        for(const task in Game.creeps[creepName].find_tasks()){
            tasks.push(task)
        }
    }
}

var distribute_tasks = function(tasks){
    //Loop through tasks in order, and try and assign them to creeps
    //return dictionary of tasks
    var assigned_tasks = []
    tasks.forEach(task => {
        if(task.creepId){
            assigned_tasks.push(task)
        } else {
            //Picking a doer
            task.pick_doer()
            if(task.creepId){
                assigned_tasks.push(task)
            }
        }
    });
}

var run_tasks = function(assigned_tasks){
    //run tasks- stores errors and generates reports
    for(const task in assigned_tasks.values()){
        const value = task.run(task.creepId)
    }
} 