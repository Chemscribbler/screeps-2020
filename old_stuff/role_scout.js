Creep.prototype.init_scout = function(){
    if(this.memory.target_room === undefined){
        console.log(`${this.name} is missing a target claim`)
    }
    this.memory.target = null
}

Creep.prototype.cleanup_scout = function(){

}

Creep.prototype.scout_role = function(){
    if(this.room.name === this.memory.target_room){
        this.moveTo(RoomPosition(25,25,this.target_room))
    } else {
        if(this.memory.target === undefined || this.memory.target === null || this.memory.target.roomName !== this.room.name){
            const find_exit = this.room.findExitTo(this.memory.target_room)
            this.memory.target = this.pos.findClosestByPath(this.room.find(find_exit))
        }
        this.moveTo(this.memory.target.x, this.memory.target.y)
    }
}