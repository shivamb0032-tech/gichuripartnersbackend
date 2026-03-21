const generateFormEmailTemplate = ({
  formType = "Form Submission",
  name = "",
  email = "",
  phone = "",
  services = "",
  companyName = "",
  brandName = "Your Company",
  logoUrl = "",
}) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${formType}</title>
      </head>
      <body style="margin:0; padding:0; background:#f4f7fb; font-family:Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f7fb; padding:30px 12px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:720px; background:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.08);">
                
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,#273277,#d81141); padding:32px 24px; text-align:center;">
                    ${
                      logoUrl
                        ? `
                        <div style="display:inline-block; margin-bottom:14px;">
                          <img src="${logoUrl}" alt="${brandName}" style="
                            max-width:140px;
                            height:auto;
                            display:block;
                            background:#ffffff;
                            padding:10px 16px;
                            border-radius:10px;
                          " />
                        </div>
                        `
                        : `<div style="display:inline-block; padding:10px 18px; background:#ffffff; color:#273277; border-radius:10px; font-weight:700; margin-bottom:14px;">${brandName}</div>`
                    }

                    <h1 style="margin:0; font-size:28px; line-height:1.3; color:#ffffff; font-weight:700;">
                      ${formType}
                    </h1>

                    <p style="margin:10px 0 0; font-size:14px; line-height:1.6; color:#f3f4f6;">
                      A new form has been submitted on your website
                    </p>
                  </td>
                </tr>

                <!-- Intro -->
                <tr>
                  <td style="padding:28px 24px 12px 24px;">
                    <p style="margin:0; font-size:15px; color:#4b5563; line-height:1.8;">
                      Hello,
                    </p>
                    <p style="margin:10px 0 0; font-size:15px; color:#4b5563; line-height:1.8;">
                      You have received a new <strong>${formType}</strong>. The submitted details are below:
                    </p>
                  </td>
                </tr>

                <!-- Details Card -->
                <tr>
                  <td style="padding:12px 24px 24px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fafafa; border:1px solid #e5e7eb; border-radius:14px; overflow:hidden;">
                      <tr>
                        <td style="padding:14px 16px; width:180px; font-size:14px; font-weight:700; color:#273277; border-bottom:1px solid #e5e7eb;">
                          Name
                        </td>
                        <td style="padding:14px 16px; font-size:14px; color:#374151; border-bottom:1px solid #e5e7eb;">
                          ${name || "-"}
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:14px 16px; width:180px; font-size:14px; font-weight:700; color:#273277; border-bottom:1px solid #e5e7eb;">
                          Email
                        </td>
                        <td style="padding:14px 16px; font-size:14px; color:#374151; border-bottom:1px solid #e5e7eb;">
                          ${email || "-"}
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:14px 16px; width:180px; font-size:14px; font-weight:700; color:#273277; border-bottom:1px solid #e5e7eb;">
                          Phone
                        </td>
                        <td style="padding:14px 16px; font-size:14px; color:#374151; border-bottom:1px solid #e5e7eb;">
                          ${phone || "-"}
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:14px 16px; width:180px; font-size:14px; font-weight:700; color:#273277; border-bottom:${companyName ? "1px solid #e5e7eb" : "0"};">
                          Service
                        </td>
                        <td style="padding:14px 16px; font-size:14px; color:#374151; border-bottom:${companyName ? "1px solid #e5e7eb" : "0"};">
                          ${services || "-"}
                        </td>
                      </tr>

                      ${
                        companyName
                          ? `
                      <tr>
                        <td style="padding:14px 16px; width:180px; font-size:14px; font-weight:700; color:#273277; vertical-align:top;">
                          Company Name
                        </td>
                        <td style="padding:14px 16px; font-size:14px; color:#374151; line-height:1.8;">
                          ${companyName || "-"}
                        </td>
                      </tr>
                      `
                          : ""
                      }
                    </table>
                  </td>
                </tr>

                <!-- Note -->
                <tr>
                  <td style="padding:0 24px 24px 24px;">
                    <div style="background:#eef2ff; border-left:4px solid #273277; padding:14px 16px; border-radius:10px;">
                      <p style="margin:0; font-size:13px; color:#374151; line-height:1.7;">
                        Please review this submission and contact the user if needed.
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:18px 24px; text-align:center; background:#f9fafb; border-top:1px solid #e5e7eb;">
                    <p style="margin:0; font-size:12px; color:#6b7280; line-height:1.6;">
                      © ${new Date().getFullYear()} ${brandName}. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

module.exports = generateFormEmailTemplate;