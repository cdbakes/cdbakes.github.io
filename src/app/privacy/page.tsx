'use client';

import { motion } from "framer-motion";

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="mb-6">
            Last updated: January 29, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p>
              This website is a personal portfolio and blog site. I respect your privacy and aim to be transparent about any information that might be collected.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information Collection</h2>
            <p>
              This website does not directly collect any personal information. However, it uses the following third-party services that may collect anonymous usage data:
            </p>
            <ul className="list-disc ml-6 mt-2">
              <li>GitHub Pages for hosting</li>
              <li>Google reCAPTCHA for the contact form</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Form</h2>
            <p>
              When you use the contact form, the information you provide (name and email) is only used to respond to your message. This information is not stored or used for any other purpose.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Links</h2>
            <p>
              This website contains links to external sites (such as GitHub). This privacy policy applies to only this website, and you should refer to the respective privacy policies of those sites.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
            <p>
              This privacy policy may be updated occasionally. The date at the top of this page indicates when it was last revised.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p>
              If you have any questions about this privacy policy, you can contact me through the contact form on this website.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
