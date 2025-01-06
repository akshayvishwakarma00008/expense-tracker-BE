const notfound = (req,res,next)=>{
    const error = new Error(`Not found - ${req?.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = {notfound};


//this function handle error if user triees to enter the wrong route 
//it route is wrong it will throw an error that route desn't exist 