export const GenerateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  let expiry = new Date();

  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const onRequestOtp = async (otp: number, phone: string) => {
  const account_sid = process.env.ACCOUNT_SID;
  const auth_token = process.env.AUTH_TOKEN;
  const client = require("twilio")(account_sid, auth_token);

  const response = await client.messages.create({
    body: `your OTP is : ${otp}`,
    from: `+16562315686`,
    to: `+974${phone}`,
  });
  return response;
};
