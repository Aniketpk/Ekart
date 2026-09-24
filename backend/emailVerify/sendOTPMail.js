export const sendOTPmail = async (email, otp) => {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "E-Kart <onboarding@resend.dev>",
        to: [email],
        subject: "E-Kart Password Reset OTP",
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>E-Kart Password Reset</h2>
            <p>Your OTP is:</p>

            <h1 style="letter-spacing: 5px;">
              ${otp}
            </h1>

            <p>This OTP is valid for a limited time.</p>

            <p>If you did not request this OTP, please ignore this email.</p>

            <br />

            <p>Regards,<br />E-Kart Team</p>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API Error:", data);
      throw new Error(data.message || "Failed to send OTP email");
    }

    console.log("OTP sent successfully:", data);

    return data;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};