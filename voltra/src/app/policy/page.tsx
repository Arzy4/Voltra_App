import Footer1 from "../components/footer1";
import Navbar1 from "../components/navbar1";

export default function Policy(){

    return(
        <>
        <Navbar1 />

        <section className="max-w-5xl mx-auto py-12 sm:py-16 lg:py-20 px-5 sm:px-8">

            {/* HEADER */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-6 sm:mb-8">
                PRIVACY POLICY
            </h1>

            {/* SUBHEADER */}
            <p className="text-lg sm:text-xl text-center text-text-secondary max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
                Your privacy matters to us. This Privacy Policy explains how
                Voltra collects, uses, and protects your information when you
                use our platform.
            </p>

            <div className="flex flex-col gap-10 sm:gap-12">

                {/* 1 */}
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                        1. Information We Collect
                    </h2>

                    <p className="text-justify sm:text-lg leading-7 sm:leading-8">
                        Voltra may collect information you provide when creating
                        an account or using our services, including your name,
                        email address, phone number, booking information, and
                        other information necessary to provide our services.
                    </p>
                </div>

                {/* 2 */}
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                        2. How We Use Your Information
                    </h2>

                    <p className="text-justify sm:text-lg leading-7 sm:leading-8">
                        We use your information to manage your account, process
                        charging reservations, provide customer support, improve
                        our services, and maintain the security of the Voltra
                        platform.
                    </p>
                </div>

                {/* 3 */}
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                        3. Data Security
                    </h2>

                    <p className="text-justify sm:text-lg leading-7 sm:leading-8">
                        Voltra takes reasonable measures to protect your personal
                        information from unauthorized access, alteration,
                        disclosure, or loss.
                    </p>
                </div>

                {/* 4 */}
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                        4. Payment Information
                    </h2>

                    <p className="text-justify sm:text-lg leading-7 sm:leading-8">
                        Information related to payments may be processed when you
                        make a charging reservation. Voltra only uses payment
                        information as necessary to complete and manage
                        transactions.
                    </p>
                </div>

                {/* 5 */}
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                        5. Your Rights
                    </h2>

                    <p className="text-justify sm:text-lg leading-7 sm:leading-8">
                        You may request access to or correction of your personal
                        information and may request deletion of your information
                        where applicable.
                    </p>
                </div>

                {/* 6 */}
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                        6. Changes to This Policy
                    </h2>

                    <p className="text-justify sm:text-lg leading-7 sm:leading-8">
                        We may update this Privacy Policy when necessary.
                        Any changes will be reflected on this page.
                    </p>
                </div>

                {/* 7 */}
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                        7. Contact Us
                    </h2>

                    <p className="text-justify sm:text-lg leading-7 sm:leading-8">
                        If you have any questions about this Privacy Policy or
                        how your information is handled, please contact us
                        through the Voltra Contact page.
                    </p>
                </div>
            </div>
        </section>

        <Footer1 />
        </>
    );
}