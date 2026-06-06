import nodemailer from 'nodemailer';

// Create central transporter using environment settings
const getTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn("⚠️ SMTP Credentials (SMTP_USER/SMTP_PASS) not configured in .env. Email delivery will be skipped.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // True for 465, false for 587
    auth: { user, pass }
  });
};

// Generic send helper
export async function sendEmail({ to, subject, html }) {
  try {
    const transporter = getTransporter();
    if (!transporter) return false;

    const from = process.env.EMAIL_FROM || '"Bhayeli Jaipur" <info@bhayeli.com>';
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html
    });

    console.log(`✉️ Email sent successfully: ${info.messageId} to ${to}`);
    return true;
  } catch (err) {
    console.error(`❌ Email delivery failed:`, err);
    return false;
  }
}

// Styling Constants
const CSS_TEMPLATE = `
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f0e8; color: #1a1a2e; margin: 0; padding: 20px; }
  .wrapper { max-w: 600px; margin: 0 auto; background-color: #FFF8EE; border: 1px solid #e5dfd5; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
  .header { bg-color: #1a1a2e; background: #1a1a2e; padding: 30px 20px; text-align: center; border-bottom: 3px solid #bfa15f; }
  .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; }
  .header p { color: #bfa15f; margin: 5px 0 0 0; font-size: 11px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; }
  .content { padding: 30px 20px; }
  .section-title { font-size: 11px; font-weight: bold; color: #bfa15f; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 15px; border-bottom: 1px solid #e5dfd5; padding-bottom: 5px; }
  .info-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
  .info-table td { padding: 10px 0; border-bottom: 1px solid #f2ece0; font-size: 13.5px; vertical-align: top; }
  .info-table td.label { width: 120px; color: #9c9588; font-weight: bold; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; }
  .info-table td.value { color: #1a1a2e; font-weight: 600; }
  .msg-box { background-color: #faf8f5; border: 1px solid #e5dfd5; border-radius: 12px; padding: 15px; font-size: 13.5px; line-height: 1.6; color: #1a1a2e; font-style: italic; white-space: pre-wrap; margin-bottom: 25px; }
  .items-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
  .items-table th { background-color: #faf8f5; border-bottom: 2px solid #e5dfd5; padding: 10px; text-align: left; font-weight: bold; color: #1a1a2e; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; }
  .items-table td { padding: 12px 10px; border-bottom: 1px solid #e5dfd5; vertical-align: middle; }
  .product-img { width: 40px; height: 40px; border-radius: 6px; object-fit: cover; border: 1px solid #e5dfd5; }
  .badge { display: inline-block; background-color: #bfa15f; color: #ffffff; font-size: 10px; font-weight: bold; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; margin-right: 5px; margin-bottom: 5px; }
  .badge-alt { display: inline-block; background-color: #1a1a2e; color: #ffffff; font-size: 10px; font-weight: bold; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; margin-right: 5px; margin-bottom: 5px; }
  .footer { bg-color: #faf8f5; padding: 20px; border-top: 1px solid #e5dfd5; text-align: center; font-size: 11px; color: #9c9588; }
  .footer a { color: #bfa15f; text-decoration: none; font-weight: bold; }
  .btn-action { display: inline-block; background-color: #1a1a2e; color: #ffffff; font-size: 12px; font-weight: bold; padding: 12px 25px; border-radius: 30px; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; margin-top: 15px; }
  .btn-action:hover { background-color: #bfa15f; }
`;

// Helper: formats info rows
const renderInfoRows = (fields) => {
  return fields
    .map(([label, val]) => `
      <tr>
        <td class="label">${label}</td>
        <td class="value">${val || '—'}</td>
      </tr>
    `).join('');
};

