import jwt from "jsonwebtoken"

export function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers["authorization"]
        if (!authHeader) {
            return res.status(401).json({ error: "Token not provided" })
        }

        const [, token] = authHeader.split(" ")
        if (!token) {
            return res.status(401).json({ error: "Token malformed" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.auth = decoded

        next()
    } catch (error) {
        console.error(error)
        return res.status(401).json({ error: "Invalid or expired token" })
    }
}
