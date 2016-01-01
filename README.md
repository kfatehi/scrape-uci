# Scrape UCI

A course catalog scraper for UCI

## Usage

The tool can scrape from two different sources. Each one may have a different output schema depending on what's available.

### WebSOC

WebSOC shows the schedule of classes, it does not show future/planned courses beyond the upcoming quarter, but has the richest and most reliable data accross all majors and is great for gathering pre-requisites data.

Example URL: https://www.reg.uci.edu/perl/WebSoc

Scrape all courses across all departments:

`node index --source websoc --year 2016 --period winter > courses.json`

Scrape the courses of a single department:

`node index --source websoc --year 2016 --period winter --dept in4matx > courses.json`

In either case, the output on STDOUT is valid JSON of courses

### ICS Course Listing

This page shows a tentative list of planned ICS courses for 3 quarters of the year, even if in the future. This is useful for planning ahead.

Example URL: http://www.ics.uci.edu/ugrad/courses/listing.php?year=2015&level=Undergraduate&department=INF&program=ALL

Scrape all Spring 2016 Informatics courses

`node index --source ics --year 2016 --dept INF --period spring > courses.json`
