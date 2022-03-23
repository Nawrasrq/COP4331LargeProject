require('express');
require('mongodb');

//load user model
const User = require("./models/user.js");

//load meal model
//const meal = require("./models/meal.js");

//load secret code 
const secretCode = require("./models/secretCode.js");

// create reusable transporter object using the default SMTP transport
const nodemailer = require('nodemailer');
const testAccount = nodemailer.createTestAccount();
const transporter = nodemailer.createTransport({
    port: 587,  // true for 465, false for other ports
    host: "smtp.ethereal.email",
    secure: false,
    auth: {
        user: testAccount.user,
        pass: testAccount.pass,
    }   
});

exports.setApp = function ( app, client )
{
    //var token = require('./createJWT.js');

    //endpoints
    app.post('/api/register', async (req, res, next) =>{
        const { FirstName, LastName, Login, Password, Email, Birthday} = req.body; //, jwtToken  
        
        const crypto = require('crypto');
        const randomCode = crypto.randomBytes(8).toString('hex');

        var error = '';

        /*try{
          if( token.isExpired(jwtToken)){
            var r = {error:'The JWT is no longer valid', jwtToken: ''};
            res.status(200).json(r);
            return;
          }
        }
        catch(e){
          console.log(e.message);
        }
        */
    
        //create new user and verification code
        const newUser = new User({FirstName:FirstName, LastName:LastName, Login:Login, Password:Password, Email:Email, Birthday:Birthday, Verified:false});
        const newCode = new secretCode({Email:Email, Code: randomCode});

        try{
            //save new user in database
            newUser.save(); 

            //save new verification code
            newCode.save();
            
            //send verification email with url containing newUser:userId and newCode:randomCode
            const mailData = {
                from: 'nutritionappverification@nutritionapp.com',  // sender address
                to: Email,   // list of receivers
                subject: 'Verification Email',
                text: 'Click the url to verify your account',
                html: "nutrition-app-27.herokuapp.com/api/verifyuser/" + newUser[0].UserId + "/" + randomCode
            };

            transporter.sendMail(mailData, function (err, info) {
                if(err)
                  console.log(err);
                else
                  console.log(info);
            });
        }
        catch(e){
            error = e.toString();
        }

        //var refreshedToken = null;
        /*
        try{
            refreshedToken = token.refresh(jwtToken);
        }
        catch(e){
            console.log(e.message);
        }*/
        var ret = { error: error }; //, jwtToken: refreshedToken  
        res.status(200).json(ret);
    });

    app.post('/api/login', async (req, res, next) => {

        const { Login, Password } = req.body;
        error = '';

        const results = await User.find({Login:Login, Password:Password});
        
        var id = -1;
        var FirstName = '';
        var LastName = '';
        var Email = '';
        var Birthday = '';
        var Verified = false;

        //if user found
        if(results.length > 0 ){
            id = results[0].UserId;
            FirstName = results[0].FirstName;
            LastName = results[0].LastName;
            Email = results[0].Email;
            Birthday = results[0].Birthday;
            Verified = results[0].Verified;            
            
            //if user hasnt been verified through email
            if(Verified == false){
                error = "Account not verified, resending verification email";
                ret = {UserId:id, FirstName:FirstName, LastName:LastName, Email:Email, Birthday:Birthday, Verified:Verified, error:error };
                
                //generate random code
                const crypto = require('crypto');
                const randomCode = crypto.randomBytes(8).toString('hex');

                //save code to database
                const newCode = new secretCode({Email:Email, Code: randomCode});
                newCode.save();

                //send email
                const mailData = {
                    from: 'nutritionappverification@nutritionapp.com',  // sender address
                    to: Email,   // reciever
                    subject: 'Verification Email',
                    text: 'Click the url to verify your account',
                    html: "nutrition-app-27.herokuapp.com/api/verifyuser/" + id + "/" + randomCode
                };
                transporter.sendMail(mailData, function (err, info) {
                    if(err)
                      console.log(err);
                    else
                      console.log(info);
                });
            }
            else{
                try{
                    //const token = require("./createJWT.js");
                    //ret = token.createToken( id, fn, ln, Email, Birthday );

                    //user found, sending back data
                    ret = { UserId:id, FirstName:FirstName, LastName:LastName, Email:Email, Birthday:Birthday, Verified:Verified};
                }
                catch(e){
                    //failed to send back data
                    ret = {error:e.message};
                }
            }

        }
        //no user found
        else{
            var ret = {UserId:id, FirstName:FirstName, LastName:LastName, Email:Email, Birthday:Birthday, Verified:Verified, error:"error: Login/Password incorrect"};
        }

        res.status(200).json(ret);
    });

    app.get('/api/verifyuser/:UserId/:Code', async (req, res, next) => {
        const { UserId, Code } = req.params;
        const findUser = await User.find({UserId:UserId});
        
        error = '';
        Email = '';
        
        if(findUser.length > 0){
            Email = findUser[0].Email;
            const findCode = await secretCode.find({Email:Email, Code:Code});

            if(findCode.length > 0){
                const updateUser = await User.findOneAndUpdate({UserId:UserId}, {Verified:true});
            }
            else{
                error = "error: likely expired authorization code"
            }

        }
        else{
            error = "error: Couldn't find user"
        }

        ret = {error: error}
        res.status(200).json(ret);
    });

    app.post('/api/passwordresetrequest', async (req, res, next) => {
        const { Login } = req.body;
        const findUser = await User.find({UserId:UserId});
        
        error = '';

        //user found 
        if(findUser.length > 0){
            
        }

    });
    
}