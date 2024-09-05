+++
title = 'Leetcode Dailies 4-5'
date = 2024-09-05T10:33:57-07:00
draft = false
+++

874. Walking Robot Simulation
```python
def robotSim(self, commands: List[int], obstacles: List[List[int]]) -> int:
    # for O(1) lookup in obstacles
    obstacles = set(map(tuple, obstacles))
    direction = 0   # O123 is NESW
    move = [(0,1), (1,0), (0,-1), (-1,0)]
    max_distance = 0

    curr = [0,0]
    for command in commands:
        if command > 0: # move in direction
            while command > 0 and (curr[0]+move[direction][0], curr[1]+move[direction][1]) not in obstacles:
                curr[0] += move[direction][0]
                curr[1] += move[direction][1]
                command -= 1
        elif command == -1: # right
            direction = (direction + 1) % 4
        elif command == -2: # left
            direction = (direction + 3) % 4
        max_distance = max(max_distance, curr[0]*curr[0] + curr[1]*curr[1])

    return max_distance
```
Was getting TLE the first time since I used obstacles as is for lookups, pretty straightforward otherwise.

---

2028. Find Missing Observations
```python
def missingRolls(self, rolls: List[int], mean: int, n: int) -> List[int]:
    missing = mean * (n + len(rolls)) - sum(rolls)
    val, rem = divmod(missing, n)
    if not (1 <= val <= 6) or (val == 6 and rem != 0):
        return []
    return [val + (i < rem) for i in range(n)]
```
Took a greedy approach initially by initializing result as a list of ones, checking validity, then making each value as large as possible before moving to the next one. This divmod approach is cool with the list comprehension and boolean addition!!!