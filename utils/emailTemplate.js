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

                    <h1 style="margin:0; font-size:26px; line-height:1.3; color:#ffffff; font-weight:700;">
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
                      You have received a new <strong>${formType}</strong>. Details are below:
                    </p>
                  </td>
                </tr>

                <!-- Details -->
                <tr>
                  <td style="padding:12px 24px 24px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fafafa; border:1px solid #e5e7eb; border-radius:14px; overflow:hidden;">
                      
                      ${row("Name", name)}
                      ${row("Email", email)}
                      ${row("Phone", phone)}
                      ${row("Service", services)}

                      ${
                        companyName
                          ? row("Company Name", companyName, true)
                          : ""
                      }

                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:18px 24px; text-align:center; background:#f9fafb; border-top:1px solid #e5e7eb;">
                    <p style="margin:0; font-size:12px; color:#6b7280;">
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

// 🔥 helper function (clean code)
function row(label, value, last = false) {
  return `
    <tr>
      <td style="padding:14px 16px; width:180px; font-size:14px; font-weight:700; color:#273277; border-bottom:${last ? "0" : "1px solid #e5e7eb"};">
        ${label}
      </td>
      <td style="padding:14px 16px; font-size:14px; color:#374151; border-bottom:${last ? "0" : "1px solid #e5e7eb"};">
        ${value || "-"}
      </td>
    </tr>
  `;
}

module.exports = generateFormEmailTemplate;