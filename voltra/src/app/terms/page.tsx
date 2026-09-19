import Footer1 from "../components/footer1";
import Navbar1 from "../components/navbar1";

export default function Terms() {
  return (
    <>
      <Navbar1 />

      <section className="max-w-5xl mx-auto py-12 sm:py-16 lg:py-20 px-5 sm:px-8">

        {/* HEADER */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-6 sm:mb-8">
          VOLTRA TERMS AND CONDITION
        </h1>

        {/* SUBHEADER */}
        <p className="text-lg sm:text-xl text-center text-text-secondary max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          These Terms of Service explain the rules and responsibilities
          that apply when you access and use the Voltra platform and
          its EV charging reservation services.
        </p>

        <div className="flex flex-col gap-10 sm:gap-12">

          {/* 1 */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              1. Acceptance of Terms
            </h2>

            <p className="text-justify sm:text-lg leading-7 sm:leading-8">
              By accessing or using Voltra, you agree to follow these
              Terms of Service. If you do not agree with these terms,
              you should not use the Voltra platform or its services.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              2. User Accounts
            </h2>

            <p className="text-justify sm:text-lg leading-7 sm:leading-8">
              Some Voltra features require you to create an account.
              You are responsible for providing accurate information
              and keeping your account credentials secure. You are also
              responsible for activities performed through your account.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              3. Charging Reservations
            </h2>

            <p className="text-justify sm:text-lg leading-7 sm:leading-8">
              Voltra allows users to find charging stations, view
              charging slot availability, and reserve available charging
              slots. Users are responsible for ensuring that their
              reservation details, including the selected station, slot,
              and charging time, are correct.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              4. Payments
            </h2>

            <p className="text-justify sm:text-lg leading-7 sm:leading-8">
              Certain charging reservations may require payment.
              Applicable prices and estimated charging costs will be
              displayed as part of the reservation process. Users are
              responsible for completing any required payment associated
              with their booking.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              5. User Responsibilities
            </h2>

            <p className="text-justify sm:text-lg leading-7 sm:leading-8">
              Users must use Voltra responsibly and must not attempt to
              misuse the platform, interfere with its operation, access
              another user's account, or use the service for unlawful
              activities.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              6. Service Availability
            </h2>

            <p className="text-justify sm:text-lg leading-7 sm:leading-8">
              We aim to provide accurate information about charging
              stations and slot availability. However, availability may
              change due to maintenance, technical issues, station
              conditions, or other circumstances outside our control.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              7. Changes to These Terms
            </h2>

            <p className="text-justify sm:text-lg leading-7 sm:leading-8">
              We may update these Terms of Service when necessary.
              Any changes will be reflected on this page, and continued
              use of Voltra after an update indicates acceptance of the
              updated terms.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              8. Contact Us
            </h2>

            <p className="text-justify sm:text-lg leading-7 sm:leading-8">
              If you have any questions about these Terms of Service,
              please contact us through the Voltra Contact page.
            </p>
          </div>

        </div>
      </section>

      <Footer1 />
    </>
  );
}