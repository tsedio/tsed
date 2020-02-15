#!/usr/bin/env python

import matplotlib.pyplot as plt
import json

statsFile = open('.tmp/stats.json', 'r')
stats = json.load(statsFile)
heapSizes = stats[1]
timestamps = stats[0]

print('Plotting %s' % ', '.join(map(str, heapSizes)))

plt.plot(timestamps, heapSizes)
plt.ylabel('Heap Size')
plt.xlabel('timestamp (ms)')
plt.show()
