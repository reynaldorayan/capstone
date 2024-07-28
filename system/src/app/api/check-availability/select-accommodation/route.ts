import {
  type NextRequest as Request,
  NextResponse as response,
} from "next/server";
import { getAvailability } from "./util";

export async function POST(request: Request) {
  const data = await request.json();

  const { accommodationIds, startDate, endDate, timeSlotId } = data as {
    accommodationIds: string[];
    startDate: string;
    endDate: string;
    timeSlotId: string;
  };

  const result = await getAvailability(
    accommodationIds,
    startDate,
    endDate,
    timeSlotId
  );

  return response.json(result);
}
