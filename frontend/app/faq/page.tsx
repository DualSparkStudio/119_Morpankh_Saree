export default function FAQPage() {
  const faqs = [
    {
      question: 'What is your return policy?',
      answer: 'We accept returns within 7 days of delivery for unused items in original packaging. Items must be in their original condition with all tags attached.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-7 business days across India. Express shipping (1-2 days) is available for select locations at an additional charge.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Currently, we ship only within India. We are working on expanding our shipping to international destinations soon.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI, net banking, and cash on delivery (COD) for orders within India.'
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order is shipped, you will receive a tracking number via email and SMS. You can use this tracking number to track your order on our website or the courier company\'s website.'
    },
    {
      question: 'Are the products authentic?',
      answer: 'Yes, all our products are 100% authentic and sourced directly from verified manufacturers and designers. We guarantee the authenticity of every product.'
    },
    {
      question: 'Can I exchange a product?',
      answer: 'Yes, you can exchange a product for a different size or color within 7 days of delivery, subject to availability. Items must be unused and in original packaging.'
    },
    {
      question: 'What if I receive a damaged product?',
      answer: 'If you receive a damaged or defective product, please contact us within 24 hours of delivery with photos. We will arrange for a replacement or full refund at no extra cost.'
    }
  ];

  return (
    <div className="min-h-screen bg-soft-cream py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-heading text-deep-indigo mb-12 text-center">Frequently Asked Questions</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-heading text-deep-indigo mb-3">{faq.question}</h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