/* 
=========================================================================
1. CART INQUIRY EMAILS (Admin Alert & Customer Revert)
=========================================================================
*/
export async function sendInquiryEmails(inquiry) {
  const adminEmail = process.env.ADMIN_EMAIL || 'monika@bhayeli.com';

  // Build items rows
  const itemRows = inquiry.items && inquiry.items.length > 0
    ? inquiry.items.map(item => `
        <tr>
          <td>
            ${item.productImage ? `<img src="${item.productImage.startsWith('http') ? item.productImage : process.env.NEXT_PUBLIC_BASE_URL + item.productImage}" class="product-img" />` : '<div class="product-img" style="background:#eee;"></div>'}
          </td>
          <td>
            <strong>${item.productTitle}</strong>
          </td>
          <td>${item.moq || '—'}</td>
          <td>${item.quantity || 1}</td>
        </tr>
      `).join('')
    : '<tr><td colspan="4" style="text-align:center; color:#9c9588;">No products attached</td></tr>';

  // --- Admin Notification Email ---
  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${CSS_TEMPLATE}</style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>New Inquiry</h1>
          <p>Bhayeli Jaipur Admin</p>
        </div>
        <div class="content">
          <div class="section-title">Inquiry Information</div>
          <table class="info-table">
            ${renderInfoRows([
              ['Customer', inquiry.fullName],
              ['Company', inquiry.companyName],
              ['Email', inquiry.email],
              ['Phone', inquiry.phone],
              ['Country', inquiry.country],
              ['Website', inquiry.companyWebsite],
              ['Type', inquiry.inquiryType],
            ])}
          </table>

          ${inquiry.message ? `
            <div class="section-title">Customer Message</div>
            <div class="msg-box">${inquiry.message}</div>
          ` : ''}

          <div class="section-title">Products Inquired (${inquiry.items ? inquiry.items.length : 0})</div>
          <table class="items-table">
            <thead>
              <tr>
                <th style="width:50px;">Image</th>
                <th>Product</th>
                <th>MOQ</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
          </table>
          
          <center>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/inquiries" class="btn-action">Open Admin Panel</a>
          </center>
        </div>
        <div class="footer">
          <p>This is an automated notification from Bhayeli storefront.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // --- Customer Revert Receipt Email ---
  const customerHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${CSS_TEMPLATE}</style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>We Received Your Inquiry</h1>
          <p>Bhayeli Jaipur</p>
        </div>
        <div class="content">
          <p style="font-size: 14.5px; line-height: 1.6; color: #1a1a2e;">
            Dear ${inquiry.fullName},
          </p>
          <p style="font-size: 14.5px; line-height: 1.6; color: #1a1a2e; margin-bottom: 25px;">
            Thank you for reaching out to Bhayeli. We have successfully received your product inquiry. Our team is currently reviewing your requested items and will get back to you with pricing, samples, or quotation details within 24 to 48 business hours.
          </p>

          <div class="section-title">Items we are reviewing:</div>
          <table class="items-table">
            <thead>
              <tr>
                <th style="width:50px;">Image</th>
                <th>Product</th>
                <th>MOQ</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
          </table>

          <p style="font-size: 13px; color: #9c9588; margin-top: 30px; line-height: 1.5;">
            If you need to make changes to your request, please respond directly to this email or message us on WhatsApp.
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Bhayeli Jaipur. All rights reserved.</p>
          <p>Jaipur, Rajasthan, India | <a href="https://bhayeli.com">bhayeli.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Trigger both emails
  await Promise.all([
    sendEmail({ to: adminEmail, subject: `[New Inquiry] ${inquiry.fullName} - ${inquiry.companyName || 'B2B'}`, html: adminHtml }),
    sendEmail({ to: inquiry.email, subject: `We have received your Bhayeli inquiry`, html: customerHtml })
  ]);
}

/* 
=========================================================================
2. CUSTOM REQUEST INQUIRY EMAILS (Admin Alert & Customer Revert)
=========================================================================
*/
export async function sendCustomInquiryEmails(inquiry) {
  const adminEmail = process.env.ADMIN_EMAIL || 'monika@bhayeli.com';

  const formatList = (arr, altStyle = false) => {
    if (!arr || arr.length === 0) return '—';
    return arr.map(i => `<span class="${altStyle ? 'badge-alt' : 'badge'}">${i}</span>`).join('');
  };

  const imageAttachments = inquiry.referenceImages && inquiry.referenceImages.length > 0
    ? inquiry.referenceImages.map((img, idx) => `
        <a href="${img.startsWith('http') ? img : process.env.NEXT_PUBLIC_BASE_URL + img}" target="_blank" style="display:inline-block; margin: 5px; text-decoration:none;">
          <div style="width:80px; height:80px; border:1px solid #e5dfd5; border-radius:8px; overflow:hidden; background:#fff; text-align:center;">
            ${img.endsWith('.pdf') 
              ? '<span style="line-height:80px; font-weight:bold; color:#f43f5e; font-size:11px;">PDF</span>' 
              : `<img src="${img.startsWith('http') ? img : process.env.NEXT_PUBLIC_BASE_URL + img}" style="width:100%; height:100%; object-fit:cover;" />`}
          </div>
        </a>
      `).join('')
    : '<span style="color:#9c9588; font-style:italic;">No mockups uploaded</span>';

  // --- Admin Notification Email ---
  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${CSS_TEMPLATE}</style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>Custom Request</h1>
          <p>Bhayeli Jaipur Admin</p>
        </div>
        <div class="content">
          <div class="section-title">Contact Profile</div>
          <table class="info-table">
            ${renderInfoRows([
              ['Customer', inquiry.fullName],
              ['Company', inquiry.companyName],
              ['Email', inquiry.email],
              ['Phone', inquiry.phone],
              ['Country', inquiry.country],
              ['Website', inquiry.companyWebsite],
            ])}
          </table>

          <div class="section-title">Project Specifications</div>
          <table class="info-table">
            <tr>
              <td class="label">Interests</td>
              <td class="value">${formatList(inquiry.interests)}</td>
            </tr>
            <tr>
              <td class="label">Techniques</td>
              <td class="value">${formatList(inquiry.techniques, true)}</td>
            </tr>
            <tr>
              <td class="label">Quantity</td>
              <td class="value">${formatList(inquiry.quantities)}</td>
            </tr>
          </table>

          <div class="section-title">Design Specifications</div>
          <div class="msg-box">${inquiry.message}</div>

          <div class="section-title">Uploaded Mockups</div>
          <div style="margin-bottom:25px;">${imageAttachments}</div>
          
          <center>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/custom-inquiries" class="btn-action">Open Custom Dashboard</a>
          </center>
        </div>
        <div class="footer">
          <p>This is an automated custom inquiry alert from Bhayeli storefront.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // --- Customer Revert Receipt Email ---
  const customerHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${CSS_TEMPLATE}</style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>Custom Request Confirmed</h1>
          <p>Bhayeli Jaipur</p>
        </div>
        <div class="content">
          <p style="font-size: 14.5px; line-height: 1.6; color: #1a1a2e;">
            Dear ${inquiry.fullName},
          </p>
          <p style="font-size: 14.5px; line-height: 1.6; color: #1a1a2e; margin-bottom: 25px;">
            Thank you for choosing Bhayeli. We have received your customization order request. Our design consultants and production specialists are reviewing your uploaded specifications and mockups to ensure we can build it exactly to your standards.
          </p>

          <p style="font-size: 14.5px; line-height: 1.6; color: #1a1a2e; margin-bottom: 20px;">
            We will contact you via email or WhatsApp within 24 to 48 hours to discuss pricing details, fabric selection, and pattern sampling.
          </p>

          <div class="section-title">Reviewing Specifications:</div>
          <table class="info-table">
            <tr>
              <td class="label">Interested in</td>
              <td class="value">${formatList(inquiry.interests)}</td>
            </tr>
            <tr>
              <td class="label">Techniques</td>
              <td class="value">${formatList(inquiry.techniques, true)}</td>
            </tr>
            <tr>
              <td class="label">Quantity Tiers</td>
              <td class="value">${formatList(inquiry.quantities)}</td>
            </tr>
          </table>

          <div class="section-title font-bold">Your Project Notes:</div>
          <div class="msg-box">${inquiry.message}</div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Bhayeli Jaipur. All rights reserved.</p>
          <p>Jaipur, Rajasthan, India | <a href="https://bhayeli.com">bhayeli.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Trigger both emails
  await Promise.all([
    sendEmail({ to: adminEmail, subject: `[Custom Request] ${inquiry.fullName} - ${inquiry.companyName || 'Custom'}`, html: adminHtml }),
    sendEmail({ to: inquiry.email, subject: `Your Bhayeli Custom Request is Received`, html: customerHtml })
  ]);
}

