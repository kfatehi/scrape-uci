# Scrape UCI

A course catalog scraper for UCI that pays special attention to pre-requisites.

## Usage

Scrape all courses across all departments:

`node index --year 2016 --period winter > courses.json`

Scrape the courses of a single department:

`node index --year 2016 --period winter --dept in4matx > courses.json`

In either case, the output on STDOUT is valid JSON of courses

## TODO

* parse prereq
