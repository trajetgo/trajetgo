module.exports = async (req, res, next) => {
    console.log(`[DEBUG] ${new Date().toISOString()}`);
    console.log(`[DEBUG] ${req.method} ${req.url}`);
    console.log('[DEBUG] Headers:', req.headers);
    console.log('[DEBUG] Body:', req.body);
    console.log('[DEBUG] Params:', req.params);
    console.log('[DEBUG] Query:', req.query);

    next(); // Pass control to the next function
};