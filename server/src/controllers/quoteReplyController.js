const QuoteRequest = require('../models/QuoteRequest');
const asyncHandler = require('../utils/asyncHandler');
const sendEmail = require('../utils/sendEmail');

const formatMoney = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined || amount === '') return '—';
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 2,
    }).format(Number(amount));
  } catch {
    return `${currency} ${amount}`;
  }
};

exports.replyToQuote = asyncHandler(async (req, res) => {
  const quote = await QuoteRequest.findById(req.params.id);
  if (!quote) {
    return res.status(404).json({ success: false, message: 'Quote request not found' });
  }

  const {
    quotedPrice,
    currency = 'INR',
    priceNote = '',
    quoteDetails = '',
    deliveryDays = '',
    paymentTerms = '',
    validUntil = null,
    adminNotes = '',
    status = 'quoted',
    sendEmailToCustomer = true,
  } = req.body;

  quote.quotedPrice = quotedPrice === '' || quotedPrice === null ? null : Number(quotedPrice);
  quote.currency = currency || 'INR';
  quote.priceNote = priceNote;
  quote.quoteDetails = quoteDetails;
  quote.deliveryDays = deliveryDays;
  quote.paymentTerms = paymentTerms;
  quote.validUntil = validUntil || null;
  quote.adminNotes = adminNotes;
  quote.status = status || 'quoted';
  quote.quotedAt = new Date();

  let emailSent = false;
  if (sendEmailToCustomer && quote.email) {
    const productRows = (quote.products || [])
      .map(
        (p) =>
          `<tr><td style="padding:8px;border:1px solid #e5e7eb">${p.productName || 'Product'}</td><td style="padding:8px;border:1px solid #e5e7eb">${p.quantity || '—'}</td></tr>`
      )
      .join('');

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#2C3340">
        <h2 style="color:#0D7377;margin-bottom:8px">Your Quotation — Lotus Agritech</h2>
        <p>Dear ${quote.name},</p>
        <p>Thank you for your enquiry. Please find our quotation details below.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr>
            <td style="padding:10px;background:#F4F5F7;font-weight:bold">Quoted Price</td>
            <td style="padding:10px;background:#F4F5F7;font-size:18px;color:#0D7377;font-weight:bold">
              ${formatMoney(quote.quotedPrice, quote.currency)}
            </td>
          </tr>
          ${quote.priceNote ? `<tr><td style="padding:10px;border-top:1px solid #e5e7eb">Price note</td><td style="padding:10px;border-top:1px solid #e5e7eb">${quote.priceNote}</td></tr>` : ''}
          ${quote.deliveryDays ? `<tr><td style="padding:10px;border-top:1px solid #e5e7eb">Delivery</td><td style="padding:10px;border-top:1px solid #e5e7eb">${quote.deliveryDays}</td></tr>` : ''}
          ${quote.paymentTerms ? `<tr><td style="padding:10px;border-top:1px solid #e5e7eb">Payment terms</td><td style="padding:10px;border-top:1px solid #e5e7eb">${quote.paymentTerms}</td></tr>` : ''}
          ${quote.validUntil ? `<tr><td style="padding:10px;border-top:1px solid #e5e7eb">Valid until</td><td style="padding:10px;border-top:1px solid #e5e7eb">${new Date(quote.validUntil).toLocaleDateString('en-IN')}</td></tr>` : ''}
        </table>
        ${quote.quoteDetails ? `<p><strong>Additional details</strong></p><p style="white-space:pre-wrap">${quote.quoteDetails}</p>` : ''}
        ${
          productRows
            ? `<p><strong>Requested items</strong></p>
               <table style="width:100%;border-collapse:collapse">
                 <tr style="background:#5B6B8C;color:#fff"><th style="padding:8px;text-align:left">Product</th><th style="padding:8px;text-align:left">Qty</th></tr>
                 ${productRows}
               </table>`
            : ''
        }
        <p style="margin-top:24px">For questions, reply to this email or call us.</p>
        <p style="color:#6b7280;font-size:13px">Lotus Agritech · Building trust and steady flows, one pipe at a time.</p>
      </div>
    `;

    await sendEmail({
      to: quote.email,
      subject: `Quotation from Lotus Agritech — ${formatMoney(quote.quotedPrice, quote.currency)}`,
      html,
    });
    quote.emailSentAt = new Date();
    emailSent = true;
  }

  await quote.save();

  res.json({
    success: true,
    data: quote,
    message: emailSent
      ? 'Quotation saved and emailed to customer'
      : 'Quotation saved successfully',
  });
});
