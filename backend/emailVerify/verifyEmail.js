export const sendEmail = async (email, token) => {
    try {
        const verifyUrl = `${process.env.FRONTEND_URL}/verify/${token}`;

        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: "E-Kart <onboarding@resend.dev>",
                to: [email],
                subject: "E-Kart - Email Verification",
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h2>Welcome to E-Kart! 🛒</h2>

                        <p>Hi!</p>

                        <p>
                            Thank you for registering on E-Kart.
                            Please click the button below to verify your email address.
                        </p>

                        <p>
                            <a
                                href="${verifyUrl}"
                                style="
                                    display: inline-block;
                                    padding: 12px 20px;
                                    background: #1f2a8a;
                                    color: white;
                                    text-decoration: none;
                                    border-radius: 5px;
                                "
                            >
                                Verify My Email
                            </a>
                        </p>

                        <p>
                            Or copy this link into your browser:
                        </p>

                        <p>${verifyUrl}</p>

                        <p>
                            If you did not create this account, you can ignore this email.
                        </p>

                        <p>
                            Regards,<br />
                            E-Kart Team
                        </p>
                    </div>
                `,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Resend API Error:", data);
            throw new Error(data.message || "Failed to send verification email");
        }

        console.log("Verification email sent successfully:", data);

        return data;
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
    }
};