# East_Harlem_housing_analysis
repository for data visualization final group project Spring 2018

# Process Log for initial data analysis

## Finding Emerald Equity Addresses
 >Got the addresses that are linked to Emerald Equity; This was through finding the deed in Acris. The methodology for this was explained in detail in the initial pitch. It includes searching for news articles that mention real estate deals, and corroborating those reported addresses one by one in Acris, linking the addresses to names known to be associated with Emerald Equity, after having done a corporate entity profile using OpenCorporates and other sources.

## Attaining BBLs: it's what NYC data uses
 >Wrote a python script that queries the NYC Developers API to get BBL's, so that those addresses can be used with the Postgres database NYCDB. The script is included, and thoroughly commented. It can be run from the command line with:

```bash
python BBL_lookup_py.py ManhattanEE.csv ManhattanEEBBL.csv
```

It is written in Python 3.

## Loading data into PSQL

### Make a database where it will all live together

Created a Postgres Database named housing_data_analysis.

```sql
CREATE DATABASE housing_data_analysis;
```

### SQL Table named emerald_equity_bbl, with columns and datatypes matching my csv exactly.

```sql
CREATE TABLE emerald_equity_bbl (
street_number VARCHAR(10),
street_address VARCHAR(20),
bbl CHARACTER(10));
```

I was careful to add bbl as a CHARACTER(10), because BBLs should ALWAYS be exactly 10 digits long; also, the datatype for the column in NYCDB is a CHARACTER(10), so this works. I want to keep it consistent for later analysis.

### Loaded my CSV

```sql
COPY emerald_equity_bbl FROM '/Users/GeorgiaKromrei/Desktop/ManhatanEEBBL.txt' WITH (FORMAT csv);
```

### Loaded NYC-DB

First, I downloaded the compressed file from:

[https://s3.amazonaws.com/nyc-db/nyc-db-2018-03-11.sql.bz2]

and then unzipped it, adding it to my PSQL database like so (your filepath should reflect your local machine's file structure).

```sql
\i '/Users/GeorgiaKromrei/Downloads/NYCDB/nyc-db-2018-03-11.sql'
```

These two steps take a very, very long time. They require approximately 15gb of free space.

Depending on your permissions, it may be necessary to run:

```sql
GRANT ALL ON SCHEMA public TO public;
```

## Choosing which tables to focus on

They include:

* dob_complaints
	complaintCategory - 65, 71, 73, 83, 90, 3A, 5G, 
	houseStreet
* dobjobs
	ownerfirstname
	ownertype
	ownerbusinessname
	ownersphone
	bbl
* dof_sales
	yearbuilt
	saledate
	saleprice
	taxclassattimeofsale
	residentialunits
	bbl
	address
* emerald_equity_bbl
	street no.
	street name
	bbl
* hpd_complaints
	bbl
	housenumber
	streetname
	statusdate
	status
* hpd_violations
	currentstatusid
	novdescription
	class
	violationstatus
	bbl

## Querying the data

The SQL queries we used to pull data out of nyc-db are found in queries.sql.

## Cleaning and filtering the data

This was done in Jupyter Notebook using Pandas, and Matplotlib for the exploratory data analysis.

## Comprehensive list of tech used:

Data Source: https://github.com/aepyornis/nyc-db

Data analysis and cleaning: SQL, Python (Pandas), Matplotlib, Jupyter Notebook, CURL, nyc-db, Regex
Design: Rhino, Grasshopper, Adobe Illustrator
Data visualization: d3.js, css, html, bootstrap, scroller.js