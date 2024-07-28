"use client";

import Button from "@/components/ui/Button";
import DateInput from "@/components/ui/DateInput";
import Input from "@/components/ui/Input";
import { SignupSchema, signupSchema } from "@/schemas/auth";
import { base64ToFile, delay, fileToBase64 } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDate, Divider, useDisclosure } from "@nextui-org/react";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import logo from "@/assets/logo.png";
import { fromCalendarDateToDate, fromDateToCalendarDate } from "@/lib/dayjs";
import dayjs from "dayjs";
import Checkbox from "@/components/ui/Checkbox";
import Link from "next/link";
import bg from "@/assets/Contact us.jpg";
import Modal from "@/components/ui/modal";

export default function SignupForm() {
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

  const router = useRouter();

  const photoRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    setValue,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const submitHandler = async (data: SignupSchema) => {
    const formData = new FormData();

    if (avatar) formData.append("photo", await base64ToFile(avatar));

    for (const key in data) {
      if (key === "photo") continue;

      if (key === "birthDate")
        formData.append(
          key,
          dayjs(data[key as keyof SignupSchema] as Date).toISOString()
        );

      formData.append(key, data[key as keyof SignupSchema].toString());
    }

    try {
      const result = await axios.post("/api/auth/signup", formData);

      if (result.data.success) {
        setIsSignupSuccess(true);

        await delay(1000);

        router.push("/");
        router.refresh();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const err = error.response?.data.error;

        for (const key in err) {
          setError(key as keyof SignupSchema, { message: err[key] });
        }
      } else console.error("Unknown error: ", error);
    }
  };

  useEffect(() => {
    return () => {
      setIsSignupSuccess(false);
      reset();
    };
  }, [reset]);

  const handleSelectPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];

    if (file) {
      const imageBase64 = await fileToBase64(file);
      setAvatar(imageBase64);
      setValue("photo", {
        originalname: file.name,
        mimetype: file.type,
        size: file.size,
      });
    }
  };

  const bgStyles = {
    background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${bg.src}')`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    backgroundPosition: "top",
  };

  return (
    <div
      className="min-h-screen px-3 py-16 grid place-items-center"
      style={{ ...bgStyles }}
    >
      <div className="min-h-80 w-full sm:max-w-6xl mx-auto backdrop-blur-sm bg-white/80 shadow-2xl rounded-lg">
        <div className="p-5">
          <div className="flex flex-col items-center gap-1 mt-5">
            <h1 className="text-xl font-bold">Sign up</h1>
            <p>Create your account</p>
          </div>
          <form
            className="mt-5 flex flex-col gap-5"
            onSubmit={handleSubmit(submitHandler)}
          >
            <div className="flex flex-col justify-center gap-1">
              <h3>
                <span className="text-gray-600 font-medium">Photo</span>
                <p className="text-sm text-gray-500">
                  Your photo will be used for identification purposes
                </p>
              </h3>
              <Input
                ref={photoRef}
                type="file"
                onChange={handleSelectPhoto}
                accept="image/*"
                className="hidden"
              />
              <Image
                onClick={() => {
                  if (photoRef.current) photoRef.current.click();
                }}
                src={avatar || logo.src}
                alt={"Avatar"}
                width={200}
                height={200}
                priority
                unoptimized
                className="mt-2 min-h-[150px] max-h-[150px] min-w-[150px] max-w-[150px] shadow-sm border border-gray-100 hover:scale-105 duration-300 transition-all ease-in-out rounded-full cursor-pointer"
              />
              <p className="text-red-600 text-xs">{errors.photo?.message}</p>
            </div>

            <h2>
              <span className="text-gray-600 font-medium">
                Personal information
              </span>
              <p className="text-sm text-gray-500">
                Your personal information will be used for booking purposes
              </p>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="First Name"
                type="text"
                placeholder="e.g John"
                {...register("firstName")}
                error={errors.firstName?.message}
                isDisabled={isSubmitting}
              />
              <Input
                label="Last Name"
                type="text"
                placeholder="e.g Doe"
                {...register("lastName")}
                error={errors.lastName?.message}
                isDisabled={isSubmitting}
              />
              <Controller
                control={control}
                name="birthDate"
                render={({ field }) => {
                  return (
                    <DateInput
                      label="Date of Birth"
                      value={fromDateToCalendarDate(field.value)}
                      onChange={(value) => {
                        field.onChange(
                          fromCalendarDateToDate(value as CalendarDate)
                        );
                      }}
                      error={errors.birthDate?.message}
                      isDisabled={isSubmitting}
                    />
                  );
                }}
              />
            </div>

            <Divider className="bg-gray-200" />

            <h2>
              <span className="text-gray-600 font-medium">
                Contact information
              </span>
              <p className="text-sm text-gray-500">
                Your contact information will be used for notifications
              </p>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Mobile number"
                placeholder="e.g 09123456789"
                {...register("mobile")}
                error={errors.mobile?.message}
                isDisabled={isSubmitting}
              />

              <Input
                label="Email address"
                type="email"
                placeholder="e.g johndoe@gmail.com"
                {...register("email")}
                error={errors.email?.message}
                isDisabled={isSubmitting}
              />
            </div>

            <Divider className="bg-gray-200" />

            <h2>
              <span className="text-gray-600 font-medium">
                Address information
              </span>
              <p className="text-sm text-gray-500">
                Your address will be used for payment purposes
              </p>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Address Line 1"
                type="text"
                placeholder="Street address, house number, or street name"
                {...register("line1")}
                error={errors.line1?.message}
                isDisabled={isSubmitting}
              />

              <Input
                label="Address Line 2"
                type="text"
                placeholder="Barangay, subdivision, or building name"
                {...register("line2")}
                error={errors.line2?.message}
                isDisabled={isSubmitting}
              />

              <Input
                label="City"
                type="text"
                placeholder="City or municipality"
                {...register("city")}
                error={errors.city?.message}
                isDisabled={isSubmitting}
              />

              <Input
                label="State"
                type="text"
                placeholder="State or province"
                {...register("state")}
                error={errors.state?.message}
                isDisabled={isSubmitting}
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  label="Postal Code"
                  type="number"
                  placeholder="Zip code"
                  {...register("postalCode")}
                  error={errors.postalCode?.message}
                  isDisabled={isSubmitting}
                />
                <Input
                  label="Country"
                  type="text"
                  value="PH"
                  isReadOnly
                  {...register("country")}
                  error={errors.country?.message}
                  isDisabled={isSubmitting}
                />
              </div>
            </div>

            <Divider className="bg-gray-200" />

            <h2>
              <span className="text-gray-600 font-medium">
                Account information
              </span>
              <p className="text-sm text-gray-500">
                Your account information will be used for login purposes
              </p>
            </h2>

            <div className="flex flex-col sm:flex-row gap-5">
              <Input
                label="Username"
                type="text"
                placeholder="e.g johndoe"
                {...register("username")}
                error={errors.username?.message}
                isDisabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 focus:outline-none"
                  >
                    {!showPassword ? (
                      <AiOutlineEye size={20} />
                    ) : (
                      <AiOutlineEyeInvisible size={20} />
                    )}
                  </button>
                }
                {...register("password")}
                error={errors.password?.message}
                isDisabled={isSubmitting}
              />

              <Input
                label="Confirm password"
                type={showPassword ? "text" : "password"}
                placeholder="Re-type your password"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
                isDisabled={isSubmitting}
              />
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
                  SmartBook ("we", "our", "us") is committed to protecting the
                  privacy and security of our users' personal information. This
                  Data Privacy Policy outlines the types of information we
                  collect, how we use it, and the measures we take to ensure its
                  protection. By using SmartBook, you agree to the collection
                  and use of information in accordance with this policy.
                </p>

                <h2>Information We Collect</h2>
                <h3>1. Personal Information:</h3>
                <ul>
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Payment information</li>
                  <li>
                    Reservation details (e.g., dates of stay, preferences)
                  </li>
                </ul>
                <h3>2. Usage Data:</h3>
                <ul>
                  <li>
                    Log data (IP address, browser type, date and time of access,
                    pages visited)
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
                  <li>
                    To facilitate and manage hotel and resort reservations
                  </li>
                  <li>
                    To provide personalized virtual tours and recommendations
                  </li>
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
                    To protect against fraud and ensure the security of our
                    systems
                  </li>
                </ul>

                <h2>Data Sharing and Disclosure</h2>
                <h3>1. Third-Party Service Providers:</h3>
                <p>
                  We may share your information with trusted third-party
                  providers to perform services on our behalf (e.g., payment
                  processing, email delivery).
                </p>
                <h3>2. Legal Requirements:</h3>
                <p>
                  We may disclose your information if required by law or in
                  response to valid requests by public authorities.
                </p>

                <h2>Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures
                  to protect your personal information against unauthorized
                  access, loss, or misuse. These measures include encryption,
                  access controls, and regular security assessments.
                </p>

                <h2>Data Retention</h2>
                <p>
                  We retain your personal information for as long as necessary
                  to fulfill the purposes outlined in this policy, comply with
                  legal obligations, resolve disputes, and enforce our
                  agreements.
                </p>

                <h2>Your Rights</h2>
                <h3>1. Access and Correction:</h3>
                <p>
                  You have the right to access and update your personal
                  information.
                </p>
                <h3>2. Deletion:</h3>
                <p>
                  You can request the deletion of your personal information,
                  subject to certain legal and contractual restrictions.
                </p>
                <h3>3. Opt-Out:</h3>
                <p>
                  You can opt out of receiving promotional communications from
                  us at any time.
                </p>

                <h2>Changes to This Policy</h2>
                <p>
                  We may update this Data Privacy Policy from time to time. We
                  will notify you of any changes by posting the new policy on
                  our website. You are advised to review this policy
                  periodically for any changes.
                </p>

                <h2>Contact Us</h2>
                <p>
                  If you have any questions about this Data Privacy Policy,
                  please contact us at:
                </p>
                <div className="contact-info">
                  <p>
                    <strong>Email:</strong>{" "}
                    happyhomesrecreationalhubinc@gmail.com
                  </p>
                  <p>
                    <strong>Address:</strong> Masalukot 1, Candelaria,
                    Philippines
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
                  non-refundable reservation fee of 50% of the total package
                  price is required to secure your booking. The remaining 50% of
                  the total package price must be paid at least 7 days prior to
                  the reservation date.
                </p>

                <h2>Cancellation and Refunds</h2>
                <p>1. This reservation is non-refundable.</p>
                <p>
                  2. Date changes must be requested at least 14 days before the
                  event.
                </p>
                <p>
                  3. A date change fee of 15% of the contract rate applies for
                  date changes requested after the 14-day period.
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
                  Check-in time strictly follows the reservation details, and
                  requests for early check-in or late check-out are subject to
                  availability, with potential additional charges.
                </p>

                <h2>Security Deposit</h2>
                <p>
                  A security deposit may be required upon check-in to cover any
                  damages or excessive cleaning costs. This deposit will be
                  refunded upon check-out after a satisfactory inspection of the
                  premises.
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
                  areas. Any damage caused by guests will be charged
                  accordingly.
                </p>

                <h2>Pets</h2>
                <p>
                  Pets are allowed but must be supervised by the owner and are
                  not allowed on the poolside and on the beds.
                </p>

                <h2>Alcohol and Smoking</h2>
                <p>
                  Consumption of alcohol is allowed for guests of legal drinking
                  age. Smoking is only permitted in designated smoking areas.
                  Please dispose of cigarette butts responsibly.
                </p>

                <h2>Liability</h2>
                <p>
                  Happy Homes Recreational Hub Inc. is not responsible for any
                  loss, theft, or damage to personal belongings during your
                  stay.
                </p>
                <p>
                  Happy Homes Recreational Hub Inc. does not assume liability in
                  the event of the failure to provide services by utility
                  providers, such as a brownout or any other disruption in
                  utility services. Such occurrences are beyond the control of
                  Happy Homes Recreational Hub Inc.
                </p>

                <h2>Indemnification</h2>
                <p>
                  Guests are fully responsible for their actions and agree to
                  indemnify and hold Happy Homes Recreational Hub Inc. harmless
                  against any claims, damages, or liabilities arising from their
                  stay.
                </p>

                <h2>Right to Refuse Service</h2>
                <p>
                  Happy Homes Recreational Hub Inc. reserves the right to refuse
                  service or evict any guest who violates these terms and
                  conditions or disrupts the peaceful enjoyment of other guests.
                </p>

                <p>
                  By making a reservation at Happy Homes Recreational Hub Inc.,
                  you acknowledge and agree to abide by these terms and
                  conditions. Failure to comply may result in the cancellation
                  of your reservation and additional charges.
                </p>
              </div>
            </Modal>

            <div className="flex flex-col gap-2">
              <Checkbox
                {...register("termsAndConditions")}
                error={errors.termsAndConditions?.message}
              >
                I agree to the{" "}
                <span
                  onClick={openTermsAndConditions}
                  className="text-blue-500"
                >
                  Terms and conditions
                </span>
              </Checkbox>

              <Checkbox
                {...register("dataPrivacyPolicy")}
                error={errors.dataPrivacyPolicy?.message}
              >
                I agree to the{" "}
                <span onClick={openDataPrivacyPolicy} className="text-blue-500">
                  Data privacy policy
                </span>
              </Checkbox>
            </div>

            <Button
              type="submit"
              isDisabled={isSubmitting || isSignupSuccess}
              isLoading={isSubmitting}
              color={isSignupSuccess ? "success" : "primary"}
              className="w-full sm:w-80 mx-auto"
            >
              {isSignupSuccess ? "Successfully registered" : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
