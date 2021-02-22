/** Types generated for queries found in "src/static-queries/vehicle-type-search.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'VehicleTypeFuzzySearchWithOffsetAndLimit' parameters type */
export interface IVehicleTypeFuzzySearchWithOffsetAndLimitParams {
  query: string | null | void;
  score: number | null | void;
  offset: string | null | void;
  limit: string | null | void;
}

/** 'VehicleTypeFuzzySearchWithOffsetAndLimit' return type */
export interface IVehicleTypeFuzzySearchWithOffsetAndLimitResult {
  count: string | null;
  id: string;
  make: string;
  model: string;
  year: number;
  score: number | null;
}

/** 'VehicleTypeFuzzySearchWithOffsetAndLimit' query type */
export interface IVehicleTypeFuzzySearchWithOffsetAndLimitQuery {
  params: IVehicleTypeFuzzySearchWithOffsetAndLimitParams;
  result: IVehicleTypeFuzzySearchWithOffsetAndLimitResult;
}

const vehicleTypeFuzzySearchWithOffsetAndLimitIR: any = {"name":"VehicleTypeFuzzySearchWithOffsetAndLimit","params":[{"name":"query","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":152,"b":156,"line":7,"col":50}]}},{"name":"score","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":184,"b":188,"line":8,"col":16}]}},{"name":"offset","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":219,"b":224,"line":11,"col":8}]}},{"name":"limit","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":233,"b":237,"line":12,"col":7}]}}],"usedParamSet":{"query":true,"score":true,"offset":true,"limit":true},"statement":{"body":"select\n\tcount(*) over (),\n\t*\nfrom\n\tvehicle_type,\n\tsimilarity(make || ' ' || model || ' ' || year, :query) as score\nwhere score >= :score\norder by\n\tscore desc\noffset :offset\nlimit :limit","loc":{"a":53,"b":237,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * select
 * 	count(*) over (),
 * 	*
 * from
 * 	vehicle_type,
 * 	similarity(make || ' ' || model || ' ' || year, :query) as score
 * where score >= :score
 * order by
 * 	score desc
 * offset :offset
 * limit :limit
 * ```
 */
export const vehicleTypeFuzzySearchWithOffsetAndLimit = new PreparedQuery<IVehicleTypeFuzzySearchWithOffsetAndLimitParams,IVehicleTypeFuzzySearchWithOffsetAndLimitResult>(vehicleTypeFuzzySearchWithOffsetAndLimitIR);


