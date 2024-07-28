import { GuestType, Prisma, PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";
import dayjs from "dayjs";
const prisma = new PrismaClient();

enum TourType {
  DAY_TOUR = "Day Tour",
  AFTERNOON_TOUR = "Afternoon Tour",
  NIGHT_TOUR = "Night Tour",
  TWENTY_TWO_HOURS_TOUR = "22 Hours Tour",
}

async function main() {
  const password = await hash("!@Password123", 12);

  const reviews: Prisma.ReviewCreateInput[] = [
    {
      alias: "John Doe",
      comment:
        "I love the vibe of the place. The food is great and the staff are very accommodating. I will definitely come back here again.",
    },
  ];

  const users: Prisma.UserCreateInput[] = [
    {
      mobile: "09123456789",
      role: Role.ADMIN,
      lastName: "Eric",
      firstName: "Arpia",
      username: "eric",
      password,
      email: "smartbook@reynaldorayan.dev",
      mobileVerifiedAt: dayjs().toDate(),
      emailVerifiedAt: dayjs().toDate(),
      agreement: {
        create: {
          termsAndConditions: true,
          dataPrivacyPolicy: true,
        },
      },
      line1: "",
      line2: "Brgy. Masalukot 1",
      city: "Candelaria",
      state: "Quezon",
      postalCode: "4323",
      country: "PH",
      birthDate: new Date(),
    },
  ];

  const amenities: Prisma.AmenityCreateManyInput[] = [
    {
      name: "BBQ Station",
      description: "Grill delicious meals at our guest BBQ station.",
    },
    {
      name: "Internet Access",
      description: "High-speed internet available throughout the resort.",
    },
    {
      name: "Kids Playground",
      description: "Safe and fun playground for children.",
    },
    {
      name: "Mural Corner",
      description:
        "Explore our vibrant mural corner, featuring stunning artworks that provide a perfect backdrop for memorable photos and a touch of local culture.",
    },
    {
      name: "Soundbar at Pool Side (Sharing)",
      description: "Share and enjoy music with our poolside soundbar.",
    },
    {
      name: "Use of Basketball Court",
      description: "Play a game on our well-maintained basketball court.",
    },
    {
      name: "Use of Common C.R.",
      description: "Clean and comfortable restrooms for your convenience.",
    },
    {
      name: "Use of Parking",
      description: "Secure and convenient parking for all guests.",
    },
    {
      name: "Use of Swimming Pool",
      description: "Enjoy a refreshing swim or relax by our sparkling pool.",
    },
  ];

  const inclusions: Prisma.InclusionCreateManyInput[] = [
    {
      name: "Outdoor Space",
      description: "",
    },
    {
      name: "2 Common Toilet and Bath w/ Hot and Cold / 1 at Masters Bedroom",
      description: "",
    },
    {
      name: "2 Slot Parking Space",
      description: "",
    },
    {
      name: "4 Rooms w/ 13 pax Sleeping Capacity (Air-Conditioner)",
      description: "",
    },
    {
      name: "Private Swimming Pool",
      description: "",
    },
    {
      name: "Shower Room",
      description: "",
    },
    {
      name: "Table Tennis",
      description: "",
    },
    {
      name: "Toilet",
      description: "",
    },
    {
      name: "Complementary Tables and Chairs Sound System to Amplify your device",
      description: "",
    },
    {
      name: "Videoke Room (Sound Proof and Air-conditioner)",
      description: "",
    },
    {
      name: "Water Dispenser Hot and Cold",
      description: "",
    },
    {
      name: "Xbox Kinect",
      description: "",
    },
    {
      name: "Sound Bar",
      description: "",
    },
    {
      name: "Sofa Bed",
      description: "",
    },
    {
      name: "Single Size Extra Bed",
      description: "",
    },
    {
      name: "Queen Size Bed",
      description: "",
    },
    {
      name: "Private Toilet and Bath w/ Hot and Cold Shower",
      description: "",
    },
    {
      name: "Electric Stove w/ Oven",
      description: "",
    },
    {
      name: "Double Size Bed",
      description: "",
    },
    {
      name: "Android TV",
      description: "",
    },
    {
      name: "Access to All Pavilion",
      description: "",
    },
    {
      name: "8 Seater Dinning Table",
      description: "",
    },
    {
      name: "2 Double Deck (Single Top / Single Buttom)",
      description: "",
    },
    {
      name: "Wifi and Netflix",
      description: "",
    },
    {
      id: "27f3e5eb-96c1-47b3-b3f9-7897461d9818",
      name: "Smart TV",
      description: "",
    },
    {
      id: "abc9c7f6-bd34-4868-9c41-bf06ffb27cda",
      name: "Refrigerator",
      description: "",
    },
    {
      name: "Queen Size Bed w/ Double Size Pull Out",
      description: "",
    },
    {
      name: "Microwave",
      description: "",
    },
    {
      name: "Electric Stove",
      description: "",
    },
    {
      name: "Electric Fan",
      description: "",
    },
    {
      name: "Bluetooth Speaker",
      description: "",
    },
    {
      name: "Air-Conditioner",
      description: "",
    },
    {
      name: "6 Seater Dinning Table",
      description: "",
    },
  ];

  const timeSlots: Prisma.TimeSlotCreateInput[] = [
    {
      name: TourType.DAY_TOUR,
      startTime: "09:00 AM",
      endTime: "05:00 PM",
    },
    {
      name: TourType.AFTERNOON_TOUR,
      startTime: "02:00 PM",
      endTime: "11:00 PM",
    },
    {
      name: TourType.NIGHT_TOUR,
      startTime: "08:00 PM",
      endTime: "07:00 AM",
    },
    {
      name: TourType.TWENTY_TWO_HOURS_TOUR,
      startTime: "02:00 PM",
      endTime: "12:00 PM",
    },
  ];

  const facilities: Prisma.FacilityCreateManyInput[] = [
    {
      name: "Villa 1",
    },
    {
      name: "Villa 2",
    },
    {
      name: "Villa 3",
    },
    {
      name: "Private House",
    },
    {
      name: "Private Pool",
    },
    {
      name: "Function Hall",
    },
  ];

  if ((await prisma.user.count()) === 0) {
    for (const user of users) {
      await prisma.user.create({
        data: user,
      });
    }
  }

  if ((await prisma.review.count()) === 0) {
    for (const review of reviews) {
      await prisma.review.create({
        data: review,
      });
    }
  }

  if ((await prisma.amenity.count()) == 0) {
    await prisma.amenity.createMany({ data: amenities });
  }

  if ((await prisma.inclusion.count()) == 0) {
    await prisma.inclusion.createMany({ data: inclusions });
  }

  if ((await prisma.timeSlot.count()) == 0) {
    await prisma.timeSlot.createMany({ data: timeSlots });
  }

  if ((await prisma.facility.count()) == 0) {
    await prisma.facility.createMany({ data: facilities });
  }

  const isStoredEssentials =
    (await prisma.amenity.count()) != 0 &&
    (await prisma.inclusion.count()) != 0 &&
    (await prisma.timeSlot.count()) != 0 &&
    (await prisma.facility.count()) != 0;

  if (isStoredEssentials) {
    const amenities = await prisma.amenity.findMany();
    const inclusions = await prisma.inclusion.findMany();
    const timeSlots = await prisma.timeSlot.findMany();

    const AAmenityCreateNestedManyWithoutAccommodationInput: Prisma.AAmenityCreateNestedManyWithoutAccommodationInput =
      {
        create: amenities.map((amenity) => ({
          amenity: {
            connect: {
              id: amenity.id,
            },
          },
        })),
      };

    const AInclusionCreateNestedManyWithoutAccommodationInput: Prisma.AInclusionCreateNestedManyWithoutAccommodationInput =
      {
        create: inclusions.map((inclusion) => ({
          inclusion: {
            connect: {
              id: inclusion.id,
            },
          },
        })),
      };

    const AExcessGuestChargeCreateNestedManyWithoutAccommodationInput: Prisma.AExcessGuestChargeCreateNestedManyWithoutAccommodationInput =
      {
        create: [
          {
            rate: 200,
            guestType: GuestType.ADULT,
          },
          {
            rate: 150,
            guestType: GuestType.CHILD,
          },
          {
            rate: 160,
            guestType: GuestType.PWD,
          },
        ],
      };

    const accommodations: Prisma.AccommodationCreateInput[] = [
      {
        photo: "Villa 1.jpg",
        isPackage: false,
        virtualTour:
          "https://kuula.co/share/collection/7KPXF?logo=-1&info=0&fs=1&vr=1&zoom=1&gyro=0&thumbs=3&inst=0&keys=0",
        name: "Villa 1",
        description:
          "This cozy space offers WiFi, a Smart TV, a fully equipped kitchen, air conditioning, a private bath with a hot shower, and comfortable sleeping arrangements.",
        amenities: AAmenityCreateNestedManyWithoutAccommodationInput,
        inclusions: AInclusionCreateNestedManyWithoutAccommodationInput,
        excessGuestCharges:
          AExcessGuestChargeCreateNestedManyWithoutAccommodationInput,
        facilities: {
          create: [
            {
              facility: {
                connect: {
                  name: "Villa 1",
                },
              },
            },
          ],
        },
        rates: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            rate:
              timeSlot.name === TourType.DAY_TOUR
                ? 4000
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 4500
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 4500
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 8500
                : 0,
          })),
        },
        maxAllowedGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 15
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 8
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 8
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 8
                : 0,
          })),
        },
        maxExcessGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 5
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 7
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 7
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 7
                : 0,
          })),
        },
      },
      {
        photo: "Villa 2.jpg",
        isPackage: false,
        virtualTour:
          "https://kuula.co/share/collection/7KPXd?logo=-1&info=0&fs=1&vr=1&zoom=1&gyro=0&thumbs=3&inst=0&keys=0",
        name: "Villa 2",
        description:
          "Villa 2 offers WiFi, Netflix, a kitchen, air conditioning, and sleeping arrangements with a queen-size bed, pull-out, extra bed, and a private bath.",
        amenities: AAmenityCreateNestedManyWithoutAccommodationInput,
        inclusions: AInclusionCreateNestedManyWithoutAccommodationInput,
        excessGuestCharges:
          AExcessGuestChargeCreateNestedManyWithoutAccommodationInput,
        facilities: {
          create: [
            {
              facility: {
                connect: {
                  name: "Villa 2",
                },
              },
            },
          ],
        },
        rates: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            rate:
              timeSlot.name === TourType.DAY_TOUR
                ? 4000
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 4500
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 4500
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 8500
                : 0,
          })),
        },
        maxAllowedGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 15
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 8
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 8
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 8
                : 0,
          })),
        },
        maxExcessGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 5
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 7
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 7
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 7
                : 0,
          })),
        },
      },
      {
        photo: "Villa 3.jpg",
        isPackage: false,
        virtualTour:
          "https://kuula.co/share/collection/7KPc5?logo=-1&info=0&fs=1&vr=1&zoom=1&gyro=0&thumbs=3&inst=0&keys=0",
        name: "Villa 3",
        description:
          "This space offers a kitchen, WiFi, Android TV with Netflix, air conditioning, and sleeping for up to eight people.",
        amenities: AAmenityCreateNestedManyWithoutAccommodationInput,
        inclusions: AInclusionCreateNestedManyWithoutAccommodationInput,
        excessGuestCharges:
          AExcessGuestChargeCreateNestedManyWithoutAccommodationInput,
        facilities: {
          create: [
            {
              facility: {
                connect: {
                  name: "Villa 3",
                },
              },
            },
          ],
        },
        rates: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            rate:
              timeSlot.name === TourType.DAY_TOUR
                ? 5000
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 5500
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 5500
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 10500
                : 0,
          })),
        },
        maxAllowedGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 15
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 8
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 8
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 8
                : 0,
          })),
        },
        maxExcessGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 5
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 7
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 7
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 7
                : 0,
          })),
        },
      },
      {
        photo: "Private House.jpg",
        isPackage: false,
        virtualTour:
          "https://kuula.co/share/collection/7KP8m?logo=-1&info=0&fs=1&vr=1&zoom=1&gyro=0&thumbs=3&inst=0&keys=0",
        name: "Private House (Only)",
        description:
          "This modern house features an Android TV with WiFi and Netflix, a soundbar, fully equipped kitchen, electric fan, sofa bed, and parking for two vehicles.",
        amenities: AAmenityCreateNestedManyWithoutAccommodationInput,
        inclusions: AInclusionCreateNestedManyWithoutAccommodationInput,
        excessGuestCharges:
          AExcessGuestChargeCreateNestedManyWithoutAccommodationInput,
        facilities: {
          create: [
            {
              facility: {
                connect: {
                  name: "Private House",
                },
              },
            },
          ],
        },
        rates: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            rate:
              timeSlot.name === TourType.DAY_TOUR
                ? 6500
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 7500
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 7500
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 12000
                : 0,
          })),
        },
        maxAllowedGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 20
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 15
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 15
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 15
                : 0,
          })),
        },
        maxExcessGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 5
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 5
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 5
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 5
                : 0,
          })),
        },
      },
      {
        photo: "Private Pool.jpg",
        isPackage: false,
        virtualTour:
          "https://kuula.co/share/collection/7KP8J?logo=-1&info=0&fs=1&vr=1&zoom=1&gyro=0&thumbs=3&inst=0&keys=0",
        name: "Private Pool (Only)",
        description:
          "Experience a luxurious stay with a private swimming pool, air-conditioned videoke room, Xbox Kinect, and table tennis. Facilities include a shower room and toilet.",
        amenities: AAmenityCreateNestedManyWithoutAccommodationInput,
        inclusions: AInclusionCreateNestedManyWithoutAccommodationInput,
        excessGuestCharges:
          AExcessGuestChargeCreateNestedManyWithoutAccommodationInput,
        facilities: {
          create: [
            {
              facility: {
                connect: {
                  name: "Private Pool",
                },
              },
            },
          ],
        },
        rates: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            rate:
              timeSlot.name === TourType.DAY_TOUR
                ? 6000
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 6500
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 0
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 0
                : 0,
          })),
        },
        maxAllowedGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 15
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 15
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 0
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 0
                : 0,
          })),
        },
        maxExcessGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 5
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 5
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 0
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 0
                : 0,
          })),
        },
      },
      {
        photo: "Private House & Pool.jpg",
        isPackage: false,
        virtualTour:
          "https://kuula.co/share/collection/7Kkn1?logo=-1&info=0&fs=1&vr=1&zoom=1&gyro=0&thumbs=3&inst=0&keys=0",
        name: "Private House and Private Pool",
        description:
          "This luxurious property features an Android TV with Netflix, Xbox Kinect, air-conditioned videoke room, private swimming pool, kitchen amenities, and parking for two vehicles.",
        amenities: AAmenityCreateNestedManyWithoutAccommodationInput,
        inclusions: AInclusionCreateNestedManyWithoutAccommodationInput,
        excessGuestCharges:
          AExcessGuestChargeCreateNestedManyWithoutAccommodationInput,
        facilities: {
          create: [
            {
              facility: {
                connect: {
                  name: "Private House",
                },
              },
            },
            {
              facility: {
                connect: {
                  name: "Private Pool",
                },
              },
            },
          ],
        },
        rates: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            rate:
              timeSlot.name === TourType.DAY_TOUR
                ? 9000
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 10000
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 10000
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 14000
                : 0,
          })),
        },
        maxAllowedGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 20
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 15
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 15
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 15
                : 0,
          })),
        },
        maxExcessGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 5
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 5
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 5
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 5
                : 0,
          })),
        },
      },
      {
        photo: "Function Hall Exclusive Package.jpg",
        isPackage: true,
        virtualTour:
          "https://kuula.co/share/collection/7KPzX?logo=-1&info=0&fs=1&vr=1&zoom=1&gyro=0&thumbs=3&inst=0&keys=0",
        name: "Function Hall Exclusive Package",
        description:
          "Function Hall for 150 guests with tables, chairs, sound system",
        amenities: AAmenityCreateNestedManyWithoutAccommodationInput,
        inclusions: AInclusionCreateNestedManyWithoutAccommodationInput,
        excessGuestCharges:
          AExcessGuestChargeCreateNestedManyWithoutAccommodationInput,
        facilities: {
          create: [
            {
              facility: {
                connect: {
                  name: "Function Hall",
                },
              },
            },
          ],
        },
        rates: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            rate:
              timeSlot.name === TourType.DAY_TOUR
                ? 13700
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 14700
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 0
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 0
                : 0,
          })),
        },
        maxAllowedGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 150
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 150
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 0
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 0
                : 0,
          })),
        },
        maxExcessGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 0
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 0
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 0
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 0
                : 0,
          })),
        },
      },
      {
        photo: "Function Hall Exclusive Package Plus+.jpg",
        isPackage: true,
        virtualTour:
          "https://kuula.co/share/collection/7KqNl?logo=-1&info=0&fs=1&vr=1&zoom=1&gyro=0&thumbs=3&inst=0&keys=0",
        name: "Function Hall Exclusive Package Plus",
        description:
          "Function Hall + Outdoor Space: 150 Guests Free tables, chairs, sound system",
        amenities: AAmenityCreateNestedManyWithoutAccommodationInput,
        inclusions: AInclusionCreateNestedManyWithoutAccommodationInput,
        excessGuestCharges:
          AExcessGuestChargeCreateNestedManyWithoutAccommodationInput,
        facilities: {
          create: [
            {
              facility: {
                connect: {
                  name: "Function Hall",
                },
              },
            },
          ],
        },
        rates: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            rate:
              timeSlot.name === TourType.DAY_TOUR
                ? 16500
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 18000
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 0
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 0
                : 0,
          })),
        },
        maxAllowedGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 150
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 150
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 0
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 0
                : 0,
          })),
        },
        maxExcessGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 0
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 0
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 0
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 0
                : 0,
          })),
        },
      },
      {
        photo: "Villa 1 Exclusive Package.jpg",
        isPackage: true,
        virtualTour:
          "https://kuula.co/share/collection/7Kq4r?logo=-1&info=0&fs=1&vr=1&zoom=1&gyro=0&thumbs=3&inst=0&keys=0",
        name: "Villa 1 Exclusive Package",
        description:
          "Enjoy Villa 1 and outdoor space for up to 60 guests with complimentary tables and chairs.",
        amenities: AAmenityCreateNestedManyWithoutAccommodationInput,
        inclusions: AInclusionCreateNestedManyWithoutAccommodationInput,
        excessGuestCharges:
          AExcessGuestChargeCreateNestedManyWithoutAccommodationInput,
        facilities: {
          create: [
            {
              facility: {
                connect: {
                  name: "Villa 1",
                },
              },
            },
          ],
        },
        rates: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            rate:
              timeSlot.name === TourType.DAY_TOUR
                ? 13500
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 15000
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 0
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 0
                : 0,
          })),
        },
        maxAllowedGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 60
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 60
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 0
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 0
                : 0,
          })),
        },
        maxExcessGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 0
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 0
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 0
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 0
                : 0,
          })),
        },
      },
      {
        photo: "Villa 2 Exclusive Package.jpg",
        isPackage: true,
        virtualTour:
          "https://kuula.co/share/collection/7Kq7c?logo=-1&info=0&fs=1&vr=1&zoom=1&gyro=0&thumbs=3&inst=0&keys=0",
        name: "Villa 2 Exclusive Package",
        description:
          "Elevate your event at Villa 2 for up to 60 guests with complimentary tables and chairs.",
        amenities: AAmenityCreateNestedManyWithoutAccommodationInput,
        inclusions: AInclusionCreateNestedManyWithoutAccommodationInput,
        excessGuestCharges:
          AExcessGuestChargeCreateNestedManyWithoutAccommodationInput,
        facilities: {
          create: [
            {
              facility: {
                connect: {
                  name: "Villa 2",
                },
              },
            },
          ],
        },
        rates: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            rate:
              timeSlot.name === TourType.DAY_TOUR
                ? 13500
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 15000
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 0
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 0
                : 0,
          })),
        },
        maxAllowedGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 60
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 60
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 0
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 0
                : 0,
          })),
        },
        maxExcessGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 0
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 0
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 0
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 0
                : 0,
          })),
        },
      },
      {
        photo: "Villa 3 Exclusive Package.jpg",
        isPackage: true,
        virtualTour:
          "https://kuula.co/share/collection/7KqN4?logo=-1&info=0&fs=1&vr=1&zoom=1&gyro=0&thumbs=3&inst=0&keys=0",
        name: "Villa 3 Exclusive Package",
        description: "Enhance your event at Villa 3 for up to 60 guests",
        amenities: AAmenityCreateNestedManyWithoutAccommodationInput,
        inclusions: AInclusionCreateNestedManyWithoutAccommodationInput,
        excessGuestCharges:
          AExcessGuestChargeCreateNestedManyWithoutAccommodationInput,
        facilities: {
          create: [
            {
              facility: {
                connect: {
                  name: "Villa 3",
                },
              },
            },
          ],
        },
        rates: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            rate:
              timeSlot.name === TourType.DAY_TOUR
                ? 14500
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 16000
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 0
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 0
                : 0,
          })),
        },
        maxAllowedGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 60
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 60
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 0
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 0
                : 0,
          })),
        },
        maxExcessGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 0
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 0
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 0
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 0
                : 0,
          })),
        },
      },
      {
        photo: "All Villa Exclusive Package.jpg",
        isPackage: true,
        virtualTour:
          "https://kuula.co/share/collection/7Kq4H?logo=-1&info=0&fs=1&vr=1&zoom=1&gyro=0&thumbs=3&inst=0&keys=0",
        name: "All villa exclusive package",
        description:
          "Upgrade your event at Villa 1, 2, and 3 for up to 150 guests.",
        amenities: AAmenityCreateNestedManyWithoutAccommodationInput,
        inclusions: AInclusionCreateNestedManyWithoutAccommodationInput,
        excessGuestCharges:
          AExcessGuestChargeCreateNestedManyWithoutAccommodationInput,
        facilities: {
          create: [
            {
              facility: {
                connect: {
                  name: "Villa 1",
                },
              },
            },
            {
              facility: {
                connect: {
                  name: "Villa 2",
                },
              },
            },
            {
              facility: {
                connect: {
                  name: "Villa 3",
                },
              },
            },
          ],
        },
        rates: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            rate:
              timeSlot.name === TourType.DAY_TOUR
                ? 19000
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 21500
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 0
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 0
                : 0,
          })),
        },
        maxAllowedGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 150
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 150
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 0
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 0
                : 0,
          })),
        },
        maxExcessGuests: {
          create: timeSlots.map((timeSlot) => ({
            timeSlot: {
              connect: {
                id: timeSlot.id,
              },
            },
            guestCount:
              timeSlot.name === TourType.DAY_TOUR
                ? 0
                : timeSlot.name === TourType.AFTERNOON_TOUR
                ? 0
                : timeSlot.name === TourType.NIGHT_TOUR
                ? 0
                : timeSlot.name === TourType.TWENTY_TWO_HOURS_TOUR
                ? 0
                : 0,
          })),
        },
      },
    ];

    if ((await prisma.accommodation.count()) == 0) {
      for (const accommodation of accommodations) {
        await prisma.accommodation.create({ data: accommodation });
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
