/* @name VehicleTypeFuzzySearchWithOffsetAndLimit */
select
	count(*) over (),
	*
from
	vehicle_type,
	similarity(make || ' ' || model || ' ' || year, :query) as score
where score >= :score
order by
	score desc
offset :offset
limit :limit;
