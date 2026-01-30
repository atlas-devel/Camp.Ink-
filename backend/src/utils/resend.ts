import { Resend } from "resend";
import env from "./env";

const resend = new Resend(env.RESEND_API_KEY!);

export const sendOTPemail = async (
  receiver: string,
  otp: string,
  purpose: string,
) => {
  if (purpose === "RESET_PASSWORD") {
    try {
      const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [receiver],
        subject: "Reset Your Camp.ink Password",
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0;">
            <tr>
            <td style="padding: 40px 30px; border-bottom: 2px solid #000000;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #000000;">Camp.ink</h1>
            </td>
            </tr>
            <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #000000;">Reset Your Password</h2>
              <p style="margin: 0 0 30px 0; font-size: 15px; line-height: 24px; color: #4a4a4a;">
              Use this code to reset your password:
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding: 30px 0;">
                <div style="display: inline-block; padding: 16px 32px; background-color: #000000; border: 2px solid #000000; letter-spacing: 8px;">
                  <span style="font-size: 32px; font-weight: 700; color: #ffffff; font-family: 'Courier New', monospace;">${otp}</span>
                </div>
                </td>
              </tr>
              </table>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 22px; color: #6a6a6a;">
              This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.
              </p>
            </td>
            </tr>
            <tr>
            <td style="padding: 30px; background-color: #fafafa; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; font-size: 13px; line-height: 20px; color: #8a8a8a; text-align: center;">
              © ${new Date().getFullYear()} Camp.ink. All rights reserved.
              </p>
            </td>
            </tr>
          </table>
          </td>
        </tr>
        </table>
      </body>
      </html>
      `,
      });
      if (error) {
        console.log("Error sending email via Resend: ", error);
        throw new Error(error.message);
      }
      console.log("Email sent successfully via Resend: ", data);
      return data;
    } catch (error) {
      console.log("Error at send otp email: ", error);
      throw error;
    }
  } else if (purpose === "VERIFY_EMAIL") {
    try {
      const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [receiver],
        subject: "Camp.ink Account Verification",
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0;">
            <tr>
            <td style="padding: 40px 30px; border-bottom: 2px solid #000000;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #000000;">Camp.ink</h1>
            </td>
            </tr>
            <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #000000;">Verify Your Account</h2>
              <p style="margin: 0 0 30px 0; font-size: 15px; line-height: 24px; color: #4a4a4a;">
              Please use the following verification code to complete your registration:
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding: 30px 0;">
                <div style="display: inline-block; padding: 16px 32px; background-color: #000000; border: 2px solid #000000; letter-spacing: 8px;">
                  <span style="font-size: 32px; font-weight: 700; color: #ffffff; font-family: 'Courier New', monospace;">${otp}</span>
                </div>
                </td>
              </tr>
              </table>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 22px; color: #6a6a6a;">
              This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
              </p>
            </td>
            </tr>
            <tr>
            <td style="padding: 30px; background-color: #fafafa; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; font-size: 13px; line-height: 20px; color: #8a8a8a; text-align: center;">
              © ${new Date().getFullYear()} Camp.ink. All rights reserved.
              </p>
            </td>
            </tr>
          </table>
          </td>
        </tr>
        </table>
      </body>
      </html>
      `,
      });
      if (error) {
        console.log("Error Verifying account via Resend: ", error);
        throw new Error(error.message);
      }
      console.log("Account Verified successfull: ", data);
      return data;
    } catch (error) {
      console.log("Error at send otp email: ", error);
      throw error;
    }
  } else if (purpose === "ACCOUNT_VERIFIED") {
    try {
      const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [receiver],
        subject: "Welcome to Camp.ink!",
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0;">
        <tr>
        <td style="padding: 40px 30px; border-bottom: 2px solid #000000;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #000000;">Camp.ink</h1>
        </td>
        </tr>
        <tr>
        <td style="padding: 40px 30px;">
          <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding: 0 0 30px 0;">
            <div style="width: 64px; height: 64px; background-color: #000000; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
          <span style="font-size: 32px; color: #ffffff; line-height: 1; display: block; text-align: center;">✓</span>
            </div>
            </td>
          </tr>
          </table>
          <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #000000; text-align: center;">Account Verified Successfully!</h2>
          <p style="margin: 0 0 30px 0; font-size: 15px; line-height: 24px; color: #4a4a4a; text-align: center;">
          Your email has been confirmed and your account is now active.
          </p>
          <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 24px; color: #4a4a4a;">
          You can now log in and start exploring everything Camp.ink has to offer. We're excited to have you with us!
          </p>
          <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding: 20px 0 0 0;">
            <a href="#" style="display: inline-block; padding: 14px 36px; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 500; border-radius: 2px;">Get Started</a>
            </td>
          </tr>
          </table>
        </td>
        </tr>
        <tr>
        <td style="padding: 30px; background-color: #fafafa; border-top: 1px solid #e0e0e0;">
          <p style="margin: 0; font-size: 13px; line-height: 20px; color: #8a8a8a; text-align: center;">
          © ${new Date().getFullYear()} Camp.ink. All rights reserved.
          </p>
        </td>
        </tr>
          </table>
          </td>
        </tr>
        </table>
      </body>
      </html>
      `,
      });
      if (error) {
        console.log("Error sending verification success email: ", error);
        throw new Error(error.message);
      }
      console.log("Verification success email sent: ", data);
      return data;
    } catch (error) {
      console.log("Error at send verification success email: ", error);
      throw error;
    }
  }
};
