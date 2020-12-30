class Task extends Object {
    constructor(
        id=null,
        priority=null,
        type="generic",
        cid=null,
        targid=null
    ){
        if(id === null){
            this.id = Memory.tid
            Memory.tid += 1
        } else{
            this.id = id
        }

        this.priority = priority
        this.type = type
        this.cid = cid
        Memory.tasks[this.id] = this
        this.targid = targid
    }

    toJson(){
        return {
            id: this.id,
            priority: this.priority,
            type: this.type,
            cid: this.cid,
            targid: this.targid
        }
    }

    assign_task(cid){
        var creep = Game.getObjectById(cid)
        if(creep.memory.tid === null || creep.memory.tid === this.id){
            creep.memory.tid = this.id
            return this
        } else {
            return null
        }
    }

    close_task(){
        try {
            delete Memory.tasks[this.id]
        } catch (error) {
            console.log(`Task ${this.id}:${this.type} was not in task list`)
        }
    }
}

class PickupEnergy_Task extends Task {
    run(creep){
        return creep.pickup(Game.getObjectById(this.targid))
    }
}

class Harvest_Task extends Task {
    run(creep){
        return creep.harvest(Game.getObjectById(this.targid))
    }
}

class WithdrawEnergy_Task extends Task {
    run(creep){
        return creep.withdraw(Game.getObjectById(this.targid),RESOURCE_ENERGY)
    }
}

class Move_Task extends Task {
    //In the future could also serialize a path object into this
    constructor(
        id = null,
        priority= null,
        cid= null,
        target = null
    ){
        if(id === null){
            this.id = Memory.tid
            Memory.tid += 1
        } else{
            this.id = id
        }

        this.priority = priority
        this.type = "move"
        this.cid = cid
        Memory.tasks[this.id] = this
        this.target = target
    }

    toJson(){
        return {
            id: this.id,
            priority: this.priority,
            cid: this.cid,
            target: this.target
        }
    }

    run(creep){
        creep.moveTo(target.x, target.y)
    }
}