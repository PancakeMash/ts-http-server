import { makeJWT } from "./auth.js";
import { getRefreshTokenByToken, revokeRefreshToken } from "./db/queries/refreshTokens.js";
import { config } from "./config.js";
import { getBearerToken } from "./auth.js";
export async function handlerRefreshToken(req, res) {
    const refreshTokenHeader = getBearerToken(req);
    const currentDate = new Date();
    const storedToken = await getRefreshTokenByToken(refreshTokenHeader);
    if (!storedToken || currentDate > storedToken.expiresAt || storedToken.revokedAt) {
        return res.status(401).json({ error: "Invalid or expired refresh token" });
    }
    const newToken = makeJWT(storedToken.userId, 3600, config.secretKey);
    return res.status(200).json({
        token: newToken
    });
}
export async function handlerRevokeToken(req, res) {
    const refreshTokenHeader = getBearerToken(req);
    const currentDate = new Date();
    const revokeToken = await revokeRefreshToken(refreshTokenHeader, currentDate);
    if (!revokeToken) {
        return res.status(400).json({ error: "Failed to revoke refresh token" });
    }
    return res.status(204).send();
}
