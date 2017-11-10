#!/bin/bash -ex

# print date for easily storing test data
date

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
time count=1000 \
    filename="./data/city_of_new_york.csv" \
	node scripts/process_oa_csv.js > generated_data/nyc_oa.js
time count=1000 \
    filename="./data/des_moines.csv" \
	node scripts/process_oa_csv.js > generated_data/des_moines_oa.js

## run tests

# reverse
./bin/k6 run -q tests/reverse_mongolia.js
./bin/k6 run -q tests/reverse_nyc.js

# structured search
./bin/k6 run -q tests/structured_nyc.js
./bin/k6 run -q tests/structured_des_moines.js

# search
./bin/k6 run -q tests/search_nyc.js
./bin/k6 run -q tests/search_des_moines.js

# acceptance tests - a good general mix of all types of queries
./bin/k6 run -q tests/acceptance_tests.js
