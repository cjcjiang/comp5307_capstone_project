/**
 * This controller will show the homepage.
 */

/**
 * GET /
 * Home page.
 */
exports.show_homepage = (req, res) => {
    res.render('homepage.ejs');
};