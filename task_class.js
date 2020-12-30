class Task extends Object {
    constructor(
        id=null,
        priority=0,
        type="generic",
        cid=null
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
    }

    toJson(){
        return {
            id: this.id,
            priority: this.priority,
            type: this.type,
            cid: this.cid
        }
    }

    assign_task(){}

    close_task(){
        try {
            delete Memory.tasks[this.id]
        } catch (error) {
            console.log(`Task ${this.id}:${this.type} was not in task list`)
        }
    }
}

class PickupEnergy_T extends Task {
    assign_task(){
        Game.getObjectById()
    }
}