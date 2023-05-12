exports.Get404=(req,res,next)=>{
    res.render("404",{
        pageTitle:"404"
    });
}