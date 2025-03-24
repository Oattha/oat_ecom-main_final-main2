const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = require("./prisma");
const jwt = require("jsonwebtoken");
// ใช้ค่า SECRET_KEY จาก .env
const secretKey = process.env.SECRET_KEY;

if (!secretKey) {
  console.error("SECRET_KEY is missing in .env");
  return; // หยุดทำงานหากไม่มี SECRET_KEY
}

// ใช้ค่า SECRET_KEY จาก .env

if (!secretKey) {
  console.error("SECRET_KEY is missing in .env");
  return; // หยุดทำงานหากไม่มี SECRET_KEY
}

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL, // ✅ ใช้ค่าจาก .env
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await prisma.user.findFirst({
                    where: { email: profile.emails[0].value }
                });

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            password: "",
                            role: "user"
                        }
                    });
                }

                // เซ็น JWT โดยใช้ SECRET_KEY ที่ถูกต้อง
                const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: "1d" });

                return done(null, { user, token });
            } catch (err) {
                return done(err, null);
            }
        }
    )
);



passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

module.exports = passport;
