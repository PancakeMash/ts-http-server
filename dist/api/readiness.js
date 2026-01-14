export function handlerReadiness(req, res) {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send("OK");
}
export function respondWithJSON(res, code, payload) {
    res.header("Content-Type", "application/json");
    res.status(code).json(payload);
}
export function isValidUUID(value) {
    if (typeof value !== "string")
        return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
}
