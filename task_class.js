class Task extends Object {
    constructor(task_number,priority=0){
        id = task_number
        priority = priority
        requires = []
        name = "generic"
        if(Memory.tasks === undefined){
            Memory.tasks = {}
        }
    }

    assign_task(){}

    close_task(){
        try {
            delete Memory.tasks[this.id]
        } catch (error) {
            console.log(`Task ${this.id}:${this.name} was not in task list`)
        }
    }
}

class PickupEnergy_T extends Task {
    constructor(task_number, drp_nrg_id){
        id = task_number
        priority = 700
        requires = [CARRY]
        drp_nrg_id = drp_nrg_id
        creep = this.assign_creep()
        name = 'pickup'
    }

    assign_task(){
        Game.getObjectById()
    }
}