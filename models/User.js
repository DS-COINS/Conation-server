const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 4
    },
    image: String,
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'Class',
    }],
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

// Bcrypt로 비밀번호 암호화
userSchema.pre('save', function( next ) {
    var user = this;

    // 비밀번호가 변경되었을 때에만 동작하도록 (다른 필드 X)
    if (user.isModified('password')) { 
        // 비밀번호를 암호화
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                // Store hash in your password DB.
                user.password = hash 
                next()   
            });
        });
    } else {
        next()
    }
    
})

userSchema.methods.comparePassword = function(plainPassword, cb) {

    //plainPassword:   암호화된비밀번호:  
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;

    // jsonwebtoken을 이용해 토큰 생성하기
    var token = jwt.sign(user._id.toHexString(), 'anystringisOK')
    // user._id + 'anystringisOK' = token
    // ->
    // 'anystringisOK' -> user._id

    user.token = token
    user.save(function(err,user) {
        if(err) return cb(err)
        cb(null, user)
    })

}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // user._id + 'anystringisOK' = token
    // 토큰을 decode 한다.
    // jsonwebtoken 문서의 vefiry 참고
    jwt.verify(token, 'anystringisOK', function(err, decoded) {
        // 유저 ID를 이용해서 유저를 찾은 후
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token }, function(err, user){

            if(err) return cb(err);
            cb(null, user);
        })
    })


}

const User = mongoose.model('User', userSchema)

module.exports = { User }