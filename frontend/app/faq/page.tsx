export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-heading font-bold mb-8">Frequently Asked Questions</h1>
      <div className="max-w-3xl space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">What is your return policy?</h3>
          <p>We accept returns within 7 days of delivery for unused items in original packaging.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">How long does shipping take?</h3>
          <p>Standard shipping takes 3-7 business days across India.</p>
        </div>
      </div>
    </div>
  );
}

