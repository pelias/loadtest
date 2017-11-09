#!/bin/bash -ex

## generate data needed for tests
# reverse query centered in a populated area (NYC)
min_lat=40.56441616034876 \
max_lat=40.838229652227874 \
min_lon=-74.12887573242188 \
max_lon=-73.77113342285156 \
count=1000 \
node scripts/generateReverseQueries.js > generated_data/reverse_nyc.js

# reverse query centered in a non-populated area (Mongolia)
min_lat=46.867 \
max_lat=47.169 \
min_lon=107.12 \
max_lon=107.55 \
count=1000 \
node scripts/generateReverseQueries.js > generated_data/reverse_mongolia.js


# Parsed CSV data for NYC
count=1000 \
	node scripts/process_oa_csv.js > generated_data/nyc_oa.js

## RUN tests

./k6.bin run tests/reverse_mongolia.js
./k6.bin run tests/reverse_nyc.js

./k6.bin run tests/structured_nyc.js
./k6.bin run tests/search_nyc.js
