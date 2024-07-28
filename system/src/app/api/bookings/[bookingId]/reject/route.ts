import db, { prismaErrorHandler } from "@/lib/prisma";
import { RejectFormInput, rejectSchema } from "@/schemas/booking";
import { peso } from "@/utils";
import { sendMail } from "@/vendors/nodemailer";
import { sendSms } from "@/vendors/semaphore";
import { BookingStatus, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { NextRequest as Request, NextResponse as response } from "next/server";

export async function POST(
  request: Request,
  { params: { bookingId } }: { params: { bookingId: string } }
) {
  try {
    const data = (await request.json()) as RejectFormInput;

    const validation = rejectSchema.safeParse(data);

    if (validation.error) {
      return response.json(
        {
          error: validation.error.flatten().fieldErrors,
        },
        {
          status: 400,
        }
      );
    }

    const { reasonForRejection } = data;

    const booking = await db.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        payments: true,
        accommodation: {
          include: {
            rates: {
              include: {
                timeSlot: true,
              },
            },
            maxAllowedGuests: {
              include: {
                timeSlot: true,
              },
            },
            excessGuestCharges: true,
          },
        },
        timeSlot: true,
        user: true,
      },
    });

    await db.booking.update({
      where: {
        id: booking.id,
      },
      data: {
        status: BookingStatus.REJECTED,
        reasonForRejection,
      },
    });

    const {
      user,
      timeSlot,
      accommodation,
      adults,
      children,
      pwds,
      checkIn,
      checkOut,
      balance,
      bookingFee,
      reservationFee,
      securityDeposit,
    } = booking;

    await sendSms(
      user.mobile,
      "We regret to inform you that your booking request has been rejected. Please contact us for further assistance."
    );

    const accommodationRate = accommodation.rates.find(
      (rate) => rate.timeSlot.id === timeSlot.id
    ).rate;

    const maxAllowedGuests = Number(
      accommodation.maxAllowedGuests.find(
        (guest) => guest.timeSlot.id === timeSlot.id
      ).guestCount
    );

    const excessChargePerAdult = accommodation.excessGuestCharges.find(
      (charge) => charge.guestType === "ADULT"
    ).rate;

    const guestCounts = Number(children) + Number(adults) + Number(pwds);

    const excessGuests =
      Number(guestCounts) > maxAllowedGuests
        ? guestCounts - maxAllowedGuests
        : 0;

    const excessCharge = Number(excessGuests) * Number(excessChargePerAdult);

    let htmlTemplate = "<div>";

    htmlTemplate += `
        <div>  
            <p>Hi ${user.firstName} ${user.lastName},</p>

            <p>Good news! Your booking has been approved. Your booking details are as follows:</p>
            
            <p>Booking No: ${booking.bookingNo}</p>
            <p>Accommodation: ${accommodation.name}</p>
            <p>Check-in: ${dayjs(checkIn).format("MMMM DD YYYY")} - ${
      timeSlot.startTime
    }</p>
            <p>Check-out: ${dayjs(checkOut).format("MMMM DD YYYY")} - ${
      timeSlot.endTime
    }</p>
            <p>Number of Guests: ${guestCounts} pax</p>
            <p>Accommodation Rate: ${peso(Number(accommodationRate))}</p>
            <p>Excess Charges: ${excessGuests} x ${peso(
      Number(excessChargePerAdult)
    )} = ${peso(excessCharge)}</p>
            <p>Balance: ${peso(Number(balance))}</p>
            <p>Reservation Fee: ${peso(Number(reservationFee))}</p>
            <p>Security Deposit: ${peso(Number(securityDeposit))}</p>
            <p>Booking Fee: ${peso(Number(bookingFee))}</p> 

          <p>Thank you, <br/>  Happy Homes Resort, Recreational Hub Inc.</p>
        </div>
    `;

    htmlTemplate += "</div>";

    await sendMail({
      subject: "Booking Rejected",
      message: htmlTemplate,
      to: user.email,
    });

    return response.json({ success: true, booking }, { status: 200 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return response.json(prismaErrorHandler(error), { status: 400 });
    }
  }
}
