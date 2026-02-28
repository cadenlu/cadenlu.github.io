+++
title = 'Leetcode Dailies 1-3'
date = 2024-09-03T09:50:43-07:00
draft = false
+++

2022. Convert 1D Array Into 2D Array
```python
def construct2DArray(self, original: List[int], m: int, n: int) -> List[List[int]]:
    return [original[i:i+n] for i in range(0, m*n, n)] if len(original) == m*n else []
```
List comprehensions and ternary operators are fun.

---

1894. Find the Student that Will Replace the Chalk
```python
def chalkReplacer(self, chalk: List[int], k: int) -> int:
        k = k % sum(chalk)
        for i in range(len(chalk)):
            if k < chalk[i]:
                return i
            k -= chalk[i]
```
I thought this was an "easy" problem when I read this no way it should be a "medium". 
Other than finding the trick with modulo to prevent TLE it is pretty simple solution.

---

1945. Sum of Digits of String After Convert
```python
def getLucky(self, s: str, k: int) -> int:
        # convert to int
        s = int("".join([str(ord(ch) - ord('a') + 1) for ch in s]))

        # perform transformation
        for i in range(k):
            s = sum(int(digit) for digit in str(s))
        
        return s
```
I forgot how to use ord() when I initially did this question and manually found ord() of 'a' using an ascii table. 
Lots of string and int conversions so not very clean solution but it works.

