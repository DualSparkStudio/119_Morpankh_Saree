export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-soft-cream py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-heading text-deep-indigo mb-12 text-center">Privacy Policy</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-heading text-deep-indigo mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Your privacy is important to us. This Privacy Policy explains how Morpankh Saree collects, uses, and protects your personal information when you visit our website or make a purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading text-deep-indigo mb-4">Information We Collect</h2>
              <p className="text-gray-700 mb-3 leading-relaxed">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Name, email address, phone number, and shipping address</li>
                <li>Payment information (processed securely through our payment partners)</li>
                <li>Order history and preferences</li>
                <li>Communication preferences and feedback</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading text-deep-indigo mb-4">How We Use Your Information</h2>
              <p className="text-gray-700 mb-3 leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Send you order confirmations and shipping updates</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send you promotional emails (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Detect and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading text-deep-indigo mb-4">Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading text-deep-indigo mb-4">Cookies and Tracking</h2>
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading text-deep-indigo mb-4">Third-Party Services</h2>
              <p className="text-gray-700 leading-relaxed">
                We may share your information with trusted third-party service providers who assist us in operating our website, processing payments, and delivering orders. These parties are required to keep your information confidential.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading text-deep-indigo mb-4">Your Rights</h2>
              <p className="text-gray-700 mb-3 leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Access and update your personal information</li>
                <li>Request deletion of your personal data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading text-deep-indigo mb-4">Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading text-deep-indigo mb-4">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Email:</strong> privacy@morpankhsaree.com<br />
                <strong>Phone:</strong> +91 1234567890
              </p>
            </section>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last Updated: December 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

