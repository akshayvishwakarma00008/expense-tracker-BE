const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err?.message,
    stack: process.env.NODE_ENV === "production" ? null : err?.stack,
  });
};

module.exports ={errorHandler};

//this code here will give custom error the user 
//- for which you to install a library called  express-async-handler