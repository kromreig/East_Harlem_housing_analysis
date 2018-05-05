create table hpd_violations_east_harlem AS

select pluto_17v1.bbl, pluto_17v1.address as address, CONCAT(pluto_17v1.lat, pluto_17v1.lng) as lat_long, hpd_violations.violationid, hpd_violations.novissueddate as date, hpd_violations.novdescription as descript, pluto_17v1.unitsres as units, hpd_violations.class as class                                                           
FROM pluto_17v1,hpd_violations                                            

WHERE  (pluto_17v1.unitsres > 0 AND hpd_violations.class <> 'I' AND pluto_17v1.borocode = '1'
AND pluto_17v1.bbl = hpd_violations.bbl
AND pluto_17v1.zipcode = '10029') OR (pluto_17v1.unitsres > 0 AND hpd_violations.class <> 'I'
AND pluto_17v1.borocode = '1'
AND pluto_17v1.bbl = hpd_violations.bbl
AND pluto_17v1.zipcode = '10035')                                     
GROUP BY date, pluto_17v1.bbl, violationid, pluto_17v1.unitsres, address, lat_long, class, descript;

create table hpd_violations_ee AS

select pluto_17v1.bbl, pluto_17v1.address as address, CONCAT(pluto_17v1.lat, pluto_17v1.lng) as lat_long, hpd_violations.violationid, hpd_violations.novissueddate as date, hpd_violations.novdescription as descript, pluto_17v1.unitsres as units, hpd_violations.class as class                                                           
FROM pluto_17v1,hpd_violations                                            

JOIN emerald_equity_bin_bbl ON hpd_violations.bbl = emerald_equity_bin_bbl.bbl  
                                         
WHERE  (pluto_17v1.unitsres > 0 AND hpd_violations.class <> 'I' AND pluto_17v1.borocode = '1'
AND pluto_17v1.bbl = hpd_violations.bbl
AND pluto_17v1.zipcode = '10029') OR (pluto_17v1.unitsres > 0 AND hpd_violations.class <> 'I'
AND pluto_17v1.borocode = '1'
AND pluto_17v1.bbl = hpd_violations.bbl
AND pluto_17v1.zipcode = '10035')                                     
GROUP BY date, pluto_17v1.bbl, violationid, pluto_17v1.unitsres, address, lat_long, class, descript;


CREATE TABLE east_harlem_pluto AS
SELECT * from pluto_17v1
WHERE pluto_17v1.unitsres > 0 AND pluto_17v1.borocode = '1'
AND pluto_17v1.zipcode = '10029' OR pluto_17v1.zipcode = '10035';

CREATE TABLE east_harlem_hpd_complaints AS
SELECT * from hpd_complaints
WHERE hpd_complaints.zip = '10029' OR hpd_complaints.zip = '10035';

CREATE TABLE hpd_complaints_east_harlem_out AS
SELECT east_harlem_pluto.bbl, east_harlem_pluto.lat, east_harlem_pluto.lng, east_harlem_hpd_complaints.complaintid, east_harlem_hpd_complaints.statusdate, east_harlem_pluto.unitsres AS units                                                          
FROM east_harlem_pluto,east_harlem_hpd_complaints                                          
WHERE east_harlem_pluto.bbl = east_harlem_hpd_complaints.bbl                                     
GROUP BY statusdate, east_harlem_pluto.bbl, complaintid, unitsres, lat, lng;

CREATE TABLE hpd_complaints_emerald_equity_out AS
SELECT east_harlem_pluto.bbl, east_harlem_pluto.lat, east_harlem_pluto.lng, east_harlem_hpd_complaints.complaintid, east_harlem_hpd_complaints.statusdate, east_harlem_pluto.unitsres AS units                                                          
FROM east_harlem_pluto,east_harlem_hpd_complaints 
JOIN emerald_equity_bin_bbl ON east_harlem_hpd_complaints.bbl = emerald_equity_bin_bbl.bbl                                         
WHERE east_harlem_pluto.bbl = east_harlem_hpd_complaints.bbl                                     
GROUP BY statusdate, east_harlem_pluto.bbl, complaintid, unitsres, lat, lng;