export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-heading font-bold mb-8">Shipping & Returns</h1>
      <div className="max-w-3xl space-y-6">
        <section>
          <h2 className="text-2xl font-heading font-semibold mb-4">Shipping Policy</h2>
          <p>We offer fast and secure shipping across India. Delivery typically takes 3-7 business days.</p>
        </section>
        <section>
          <h2 className="text-2xl font-heading font-semibold mb-4">Returns</h2>
          <p>We accept returns within 7 days of delivery. Items must be unused and in original packaging.</p>
        </section>
      </div>
    </div>
  );
}

