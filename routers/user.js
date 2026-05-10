const exprexs = require('express');
const router = exprexs.Router();


router.get('/users',(req,res)=>{

    // console.log(req.query.email);
    res.send('Hello World');
});

module.exports = router;