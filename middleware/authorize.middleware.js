export function authorize(roles = []) {
    return (req, res, next) => {
        if (!req.auth || !roles.includes(req.auth.role)) {
            return res.status(403).json({ error: "Forbidden" })
        }
        next()
    }
}