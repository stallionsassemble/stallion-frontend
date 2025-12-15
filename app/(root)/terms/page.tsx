export default function TermsPage() {
  return (
    <div className='container mx-auto px-4 py-12 md:py-20'>
      <div className='max-w-[1200px] mx-auto'>
        <div className='mb-12'>
          <h1 className='text-4xl md:text-6xl font-bold font-syne text-white mb-4'>
            Terms of Service
          </h1>
          <p className='text-gray-400 font-inter text-sm'>
            Last Modified: October 28, 2024
          </p>
        </div>

        <div className='flex flex-col lg:flex-row gap-12 relative'>
          {/* Main Content */}
          <div className='lg:w-2/3 space-y-12'>
            <p className='text-gray-300 font-inter leading-relaxed'>
              These Terms of Service ("Terms") constitute a legally binding
              agreement between you and Stallion Labs Ltd. ("Company", "we",
              "us", or "our") governing your access to and use of the Stallion
              platform and related services (collectively, the "Services").
            </p>
            <p className='text-gray-300 font-inter leading-relaxed'>
              Please read these Terms carefully before using our Services. By
              accessing or using any part of the Services, you agree to be bound
              by these Terms. If you do not agree to all the terms and
              conditions of this agreement, then you may not access the website
              or use any services.
            </p>

            {/* Section 1 */}
            <section id='agreement' className='scroll-mt-24'>
              <h2 className='text-xl font-bold text-white mb-4 font-syne'>
                1. Agreement to Terms.
              </h2>
              <div className='bg-[#007AFF3D] border border-primary/20 rounded-lg p-4 mb-6'>
                <p className='text-primary text-sm font-medium'>
                  By accessing or using our Services, you agree to be bound by
                  these Terms and our Privacy Notice.
                </p>
              </div>
              <div className='space-y-4 text-gray-300 font-inter text-sm leading-relaxed'>
                <p>
                  By accessing or using the Services, you confirm that you can
                  form a binding contract with Stallion, that you accept these
                  Terms and that you agree to comply with them. Your access to
                  and use of our Services is also subject to our Privacy Notice,
                  the terms of which can be found directly on the Platform.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id='use-of-services' className='scroll-mt-24'>
              <h2 className='text-xl font-bold text-white mb-4 font-syne'>
                2. Use of Services.
              </h2>
              <div className='bg-[#007AFF3D] border border-primary/20 rounded-lg p-4 mb-6'>
                <p className='text-primary text-sm font-medium'>
                  You agree to use the Services only for lawful purposes and in
                  accordance with these Terms.
                </p>
              </div>
              <div className='space-y-4 text-gray-300 font-inter text-sm leading-relaxed'>
                <p>
                  You represent and warrant that you are at least 18 years of
                  age and have the legal capacity to enter into this agreement.
                  You agree not to use the Services for any illegal or
                  unauthorized purpose, including but not limited to money
                  laundering, financing terrorism, or violating intellectual
                  property rights.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id='user-accounts' className='scroll-mt-24'>
              <h2 className='text-xl font-bold text-white mb-4 font-syne'>
                3. User Accounts and Security.
              </h2>
              <div className='bg-[#007AFF3D] border border-primary/20 rounded-lg p-4 mb-6'>
                <p className='text-primary text-sm font-medium'>
                  You are responsible for maintaining the security of your
                  wallet and account credentials.
                </p>
              </div>
              <div className='space-y-4 text-gray-300 font-inter text-sm leading-relaxed'>
                <p>
                  To access certain features of the Services, you may be
                  required to connect a digital wallet. You are solely
                  responsible for maintaining the confidentiality of your
                  private keys and for all activities that occur under your
                  account. Stallion is not liable for any loss or damage arising
                  from your failure to protect your wallet or account.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id='bounties' className='scroll-mt-24'>
              <h2 className='text-xl font-bold text-white mb-4 font-syne'>
                4. Bounties and Payments.
              </h2>
              <div className='bg-[#007AFF3D] border border-primary/20 rounded-lg p-4 mb-6'>
                <p className='text-primary text-sm font-medium'>
                  Stallion facilitates bounty payments but is not a party to the
                  agreement between bounty posters and hunters.
                </p>
              </div>
              <div className='space-y-4 text-gray-300 font-inter text-sm leading-relaxed'>
                <p>
                  Stallion provides a platform for users to post and claim
                  bounties. We do not guarantee the performance or quality of
                  work. Payments are executed via smart contracts on the
                  blockchain. You acknowledge that blockchain transactions are
                  irreversible and that Stallion has no control over the
                  execution of these transactions once initiated.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id='intellectual-property' className='scroll-mt-24'>
              <h2 className='text-xl font-bold text-white mb-4 font-syne'>
                5. Intellectual Property.
              </h2>
              <div className='bg-[#007AFF3D] border border-primary/20 rounded-lg p-4 mb-6'>
                <p className='text-primary text-sm font-medium'>
                  You retain ownership of your work, but grant us a license to
                  display it on the platform.
                </p>
              </div>
              <div className='space-y-4 text-gray-300 font-inter text-sm leading-relaxed'>
                <p>
                  Unless otherwise stated in a specific bounty agreement, you
                  retain all rights to the content you submit. By posting
                  content on Stallion, you grant us a non-exclusive, worldwide,
                  royalty-free license to use, display, and distribute your
                  content in connection with the Services.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id='prohibited' className='scroll-mt-24'>
              <h2 className='text-xl font-bold text-white mb-4 font-syne'>
                6. Prohibited Activities.
              </h2>
              <div className='bg-[#007AFF3D] border border-primary/20 rounded-lg p-4 mb-6'>
                <p className='text-primary text-sm font-medium'>
                  You agree not to engage in any activity that interferes with
                  or disrupts the Services.
                </p>
              </div>
              <div className='space-y-4 text-gray-300 font-inter text-sm leading-relaxed'>
                <p>You agree not to:</p>
                <ul className='list-disc pl-5 space-y-2'>
                  <li>Use the Services for any illegal purpose.</li>
                  <li>
                    Attempt to bypass or break any security mechanism on the
                    Services.
                  </li>
                  <li>Reverse engineer the Services or any part thereof.</li>
                  <li>
                    Use any bot, spider, or other automated means to access the
                    Services.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 7 */}
            <section id='disclaimers' className='scroll-mt-24'>
              <h2 className='text-xl font-bold text-white mb-4 font-syne'>
                7. Disclaimers.
              </h2>
              <div className='bg-[#007AFF3D] border border-primary/20 rounded-lg p-4 mb-6'>
                <p className='text-primary text-sm font-medium'>
                  The Services are provided "as is" without warranties of any
                  kind.
                </p>
              </div>
              <div className='space-y-4 text-gray-300 font-inter text-sm leading-relaxed'>
                <p>
                  THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE"
                  BASIS. WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND,
                  WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
                  IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                  PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id='liability' className='scroll-mt-24'>
              <h2 className='text-xl font-bold text-white mb-4 font-syne'>
                8. Limitation of Liability.
              </h2>
              <div className='bg-[#007AFF3D] border border-primary/20 rounded-lg p-4 mb-6'>
                <p className='text-primary text-sm font-medium'>
                  Our liability is limited to the extent permitted by law.
                </p>
              </div>
              <div className='space-y-4 text-gray-300 font-inter text-sm leading-relaxed'>
                <p>
                  IN NO EVENT SHALL STALLION LABS LTD. BE LIABLE FOR ANY
                  INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE
                  DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA,
                  USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR
                  ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE
                  SERVICES.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section id='changes' className='scroll-mt-24'>
              <h2 className='text-xl font-bold text-white mb-4 font-syne'>
                9. Changes to Terms.
              </h2>
              <div className='bg-[#007AFF3D] border border-primary/20 rounded-lg p-4 mb-6'>
                <p className='text-primary text-sm font-medium'>
                  We may update these Terms at any time.
                </p>
              </div>
              <div className='space-y-4 text-gray-300 font-inter text-sm leading-relaxed'>
                <p>
                  We reserve the right to modify or replace these Terms at any
                  time. If a revision is material we will try to provide at
                  least 30 days' notice prior to any new terms taking effect.
                  What constitutes a material change will be determined at our
                  sole discretion.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section id='contact' className='scroll-mt-24'>
              <h2 className='text-xl font-bold text-white mb-4 font-syne'>
                10. Contact Us.
              </h2>
              <div className='bg-[#007AFF3D] border border-primary/20 rounded-lg p-4 mb-6'>
                <p className='text-primary text-sm font-medium'>
                  If you have questions about these Terms, please contact us.
                </p>
              </div>
              <div className='space-y-4 text-gray-300 font-inter text-sm leading-relaxed'>
                <p>
                  If you have any questions about these Terms, please contact us
                  at: <br />
                  Stallion Labs Ltd. Email:{' '}
                  <a
                    href='mailto:legal@stallion.xyz'
                    className='text-primary hover:underline'
                  >
                    legal@stallion.xyz
                  </a>
                </p>
              </div>
            </section>
          </div>

          {/* Table of Contents - Desktop Only */}
          <div className='hidden lg:block lg:w-1/3 relative'>
            <div className='sticky top-24 space-y-2'>
              <h3 className='text-white font-bold mb-4 font-syne'></h3>
              <nav className='flex flex-col space-y-2 text-sm text-gray-400 font-inter'>
                <a
                  href='#agreement'
                  className='hover:text-primary transition-colors'
                >
                  1. Agreement to Terms
                </a>
                <a
                  href='#use-of-services'
                  className='hover:text-primary transition-colors'
                >
                  2. Use of Services
                </a>
                <a
                  href='#user-accounts'
                  className='hover:text-primary transition-colors'
                >
                  3. User Accounts
                </a>
                <a
                  href='#bounties'
                  className='hover:text-primary transition-colors'
                >
                  4. Bounties and Payments
                </a>
                <a
                  href='#intellectual-property'
                  className='hover:text-primary transition-colors'
                >
                  5. Intellectual Property
                </a>
                <a
                  href='#prohibited'
                  className='hover:text-primary transition-colors'
                >
                  6. Prohibited Activities
                </a>
                <a
                  href='#disclaimers'
                  className='hover:text-primary transition-colors'
                >
                  7. Disclaimers
                </a>
                <a
                  href='#liability'
                  className='hover:text-primary transition-colors'
                >
                  8. Limitation of Liability
                </a>
                <a
                  href='#changes'
                  className='hover:text-primary transition-colors'
                >
                  9. Changes to Terms
                </a>
                <a
                  href='#contact'
                  className='hover:text-primary transition-colors'
                >
                  10. Contact Us
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
