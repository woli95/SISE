import glob
import os

stats = glob.glob('./413ukladow/*dfs*stats.txt')
sol = glob.glob('./413ukladow/*dfs*sol.txt')

for file in stats:
    os.remove(file)
for file in sol:
    os.remove(file)