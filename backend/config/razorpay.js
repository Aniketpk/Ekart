import Razorpay from "razorpay"

// Lazy singleton — created on first use so dotenv has already run
let _razorpayInstance = null;

const razorpayInstance = new Proxy({}, {
    get(_, prop) {
        if (!_razorpayInstance) {
            const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
            const keySecret = (process.env.RAZORPAY_SECRET || "").trim();
            if (!keyId || !keySecret) {
                throw new Error("Razorpay credentials missing. Check RAZORPAY_KEY_ID and RAZORPAY_SECRET in .env");
            }
            _razorpayInstance = new Razorpay({ key_id: keyId, key_secret: keySecret });
        }
        const value = _razorpayInstance[prop];
        return typeof value === "function" ? value.bind(_razorpayInstance) : value;
    }
});

export default razorpayInstance;