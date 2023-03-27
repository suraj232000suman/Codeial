const mongoose = require('mongoose');
const resetPasswordTokenSchema =new mongoose.Schema({
    user:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    accessToken:{
        type: String,
        default: 'abc',
        required: true
    },
    isValid: {
        type: Boolean,
        default: false,
        required: true
    }
},{
    timestamps: true
});

const ResetPassword = mongoose.model('ResetPassword',resetPasswordTokenSchema);
module.exports = ResetPassword;