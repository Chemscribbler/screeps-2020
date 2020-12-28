# Current Design plan 12/27
## All* creep roles should have a unified flow pattern and ideally similar memories so that roles at interconvertable

*Dedicated harvesters will not follow this pattern for reasons- mostly that it's overly expensive

Creep.run flow
1. Check if current task is valid
2. Get next task if invalid
3. execute task


### Task checking
Return the true/false. Should be lightweight
Check if target is null -> False

If creep has carry
Check if creep is picking up energy - store in memory
1. Are you full? -> False
2. If ticksToLive % 20 === 5: does creep.find_energy != target -> False
3. else return True
Check if is using energy
1. Are you empty? -> False
2. If ticksToLive % 20 ==5: valid_target(creep.mem.role)
3. else return True

If creep has work
If it doesn't have carry-
1. Check no other creep in range 1 of target
2. Check if standing on storage
If it does have carry valid target should use it already

valid_target:
- Upgrader- is controller
- Builder- is Construction site or hits/hitsMax < .5
- Carrier- is structure.store.freeCapacity > 0
- RCL1- is structure.store.freeCapacity > 0
- Harvester

If creep has attack
???
If creep has claim
???
If creep has heal
???

### Target finding
- If picking up, use creep.find_energy()
- Else use creep.find_role_target('role')
Return for these is Object type, Object ID, and Object (Object type & ID are stored in memory)

### Execute task
Role specific?
One option would be that a manager assigns roles based on creep's capabilities
    Harvesters and Carriers by having only WORK/CARRY respectively get priority for task
    Upgrading, building, reparing, and Rampart construction as WORK/CARRY tasks
    Claim becomes a task
    Attack/Ranged Attack gives defender/attack task

## Task Manager Redesign
1. Gather all tasks requried each tick (Keep tasks in memory)
- Harvest every source
- Transfer energy to Extensions/Spawn
- Transfer energy to Tower
- Transfer energy to storage
- Build sites in priority
- Repair sties in priority
- Upgrade controller
- Create build sites
- Spawn creeps
- Defend
- Attack

### Task should probably be a class
Every task is composed with:
```
{
    TaskId: number
    TaskRequires: [WORK/CARRY/MOVE/CLAIM]-List of parts
    Priority: number
    TaskLoc: {x: pos(x), y: pos(y)}
    AssignedCreep: CreepID/none
}
```
2. Prioritize creeps by being most suited to task
- All work/move no carry - harvester
- All carry/move no work - carrier/hauler
- Work > Carry - Upgrader
- Carry > Work - Builder/Repairer
3. Give creeps tasks based on TaskLoc & capabilities (prefer closer)
4. If a creep has an exisiting task- require a certain priority gap to switch tasks (catagorize by 100s, increment tasks based 
on some heuristic)

