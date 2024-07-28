"use client";

import Image from "next/image";
import gcash from "@/assets/gcash.png";
import paymaya from "@/assets/paymaya.png";
import unionbank from "@/assets/unionbank.png";
import bpi from "@/assets/bpi.png";
import { nowThen } from "@/lib/dayjs";
import Link from "next/link";
import Modal from "@/components/ui/modal";
import { useDisclosure } from "@nextui-org/react";

export default function Footer() {
  const {
    isOpen: showDataPrivacyPolicy,
    onOpen: openDataPrivacyPolicy,
    onClose: closeDataPrivacyPolicy,
  } = useDisclosure();

  const {
    isOpen: showTermsAndConditions,
    onOpen: openTermsAndConditions,
    onClose: closeTermsAndConditions,
  } = useDisclosure();

  return (
    <footer className="px-6 sm:px-0 mt-16 border-t bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-3 py-6 gap-5 border-b">
        <div className="flex justify-center">
          <div>
            <h1 className="text-xl font-medium">Happy Homes</h1>
            <p className="text-gray-700 font-light">
              A place where you can relax and enjoy the beauty of nature.
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center font-light">
          <p>Brgy. Masalukot 1, Candelaria, Philippines</p>
          <p>
            <a href="tel:639456682232">(+63) 945 6682 232</a>
          </p>
          <p>
            <a href="mailto:happyhomesrecreationalhubinc@gmail.com">
              happyhomesrecreationalhubinc@gmail.com
            </a>
          </p>
          <p>
            Follow us:&nbsp;
            <a
              href="https://www.facebook.com/HappyHomesCandelaria"
              target="blank"
              className="text-blue-500"
            >
              Facebook
            </a>
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 h-10">
          <Image
            src={gcash.src}
            alt="gcash"
            height={5}
            width={50}
            unoptimized={true}
            priority={true}
            className="h-7 w-7 opacity-80"
          />
          <Image
            src={paymaya.src}
            alt="paymaya"
            height={5}
            width={50}
            unoptimized={true}
            priority={true}
            className="h-7 w-7 opacity-80"
          />
          <Image
            src={unionbank.src}
            alt="unionbank"
            height={5}
            width={50}
            unoptimized={true}
            priority={true}
            className="h-7 w-7 opacity-80"
          />
          <Image
            src={bpi.src}
            alt="bpi"
            height={5}
            width={50}
            unoptimized={true}
            priority={true}
            className="h-7 w-7 opacity-80 rounded-md"
          />
        </div>
      </div>

      <Modal
        isOpen={showDataPrivacyPolicy}
        onClose={closeDataPrivacyPolicy}
        title="SmartBook Data Privacy Policy"
        size="5xl"
      >
        <div className="flex flex-col gap-3">
          <h2>Introduction</h2>
          <p>
            SmartBook ("we", "our", "us") is committed to protecting the privacy
            and security of our users' personal information. This Data Privacy
            Policy outlines the types of information we collect, how we use it,
            and the measures we take to ensure its protection. By using
            SmartBook, you agree to the collection and use of information in
            accordance with this policy.
          </p>

          <h2>Information We Collect</h2>
          <h3>1. Personal Information:</h3>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Payment information</li>
            <li>Reservation details (e.g., dates of stay, preferences)</li>
          </ul>
          <h3>2. Usage Data:</h3>
          <ul>
            <li>
              Log data (IP address, browser type, date and time of access, pages
              visited)
            </li>
            <li>Device information (type of device, operating system)</li>
          </ul>
          <h3>3. Interaction Data:</h3>
          <ul>
            <li>
              Communications through our Natural Language Processing (NLP)
              system
            </li>
            <li>Virtual tour interactions and preferences</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <h3>1. Service Provision:</h3>
          <ul>
            <li>To facilitate and manage hotel and resort reservations</li>
            <li>To provide personalized virtual tours and recommendations</li>
          </ul>
          <h3>2. Communication:</h3>
          <ul>
            <li>
              To send reservation confirmations, updates, and promotional
              materials
            </li>
            <li>To respond to inquiries and provide customer support</li>
          </ul>
          <h3>3. Improvement and Analytics:</h3>
          <ul>
            <li>To analyze usage patterns and improve our services</li>
            <li>To conduct research and develop new features</li>
          </ul>
          <h3>4. Security:</h3>
          <ul>
            <li>
              To protect against fraud and ensure the security of our systems
            </li>
          </ul>

          <h2>Data Sharing and Disclosure</h2>
          <h3>1. Third-Party Service Providers:</h3>
          <p>
            We may share your information with trusted third-party providers to
            perform services on our behalf (e.g., payment processing, email
            delivery).
          </p>
          <h3>2. Legal Requirements:</h3>
          <p>
            We may disclose your information if required by law or in response
            to valid requests by public authorities.
          </p>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access, loss,
            or misuse. These measures include encryption, access controls, and
            regular security assessments.
          </p>

          <h2>Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to
            fulfill the purposes outlined in this policy, comply with legal
            obligations, resolve disputes, and enforce our agreements.
          </p>

          <h2>Your Rights</h2>
          <h3>1. Access and Correction:</h3>
          <p>
            You have the right to access and update your personal information.
          </p>
          <h3>2. Deletion:</h3>
          <p>
            You can request the deletion of your personal information, subject
            to certain legal and contractual restrictions.
          </p>
          <h3>3. Opt-Out:</h3>
          <p>
            You can opt out of receiving promotional communications from us at
            any time.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Data Privacy Policy from time to time. We will
            notify you of any changes by posting the new policy on our website.
            You are advised to review this policy periodically for any changes.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Data Privacy Policy, please
            contact us at:
          </p>
          <div className="contact-info">
            <p>
              <strong>Email:</strong> happyhomesrecreationalhubinc@gmail.com
            </p>
            <p>
              <strong>Address:</strong> Masalukot 1, Candelaria, Philippines
            </p>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showTermsAndConditions}
        onClose={closeTermsAndConditions}
        title="Terms and Conditions"
        size="5xl"
      >
        <div className="flex flex-col gap-3">
          <h2>Booking and Reservation</h2>
          <p>
            Reservations are on a first-come, first-served basis. A
            non-refundable reservation fee of 50% of the total package price is
            required to secure your booking. The remaining 50% of the total
            package price must be paid at least 7 days prior to the reservation
            date.
          </p>

          <h2>Cancellation and Refunds</h2>
          <p>1. This reservation is non-refundable.</p>
          <p>
            2. Date changes must be requested at least 14 days before the event.
          </p>
          <p>
            3. A date change fee of 15% of the contract rate applies for date
            changes requested after the 14-day period.
          </p>
          <p>
            4. A cancellation fee of 20% of the contract rate applies for
            cancellations made within 14 days of the event.
          </p>

          <h2>Occupancy and Additional Guests</h2>
          <p>Function Hall Maximum Allowed Guests: 100 to 150 pax</p>
          <p>Villa #1 Maximum Allowed Guests: 15 pax</p>
          <p>Villa #2 Maximum Allowed Guests: 15 pax</p>
          <p>Villa #3 Maximum Allowed Guests: 15 pax</p>
          <p>
            Exceeding these capacities may result in additional charges or
            denial of entry.
          </p>

          <h2>Check-In and Check-Out</h2>
          <p>
            Check-in time strictly follows the reservation details, and requests
            for early check-in or late check-out are subject to availability,
            with potential additional charges.
          </p>

          <h2>Security Deposit</h2>
          <p>
            A security deposit may be required upon check-in to cover any
            damages or excessive cleaning costs. This deposit will be refunded
            upon check-out after a satisfactory inspection of the premises.
          </p>

          <h2>Conduct and Behavior</h2>
          <p>
            Guests are expected to conduct themselves in a respectful and
            responsible manner at all times. Excessive noise, disruptive
            behavior, and any activities that disturb other guests or the
            peaceful environment of the resort are strictly prohibited.
          </p>

          <h2>Facility Use and Amenities</h2>
          <p>
            Guests are responsible for the proper use and care of the
            facilities, including the swimming pool, pavilions, and common
            areas. Any damage caused by guests will be charged accordingly.
          </p>

          <h2>Pets</h2>
          <p>
            Pets are allowed but must be supervised by the owner and are not
            allowed on the poolside and on the beds.
          </p>

          <h2>Alcohol and Smoking</h2>
          <p>
            Consumption of alcohol is allowed for guests of legal drinking age.
            Smoking is only permitted in designated smoking areas. Please
            dispose of cigarette butts responsibly.
          </p>

          <h2>Liability</h2>
          <p>
            Happy Homes Recreational Hub Inc. is not responsible for any loss,
            theft, or damage to personal belongings during your stay.
          </p>
          <p>
            Happy Homes Recreational Hub Inc. does not assume liability in the
            event of the failure to provide services by utility providers, such
            as a brownout or any other disruption in utility services. Such
            occurrences are beyond the control of Happy Homes Recreational Hub
            Inc.
          </p>

          <h2>Indemnification</h2>
          <p>
            Guests are fully responsible for their actions and agree to
            indemnify and hold Happy Homes Recreational Hub Inc. harmless
            against any claims, damages, or liabilities arising from their stay.
          </p>

          <h2>Right to Refuse Service</h2>
          <p>
            Happy Homes Recreational Hub Inc. reserves the right to refuse
            service or evict any guest who violates these terms and conditions
            or disrupts the peaceful enjoyment of other guests.
          </p>

          <p>
            By making a reservation at Happy Homes Recreational Hub Inc., you
            acknowledge and agree to abide by these terms and conditions.
            Failure to comply may result in the cancellation of your reservation
            and additional charges.
          </p>
        </div>
      </Modal>

      <div className="flex justify-center items-center py-4 text-gray-600 gap-1 font-light">
        &copy; {nowThen().year()} Happy Homes. All rights reserved. |{" "}
        <Link
          href="#"
          className="text-blue-500 text-sm"
          onClick={openDataPrivacyPolicy}
        >
          Privacy Policy
        </Link>{" "}
        |{" "}
        <Link
          href="#"
          className="text-blue-500 text-sm"
          onClick={openTermsAndConditions}
        >
          Terms and Conditions
        </Link>
      </div>
    </footer>
  );
}
