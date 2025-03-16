import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Allow 3 claims per IP in 5 minutes
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

export default limiter;
