import { usePageMeta } from "../hooks/usePageMeta";

const ContactPlaceholder = () => (
  <span className="font-semibold text-amber-700 dark:text-amber-300">
    focushub.co.in@gmail.com
  </span>
);

const PrivacyPolicy = () => {
  usePageMeta(
    "Privacy Policy",
    "Read the FocusHub Privacy Policy, including information about accounts, task data, cookies, analytics, and advertising.",
  );

  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <header className="border-b border-gray-200 pb-8 dark:border-slate-800">
        <p className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
          Legal
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-gray-500 dark:text-slate-400">
          Last updated: August 31, 2026
        </p>
        <p className="mt-5 leading-7 text-gray-600 dark:text-slate-300">
          This policy explains how FocusHub handles information when you use the
          website and application. It reflects the features currently
          implemented in the application and should be reviewed with your own
          contact and operational details before launch.
        </p>
      </header>
      <div className="prose-content mt-10 space-y-10 leading-7 text-gray-700 dark:text-slate-300">
        <section>
          <h2>Information you provide</h2>
          <p>
            When you create an account, FocusHub collects your name, username,
            email address, and password. Passwords are stored as password hashes
            rather than readable passwords. The existing backend also includes a
            profile-image feature that uses Cloudinary if that feature is
            enabled in your deployed interface.
          </p>
          <p>
            If you use the contact form, FocusHub collects the name, email
            address, subject, and message you submit. Those messages are stored
            in the application database so they can be reviewed.
          </p>
        </section>
        <section>
          <h2>Task and application data</h2>
          <p>
            FocusHub stores the content you create in the application, including
            tasks, task priorities and tags, goals, completion information, and
            focus-timer records. This data is used to show your workspace,
            dashboard, activity records, and focus-related views.
          </p>
        </section>
        <section>
          <h2>Authentication and browser storage</h2>
          <p>
            FocusHub uses an HTTP-only session cookie to maintain an
            authenticated session. The browser may also store your theme
            preference and local focus-session or pending focus-save data in
            local storage so the interface and timer experience can continue to
            work as designed.
          </p>
        </section>
        <section>
          <h2>Analytics and performance measurement</h2>
          <p>
            The website includes Vercel Analytics and Vercel Speed Insights.
            These services are used to understand website usage and performance.
            Their handling of information is governed by their respective
            policies.
          </p>
        </section>
        <section>
          <h2>Advertising</h2>
          <p>
            FocusHub includes Google AdSense code. When Google ads are served,
            third-party vendors, including Google, may use cookies or similar
            technologies to serve and measure advertising based on visits to
            this and other websites, subject to the vendors’ own policies and
            settings. FocusHub does not claim control over those third-party
            technologies.
          </p>
        </section>
        <section>
          <h2>Payments and third-party services</h2>
          <p>
            Paid plan checkout is handled through Razorpay. FocusHub stores
            limited subscription and payment-order records needed by the
            application, such as plan information, order identifiers, payment
            identifiers, payment signatures, amounts, and payment status.
            FocusHub does not implement its own card-entry form. Profile-image
            uploads, when used, are handled through Cloudinary.
          </p>
        </section>
        <section>
          <h2>How information is used</h2>
          <p>
            Information is used to create and maintain accounts, operate the
            task, goal, focus, profile, billing, and contact features, respond
            to contact submissions, and understand basic site performance.
            FocusHub does not state that it sells personal information.
          </p>
        </section>
        <section>
          <h2>Data storage and security</h2>
          <p>
            Application records are stored in the MongoDB database configured
            for FocusHub. FocusHub uses authentication controls and password
            hashing in the current application, but no system can promise
            absolute security. Please do not submit sensitive information
            through the contact form.
          </p>
        </section>
        <section>
          <h2>Your account options</h2>
          <p>
            The existing backend supports profile updates and account deletion.
            Account deletion removes the user record and associated task, goal,
            and focus-timer records. Confirm how these options are exposed in
            your deployed interface and how contact messages and billing records
            are retained before publishing this policy.
          </p>
        </section>
        <section>
          <h2>Changes to this policy</h2>
          <p>
            FocusHub may update this policy as the product changes. The updated
            version will be posted on this page with a revised date.
          </p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>
            For privacy questions, contact <ContactPlaceholder />. This
            placeholder must be replaced with a monitored contact method before
            production use.
          </p>
        </section>
      </div>
    </article>
  );
};

export default PrivacyPolicy;
