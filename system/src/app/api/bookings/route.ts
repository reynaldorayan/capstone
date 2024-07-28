import { moveFile } from "@/lib/fileupload";
import db, { prismaErrorHandler } from "@/lib/prisma";
import { genBookNo, peso } from "@/utils";
import { sendMail } from "@/vendors/nodemailer";
import { sendSms } from "@/vendors/semaphore";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { NextRequest as Request, NextResponse as response } from "next/server";

export async function GET(request: Request) {
  try {
    const bookings = await db.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        payments: true,
        accommodation: {
          include: {
            maxAllowedGuests: {
              include: {
                timeSlot: true,
              },
            },
            maxExcessGuests: {
              include: {
                timeSlot: true,
              },
            },
            excessGuestCharges: true,
            rates: {
              include: {
                timeSlot: true,
              },
            },
          },
        },
        timeSlot: true,
        user: true,
      },
    });

    return response.json(bookings);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return response.json(prismaErrorHandler(error), { status: 400 });
    }
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const data = Object.fromEntries(formData.entries()) as {
      userId: string;
      accommodationId: string;
      timeSlotId: string;
      checkIn: string;
      checkOut: string;
      adults: string;
      children: string;
      pwds: string;
      bookingFee: string;
      reservationFee: string;
      balance: string;
      securityDeposit: string;
      paymentIntentId: string;
      paymentClientKey: string;
      paymentOption: string;
      paymentMethod: string;
    };

    const {
      userId,
      accommodationId,
      timeSlotId,
      checkIn,
      checkOut,
      adults,
      children,
      pwds,
      bookingFee,
      reservationFee,
      balance,
      paymentIntentId,
      paymentClientKey,
      paymentOption,
      paymentMethod,
    } = data;

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    const timeSlot = await db.timeSlot.findUnique({
      where: {
        id: timeSlotId,
      },
    });

    const accommodation = await db.accommodation.findUnique({
      where: {
        id: accommodationId,
      },
      include: {
        maxAllowedGuests: {
          include: {
            timeSlot: true,
          },
        },
        maxExcessGuests: {
          include: {
            timeSlot: true,
          },
        },
        excessGuestCharges: true,
        rates: {
          include: {
            timeSlot: true,
          },
        },
      },
    });

    const securityDeposit = Number(accommodation.isPackage ? 3000 : 1000);

    const frontId = formData.get("frontId");
    const backId = formData.get("backId");

    const bookingNo = genBookNo();

    let frontIdPath: string | null = null;
    let backIdPath: string | null = null;

    if (frontId instanceof File) frontIdPath = await moveFile(frontId);

    if (backId instanceof File) backIdPath = await moveFile(backId);

    const booking = await db.booking.create({
      data: {
        bookingNo,
        frontId: frontIdPath,
        backId: backIdPath,
        user: {
          connect: {
            id: userId,
          },
        },
        accommodation: {
          connect: {
            id: accommodationId,
          },
        },
        timeSlot: {
          connect: {
            id: timeSlotId,
          },
        },
        checkIn: dayjs(checkIn).add(1, "day").toDate(),
        checkOut: dayjs(checkOut).add(1, "day").toDate(),
        adults: Number(adults),
        children: Number(children),
        pwds: Number(pwds),
        bookingFee,
        reservationFee,
        balance,
        securityDeposit,
        status: "PENDING",
        payments: {
          create: [
            {
              paymentIntentId,
              paymentClientKey,
              paymentOption,
              paymentMethod,
              amount:
                paymentOption === "fullPayment" ? bookingFee : reservationFee,
              isCash: false,
              change: 0,
            },
          ],
        },
      },
    });

    await sendSms(
      user.mobile,
      "We have received your booking request. Please check your email address for more details. We will notify you once your booking is approved."
    );

    const accommodationRate = accommodation.rates.find(
      (rate) => rate.timeSlot.id === timeSlotId
    ).rate;

    const maxAllowedGuests = Number(
      accommodation.maxAllowedGuests.find(
        (guest) => guest.timeSlot.id === timeSlotId
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

            <p>We have received your booking request. Your booking details are as follows:</p>
            
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
            <p>Security Deposit: ${peso(securityDeposit)}</p>
            <p>Booking Fee: ${peso(Number(bookingFee))}</p>
            
          <p>We will notify you once your booking is approved. </p>

          <p>Thank you, <br/>  Happy Homes Resort, Recreational Hub Inc.</p>
        </div>
    `;

    htmlTemplate += "</div>";

    await sendMail({
      subject: "Booking Request Received",
      message: htmlTemplate,
      to: user.email,
    });

    return response.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return response.json(prismaErrorHandler(error), { status: 400 });
    }
  }
}
