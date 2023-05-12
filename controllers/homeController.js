exports.GetHome = (req, res) => {
    res.render("home/home", {
        pageTitle: "Home",
        homeActive: true
    })
}