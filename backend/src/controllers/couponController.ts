import { Request, Response } from "express";
import Coupon from "../models/Coupon";
import RoundRobinTracker from "../models/RoundRobinTracker";
import { v4 as uuidv4 } from "uuid";

const COOLDOWN_PERIOD_MS = 24 * 60 * 60 * 1000; // 24 hours

export const claimCoupon = async (req: Request, res: Response): Promise<void> => {
    let userIP = (req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "").split(",")[0].trim();

    // Normalize IPv6 localhost (::1) to IPv4 localhost (127.0.0.1)
    if (userIP === "::1") {
        userIP = "127.0.0.1";
    }

    let userSession = req.cookies["session_id"];
    if (!userSession) {
        userSession = uuidv4();
        res.cookie("session_id", userSession, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: COOLDOWN_PERIOD_MS, // Cookie expires in 24 hours
        });
    }

    console.log(userIP, userSession);

    // Check if the session ID is already associated with a different IP
    const existingSessionClaim = await Coupon.findOne({
        claimedBy: { $elemMatch: { sessionId: userSession } }
    });

    if (existingSessionClaim) {
        const lastSessionClaim = existingSessionClaim.claimedBy
            .filter(entry => entry.sessionId === userSession)
            .sort((a, b) => new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime())[0];

        if (lastSessionClaim) {
            const timeElapsed = Date.now() - new Date(lastSessionClaim.claimedAt).getTime();
            const timeLeft = COOLDOWN_PERIOD_MS - timeElapsed;

            // Prevent session reuse with different IP
            if (lastSessionClaim.ip !== userIP) {
                res.status(429).json({
                    message: "Session ID is already associated with a different IP.",
                    reason: "IP-Session Mismatch",
                    detectedIP: userIP,
                    registeredIP: lastSessionClaim.ip,
                    sessionId: userSession,
                    remainingTimeMs: timeLeft,
                    remainingTimeMinutes: Math.ceil(timeLeft / (60 * 1000)),
                });
                return;
            }

            // Check if session is still in cooldown
            if (timeLeft > 0) {
                res.status(429).json({
                    message: "You have already claimed a coupon from this browser session.",
                    reason: "Session Restriction",
                    remainingTimeMs: timeLeft,
                    remainingTimeMinutes: Math.ceil(timeLeft / (60 * 1000)),
                    sessionId: userSession,
                });
                return;
            }
        }
    }

    // Check if user has already claimed any coupon from this IP
    const existingClaim = await Coupon.findOne({
        claimedBy: { $elemMatch: { ip: userIP } }
    });

    if (existingClaim) {
        const lastClaim = existingClaim.claimedBy
            .filter(entry => entry.ip === userIP)
            .sort((a, b) => new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime())[0];

        if (lastClaim) {
            const timeElapsed = Date.now() - new Date(lastClaim.claimedAt).getTime();
            const timeLeft = COOLDOWN_PERIOD_MS - timeElapsed;

            if (timeLeft > 0) {
                res.status(429).json({
                    message: "You have already claimed a coupon from this IP.",
                    reason: "IP Restriction",
                    remainingTimeMs: timeLeft,
                    remainingTimeMinutes: Math.ceil(timeLeft / (60 * 1000)),
                    ip: userIP,
                });
                return;
            }
        }
    }

    // Get the last assigned index from tracker
    let tracker = await RoundRobinTracker.findOne();
    if (!tracker) {
        tracker = new RoundRobinTracker({ lastAssignedIndex: -1 });
        await tracker.save();
    }

    // Get the next available coupon
    const coupons = await Coupon.find({ isActive: true, isClaimed: false }).sort({ createdAt: 1 });
    if (coupons.length === 0) {
        res.status(404).json({ message: "No available coupons at the moment." });
        return;
    }

    const nextIndex = (tracker.lastAssignedIndex + 1) % coupons.length;
    const coupon = coupons[nextIndex];

    // Update coupon claim history
    coupon.isClaimed = true;
    coupon.claimedBy.push({ ip: userIP, sessionId: userSession, claimedAt: new Date() });
    await coupon.save();

    // Update round-robin tracker
    tracker.lastAssignedIndex = nextIndex;
    tracker.updatedAt = new Date();
    await tracker.save();

    res.json({
        message: "Coupon claimed successfully!",
        coupon,
        sessionId: userSession,
    });
};