/* 
=========================================================================
3. GENERAL SUPPORT CONTACT EMAILS (Admin Alert & Customer Revert)
=========================================================================
*/
export async function sendContactEmails(contact) {
  const adminEmail = process.env.ADMIN_EMAIL || 'monika@bhayeli.com';

  // --- Admin Notification Email ---
  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${CSS_TEMPLATE}</style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>New Contact Message</h1>
          <p>Bhayeli Jaipur Admin</p>
        </div>
        <div class="content">
          <div class="section-title">Contact Profile</div>
          <table class="info-table">
            ${renderInfoRows([
              ['Customer', contact.fullName],
              ['Company', contact.companyName],
              ['Email', contact.email],
              ['Phone', contact.phone],
              ['Country', contact.country],
              ['Website', contact.companyWebsite],
              ['Inquiry Type', contact.inquiryType],
            ])}
          </table>

          <div class="section-title">Customer Message</div>
          <div class="msg-box">${contact.message}</div>
          
          <center>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/contacts" class="btn-action">Open Contacts Panel</a>
          </center>
        </div>
        <div class="footer">
          <p>This is an automated support contact alert from Bhayeli storefront.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // --- Customer Revert Receipt Email ---
  const customerHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${CSS_TEMPLATE}</style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>Support Request Received</h1>
          <p>Bhayeli Jaipur</p>
        </div>
        <div class="content">
          <p style="font-size: 14.5px; line-height: 1.6; color: #1a1a2e;">
            Dear ${contact.fullName},
          </p>
          <p style="font-size: 14.5px; line-height: 1.6; color: #1a1a2e; margin-bottom: 25px;">
            Thank you for reaching out to us. We have received your contact message regarding <strong>${contact.inquiryType}</strong>.
          </p>
          
          <p style="font-size: 14.5px; line-height: 1.6; color: #1a1a2e; margin-bottom: 25px;">
            Our customer support representatives are looking into your query and will reply directly to your email address within 24 business hours.
          </p>

          <div class="section-title">Copy of Your Message:</div>
          <div class="msg-box">${contact.message}</div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Bhayeli Jaipur. All rights reserved.</p>
          <p>Jaipur, Rajasthan, India | <a href="https://bhayeli.com">bhayeli.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Trigger both emails
  await Promise.all([
    sendEmail({ to: adminEmail, subject: `[Contact Support] ${contact.fullName} - ${contact.inquiryType}`, html: adminHtml }),
    sendEmail({ to: contact.email, subject: `Your message has been received - Bhayeli Support`, html: customerHtml })
  ]);
}
