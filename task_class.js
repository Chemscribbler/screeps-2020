class Task {
    constructor(task_number,priority=0){
        id = task_number
        priority = priority
        requires = []
    }
}

class PickupEnergy_T extends Task {
    constructor(task_number, obId){
        id = task_number
        priority = 700
        requires = [CARRY]
        obId = obId
        creep = this.assign_creep()
    }
}