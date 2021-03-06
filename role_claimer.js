Creep.prototype.init_claimer = function(){
    if(this.memory.target_room === undefined){
        console.log(`${this.name} is missing a target claim`)
    }
    this.memory.target = null
}

Creep.prototype.cleanup_claimer = function(){

}

Creep.prototype.claimer_role = function(){
    if(this.room.name === this.memory.target_room){
        if(this.claimController(this.room.controller) === ERR_NOT_IN_RANGE){
            this.moveTo(this.room.controller)
        }
    } else {
        if(this.memory.target === undefined || this.memory.target === null || this.memory.target.roomName !== this.room.name){
            const find_exit = this.room.findExitTo(this.memory.target_room)
            this.memory.target = this.pos.findClosestByPath(this.room.find(find_exit))
        }
        this.moveTo(this.memory.target.x, this.memory.target.y)
    }
}