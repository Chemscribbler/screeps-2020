Creep.prototype.init_sapper = function(){
    this.memory.target = null
    this.memory.target_room = null
    this.last_room_tick = this.room.name
}

Creep.prototype.cleanup_sapper = function(){
    
}

Creep.prototype.sapper_role = function(){
    var target = Game.getObjectById(this.memory.target)
    if (!this.valid_target){
        if(Game.time < this.memory.next_check){
            return "Sleeping"
        }
        target = this.find_target()
        this.memory.target = target
    } else{
        if(Game.time % 30 !== 0){
            target = Game.getObjectById(this.memory.target)
        }      
    }
    var result = this.dismantle(target)
    switch(result){
        case ERR_NOT_IN_RANGE:
            this.moveTo(target)
            break;
        case ERR_INVALID_TARGET:
            this.moveTo(target)
            this.memory.next_check = Game.time + 20
        default:
            break;
    }

    Creep.prototype.find_target = function(){
        if(this.room.name !== this.memory.target_room){
            const exit_const = this.room.findExitTo(this.memory.target_room)
            return this.pos.findClosestByRange(this.room.find(exit_const))
        } else {
            var targets = this.pos.findInRange(
                FIND_STRUCTURES,3,{filter: s => s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART})
            if(!targets.length){
                target = new RoomPosition(25, 25, this.room)
            }
            var min_height = Math.pow(10,9)
            targets.forEach(wall =>{
                if(wall.hits < min_height){
                    target = wall
                    min_height = wall.hits
                }
            })
            this.memory.target = target.id

        }
    }

    Object.defineProperty(Creep.prototype, "valid_target", {
        get: function(){
            if(target === null){
                return false
            //Target could be RoomPosition or Wall/Rampart
            //Logic is if this is a position- check to see if target.room is a property
            } else if(target.roomName !== undefined) {
                if(this.room.name === target.roomName){
                    return true
                } else{
                    return false
                }
            } else if(target.room.name === this.room.name){
                return true
            } else{
                console.log(`Check creep ${this.name} unexpect case, target does not have room.name or roomName`)
                return false
            }
        }
    })
}