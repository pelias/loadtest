#!/bin/bash -ex
date

# generate search queries from OA data for NYC and Des Moines, IA
time count=1000 \
     filename="./data/city_of_new_york.csv" \
	 node scripts/process_oa_csv.js > generated_data/nyc_oa.js
time count=1000 \
     filename="./data/des_moines.csv" \
     node scripts/process_oa_csv.js > generated_data/des_moines_oa.js
time count=10000 \
     filename="./data/australia.csv" \
     node scripts/process_oa_csv.js > generated_data/australia_oa.js

# set defaults for duration and concurrency, allow overriding
duration=${duration:-15s}
vus=${vus:-15}

# reverse
./bin/k6 run -u $vus -d $duration  tests/reverse_sydney.js
#./bin/k6 run -u $vus -d $duration  tests/reverse_coarse_nyc.js
#./bin/k6 run -u $vus -d $duration  tests/reverse_nyc.js
#./bin/k6 run -u $vus -d $duration  tests/reverse_mongolia.js
#./bin/k6 run -u $vus -d $duration  tests/reverse_portland.js
#./bin/k6 run -u $vus -d $duration  tests/reverse_world.js

# structured search
#./bin/k6 run -u $vus -d $duration  tests/structured_nyc.js
#./bin/k6 run -u $vus -d $duration  tests/structured_des_moines.js

## search
./bin/k6 run -u $vus -d $duration  tests/search_au.js
#./bin/k6 run -u $vus -d $duration  tests/search_nyc.js
#./bin/k6 run -u $vus -d $duration  tests/search_focus_nyc.js
#./bin/k6 run -u $vus -d $duration  tests/search_des_moines.js

## autocomplete
./bin/k6 run -u $vus -d $duration  tests/autocomplete_au.js
#./bin/k6 run -u $vus -d $duration  tests/autocomplete_nyc.js
#./bin/k6 run -u $vus -d $duration  tests/autocomplete_focus_nyc.js

## acceptance tests - a good general mix of all types of queries
#./bin/k6 run -u $vus -d $duration  tests/acceptance_tests.js

# place endpoing: statically request records by ID
#./bin/k6 run -u $vus -d $duration  tests/place.js

## Basic HTTP request that does no geocoding and should be extremely fast
#./bin/k6 run -u $vus -d $duration  tests/http_basic.js
