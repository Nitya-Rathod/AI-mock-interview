import arcjet, { tokenBucket } from "arcjet";
export const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    tokenBucket({
      mode: "LIVE",
      characteristics: ["userId"],
      refillRate: 5,
      interval: 5000,
      capacity: 10,
    }),
  ],
});
