import { usePageMeta } from "../hooks/usePageMeta";

const ContactPlaceholder = () => (
  <span className="font-semibold text-amber-700 dark:text-amber-300">
    focushub.co.in@gmail.com
  </span>
);

const Terms = () => {
  usePageMeta(
    "Terms and Conditions",
    "Read the Terms and Conditions for using the FocusHub web application.",
  );

  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <header className="border-b border-gray-200 pb-8 dark:border-slate-800">
        <p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
          Legal
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
          Terms and Conditions
        </h1>
        <p className="mt-4 text-sm text-gray-500 dark:text-slate-400">
          Last updated: August 31, 2026
        </p>
        <p className="mt-5 leading-7 text-gray-600 dark:text-slate-300">
          These terms are a practical starting point for a small web
          application. They require review and completion with your business
          details before production use.
        </p>
      </header>
      <div className="prose-content mt-10 space-y-10 leading-7 text-gray-700 dark:text-slate-300">
        <section>
          <h2>Acceptance of these terms</h2>
          <p>
            By accessing or using FocusHub, you agree to these Terms and
            Conditions. If you do not agree, do not use the service.
          </p>
        </section>
        <section>
          <h2>Use of the service</h2>
          <p>
            FocusHub provides tools for managing tasks, organizing goals,
            recording focus sessions, and viewing related progress information.
            You may use the service only for lawful purposes and in accordance
            with these terms.
          </p>
        </section>
        <section>
          <h2>User accounts</h2>
          <p>
            You are responsible for providing accurate account information and
            for keeping your sign-in credentials confidential. You are
            responsible for activity that occurs through your account. Notify
            FocusHub using the contact method below if you believe your account
            has been accessed without authorization.
          </p>
        </section>
        <section>
          <h2>Your responsibilities and content</h2>
          <p>
            You retain responsibility for the tasks, goals, profile details, and
            other content you submit to FocusHub. Do not submit content that is
            unlawful, infringes another person’s rights, contains malware, or
            interferes with the service or its users.
          </p>
        </section>
        <section>
          <h2>Acceptable use</h2>
          <p>
            You must not attempt to bypass authentication, probe or disrupt the
            service, use automated means in a way that impairs the service, or
            use FocusHub to distribute harmful or abusive material.
          </p>
        </section>
        <section>
          <h2>Plans and payments</h2>
          <p>
            FocusHub offers a free plan and may offer paid plans with different
            limits. Paid checkout is processed through Razorpay. Prices, plan
            limits, and availability may change; any applicable checkout details
            are shown before payment is submitted. Review your applicable
            payment and refund requirements with a qualified advisor before
            publishing.
          </p>
        </section>
        <section>
          <h2>Intellectual property</h2>
          <p>
            FocusHub’s interface, branding, code, and other service materials
            are protected by applicable intellectual-property laws. These terms
            do not transfer ownership of those materials to you. Your own task
            and goal content remains yours.
          </p>
        </section>
        <section>
          <h2>Service availability</h2>
          <p>
            FocusHub may change, maintain, pause, or discontinue parts of the
            service. The service is provided on an “as is” and “as available”
            basis. FocusHub does not promise uninterrupted or error-free
            operation.
          </p>
        </section>
        <section>
          <h2>Suspension and termination</h2>
          <p>
            FocusHub may suspend or terminate access when necessary to protect
            the service, comply with law, or address a breach of these terms.
            You may stop using the service at any time. The existing backend
            includes an account-deletion capability; confirm how it is exposed
            in your deployed interface.
          </p>
        </section>
        <section>
          <h2>Disclaimers and limitation of liability</h2>
          <p>
            FocusHub is a productivity tool, not professional, legal, financial,
            medical, or other specialist advice. To the extent permitted by
            applicable law, FocusHub is not liable for indirect, incidental,
            special, consequential, or punitive damages arising from use of the
            service. This section should be reviewed for your jurisdiction
            before publication.
          </p>
        </section>
        <section>
          <h2>Changes to these terms</h2>
          <p>
            FocusHub may update these terms as the service changes. The latest
            version will be posted here with an updated date. Continued use
            after an update means you accept the updated terms.
          </p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>
            Questions about these terms can be sent to <ContactPlaceholder />.
            Replace this placeholder with a monitored support email before
            production use.
          </p>
        </section>
      </div>
    </article>
  );
};

export default Terms;
