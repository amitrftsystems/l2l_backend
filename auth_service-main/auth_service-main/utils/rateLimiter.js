import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  max: 100000,
  windowMs: 60 * 60 * 1000,
  message: "You have reached your request limit!, please retry after 1 hour.",
});
