export default function PrivacyPage() {
  return (
    <div className='container mx-auto px-4 py-12 md:py-20'>
      <div className='max-w-[1200px] mx-auto'>
        <div className='mb-12'>
          <h1 className='text-4xl md:text-6xl font-bold font-syne text-foreground mb-4'>
            Privacy Notice
          </h1>
          <p className='text-muted-foreground font-inter text-sm'>
            Last Modified: November 28, 2024
          </p>
        </div>

        <div className='flex flex-col lg:flex-row gap-12 relative'>
          {/* Main Content */}
          <div className='lg:w-2/3 space-y-12'>
            <p className='text-muted-foreground font-inter leading-relaxed'>
              This Privacy Notice is designed to help you understand how
              Stallion Labs Ltd. ("Company", "we", "us", or "our") collects,
              uses, and shares your personal information, and to help you
              understand and exercise your privacy rights.
            </p>

            {/* Section 1 */}
            <section id='scope' className='scroll-mt-24'>
              <h2 className='text-xl font-bold text-foreground mb-4 font-syne'>
                1. Scope and updates to this privacy notice.
              </h2>
              <div className='bg-primary/20 border border-primary/20 rounded-lg p-4 mb-6'>
                <p className='text-primary text-sm font-medium'>
                  This Privacy Notice applies when we process your personal
                  information and is subject to change from time to time.
                </p>
              </div>
              <div className='space-y-4 text-muted-foreground font-inter text-sm leading-relaxed'>
                <p>
                  This Privacy Notice applies to personal information processed
                  by us, including on our websites, mobile applications, and
                  other online or offline offerings. To make this Privacy Notice
                  easier to read, our websites, mobile applications, and other
                  offerings are collectively called the "Services."
                </p>
                <p>
                  <strong>Changes to our Privacy Notice.</strong> We may revise
                  this Privacy Notice from time to time in our sole discretion.
                  If there are any material changes to this Privacy Notice, we
                  will notify you as required by applicable law. You understand
                  and agree that you will be deemed to have accepted the updated
                  Privacy Notice if you continue to use our Services after the
                  new Privacy Notice takes effect.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id='personal-info' className='scroll-mt-24'>
              <h2 className='text-xl font-bold text-foreground mb-4 font-syne'>
                2. Personal information we collect.
              </h2>
              <div className='bg-primary/20 border border-primary/20 rounded-lg p-4 mb-6'>
                <p className='text-primary text-sm font-medium'>
                  This Privacy Notice applies to information you provide
                  directly to us, information collected automatically from you,
                  and information collected from other third-party sources
                  (including public blockchains).
                </p>
              </div>
              <div className='space-y-4 text-muted-foreground font-inter text-sm leading-relaxed'>
                <p>
                  The categories of personal information we collect depend on
                  how you interact with our Services.
                </p>

                <h3 className='text-foreground font-bold mt-4'>
                  A. Information you provide to us directly.
                </h3>
                <p>
                  We may collect personal information that you provide to us.
                </p>
                <ul className='list-disc pl-5 space-y-2'>
                  <li>
                    <strong>Account Creation.</strong> When you create an
                    account, we collect your email address and public wallet
                    address.
                  </li>
                  <li>
                    <strong>Profile Data.</strong> If you customize your
                    account, we collect your username, bio, and linked social
                    media handles (e.g., Twitter, GitHub).
                  </li>
                  <li>
                    <strong>Communications.</strong> We may collect information
                    when you contact us for support, including the contents of
                    your messages.
                  </li>
                </ul>

                <h3 className='text-foreground font-bold mt-4'>
                  B. Information collected automatically.
                </h3>
                <p>
                  We may automatically collect personal information about your
                  interactions with our Services.
                </p>
                <ul className='list-disc pl-5 space-y-2'>
                  <li>
                    <strong>Device Data.</strong> We collect data about the
                    device and software you use to access our Services,
                    including IP address, browser type, and operating system.
                  </li>
                  <li>
                    <strong>Usage Data.</strong> We collect data regarding your
                    interaction with the Services, such as pages visited,
                    bounties viewed, and time spent on the platform.
                  </li>
                </ul>

                <h3 className='text-foreground font-bold mt-4'>
                  C. Information from third-party sources.
                </h3>
                <ul className='list-disc pl-5 space-y-2'>
                  <li>
                    <strong>Blockchain Data.</strong> We may collect and analyze
                    data related to your wallet address that is publicly
                    available on the blockchain (e.g., transaction history,
                    token balances) to verify eligibility for specific bounties.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section id='how-we-use' className='scroll-mt-24'>
              <h2 className='text-xl font-bold text-white mb-4 font-syne'>
                3. How we use your personal information.
              </h2>
              <div className='bg-[#007AFF3D] border border-primary/20 rounded-lg p-4 mb-6'>
                <p className='text-primary text-sm font-medium'>
                  We use your personal information to operate our Services,
                  improve the user experience, verify your eligibility for
                  bounties, and comply with legal obligations.
                </p>
              </div>
              <div className='space-y-4 text-gray-300 font-inter text-sm leading-relaxed'>
                <p>
                  We use the personal information we collect for the following
                  purposes:
                </p>
                <ul className='list-disc pl-5 space-y-2'>
                  <li>
                    <strong>To Provide Services.</strong> To authenticate your
                    identity via your wallet, display relevant bounties, and
                    facilitate your interaction with smart contracts.
                  </li>
                  <li>
                    <strong>To Improve Services.</strong> To analyze usage
                    trends and user behavior to optimize the platform interface
                    and infrastructure.
                  </li>
                  <li>
                    <strong>To Communicate.</strong> To send you technical
                    notices, security alerts, and administrative messages.
                  </li>
                  <li>
                    <strong>Security and Compliance.</strong> To detect and
                    prevent fraud, spam, hacking, or other malicious activity,
                    and to comply with legal obligations (such as OFAC sanctions
                    screening).
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section id='disclosure' className='scroll-mt-24'>
              <h2 className='text-xl font-bold text-white mb-4 font-syne'>
                4. How we disclose your personal information.
              </h2>
              <div className='bg-[#007AFF3D] border border-primary/20 rounded-lg p-4 mb-6'>
                <p className='text-primary text-sm font-medium'>
                  We may share your information with service providers who help
                  us operate, or if required by law. We do not sell your
                  personal data to advertisers.
                </p>
              </div>
              <div className='space-y-4 text-gray-300 font-inter text-sm leading-relaxed'>
                <p>
                  We disclose your personal information to the following
                  categories of recipients:
                </p>
                <ul className='list-disc pl-5 space-y-2'>
                  <li>
                    <strong>Service Providers.</strong> We work with third-party
                    service providers (e.g., hosting services like Vercel,
                    analytics providers like PostHog) who have access to your
                    information only to perform specific tasks on our behalf.
                  </li>
                  <li>
                    <strong>Legal Requirements.</strong> We may disclose your
                    information if we believe it is necessary to comply with a
                    law, regulation, valid legal process, or governmental
                    request.
                  </li>
                  <li>
                    <strong>Business Transfers.</strong> If we are involved in a
                    merger, sale of assets, financing, or acquisition, your
                    information may be transferred as part of that transaction.
                  </li>
                  <li>
                    <strong>Publicly.</strong> You acknowledge that your wallet
                    address and on-chain interactions (e.g., claiming a bounty)
                    are public by default on the blockchain and accessible to
                    anyone.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section id='rights' className='scroll-mt-24'>
              <h2 className='text-xl font-bold text-white mb-4 font-syne'>
                5. Your privacy choices and rights.
              </h2>
              <div className='bg-[#007AFF3D] border border-primary/20 rounded-lg p-4 mb-6'>
                <p className='text-primary text-sm font-medium'>
                  You have control over the information you provide. You can
                  update your profile or disconnect your wallet at any time,
                  though public blockchain data cannot be deleted.
                </p>
              </div>
              <div className='space-y-4 text-gray-300 font-inter text-sm leading-relaxed'>
                <p>
                  Depending on your jurisdiction, you may have specific rights
                  regarding your personal information:
                </p>
                <ul className='list-disc pl-5 space-y-2'>
                  <li>
                    <strong>Access and Correction.</strong> You can update your
                    profile information directly within the application
                    settings.
                  </li>
                  <li>
                    <strong>Disconnecting.</strong> You can stop using the
                    Services at any time by disconnecting your digital wallet.
                  </li>
                  <li>
                    <strong>Deletion.</strong> You may request that we delete
                    your off-chain personal data (such as your email or IP logs)
                    by contacting us. We cannot delete data that has been
                    written to the blockchain.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section id='international' className='scroll-mt-24'>
              <h2 className='text-xl font-bold text-white mb-4 font-syne'>
                6. International transfers of personal information.
              </h2>
              <div className='bg-[#007AFF3D] border border-primary/20 rounded-lg p-4 mb-6'>
                <p className='text-primary text-sm font-medium'>
                  We operate globally. Your information may be transferred to
                  and processed in countries other than your own, where data
                  protection laws may differ.
                </p>
              </div>
              <div className='space-y-4 text-gray-300 font-inter text-sm leading-relaxed'>
                <p>
                  Stallion is a global network. Your information may be
                  transferred to, stored, and processed in the United States or
                  other countries where our service providers maintain
                  facilities. By using the Services, you consent to the transfer
                  of your information to countries outside your country of
                  residence.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id='children' className='scroll-mt-24'>
              <h2 className='text-xl font-bold text-white mb-4 font-syne'>
                7. Children's information.
              </h2>
              <div className='bg-[#007AFF3D] border border-primary/20 rounded-lg p-4 mb-6'>
                <p className='text-primary text-sm font-medium'>
                  Our Services are not intended for anyone under the age of 18.
                  We do not knowingly collect data from children.
                </p>
              </div>
              <div className='space-y-4 text-gray-300 font-inter text-sm leading-relaxed'>
                <p>
                  The Services are intended for a general audience and are not
                  directed at children. If we become aware that we have
                  collected personal information from a child under the age of
                  18, we will take reasonable steps to delete such information
                  from our records.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id='retention' className='scroll-mt-24'>
              <h2 className='text-xl font-bold text-white mb-4 font-syne'>
                8. Retention.
              </h2>
              <div className='bg-[#007AFF3D] border border-primary/20 rounded-lg p-4 mb-6'>
                <p className='text-primary text-sm font-medium'>
                  We retain your personal information only as long as necessary
                  to provide the Services or as required by law.
                </p>
              </div>
              <div className='space-y-4 text-gray-300 font-inter text-sm leading-relaxed'>
                <p>
                  We retain personal information for the period necessary to
                  fulfill the purposes outlined in this Privacy Notice, unless a
                  longer retention period is required or permitted by law. For
                  example, we may retain wallet addresses associated with
                  illicit activity indefinitely to maintain the security of the
                  platform.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section id='supplemental' className='scroll-mt-24'>
              <h2 className='text-xl font-bold text-white mb-4 font-syne'>
                9. Supplemental notice for specific regions.
              </h2>
              <div className='bg-[#007AFF3D] border border-primary/20 rounded-lg p-4 mb-6'>
                <p className='text-primary text-sm font-medium'>
                  If you are a resident of California, the EEA, or the UK, you
                  may have additional rights under local laws like the CCPA or
                  GDPR.
                </p>
              </div>
              <div className='space-y-4 text-gray-300 font-inter text-sm leading-relaxed'>
                <ul className='list-disc pl-5 space-y-2'>
                  <li>
                    <strong>GDPR (Europe/UK).</strong> If you are located in the
                    EEA or UK, you have the right to request access to,
                    rectification of, or erasure of your personal data, as well
                    as the right to restrict or object to certain processing.
                  </li>
                  <li>
                    <strong>CCPA (California).</strong> If you are a California
                    resident, you have the right to know what personal
                    information we collect, request deletion, and opt-out of the
                    sale of personal information (though we do not sell your
                    data).
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 10 */}
            <section id='contact' className='scroll-mt-24'>
              <h2 className='text-xl font-bold text-foreground mb-4 font-syne'>
                10. Contact us.
              </h2>
              <div className='bg-primary/20 border border-primary/20 rounded-lg p-4 mb-6'>
                <p className='text-primary text-sm font-medium'>
                  If you have questions about this policy or wish to exercise
                  your rights, please reach out to our legal team.
                </p>
              </div>
              <div className='space-y-4 text-muted-foreground font-inter text-sm leading-relaxed'>
                <p>
                  If you have any questions about our privacy practices or this
                  Privacy Notice, or if you would like to exercise your rights,
                  please contact us at: <br />
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
              <h3 className='text-foreground font-bold mb-4 font-syne'></h3>
              <nav className='flex flex-col space-y-2 text-sm text-muted-foreground font-inter'>
                <a
                  href='#scope'
                  className='hover:text-primary transition-colors'
                >
                  1. Scope and updates
                </a>
                <a
                  href='#personal-info'
                  className='hover:text-primary transition-colors'
                >
                  2. Personal information we collect
                </a>
                <a
                  href='#how-we-use'
                  className='hover:text-primary transition-colors'
                >
                  3. How we use your information
                </a>
                <a
                  href='#disclosure'
                  className='hover:text-primary transition-colors'
                >
                  4. How we disclose information
                </a>
                <a
                  href='#rights'
                  className='hover:text-primary transition-colors'
                >
                  5. Your privacy choices
                </a>
                <a
                  href='#international'
                  className='hover:text-primary transition-colors'
                >
                  6. International transfers
                </a>
                <a
                  href='#children'
                  className='hover:text-primary transition-colors'
                >
                  7. Children's information
                </a>
                <a
                  href='#retention'
                  className='hover:text-primary transition-colors'
                >
                  8. Retention
                </a>
                <a
                  href='#supplemental'
                  className='hover:text-primary transition-colors'
                >
                  9. Supplemental notice
                </a>
                <a
                  href='#contact'
                  className='hover:text-primary transition-colors'
                >
                  10. Contact us
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
