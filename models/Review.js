const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = mongoose.Schema({
    user: {  // 후기 작성한 사용자
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    class: {  // 클래스
        type: Schema.Types.ObjectId,
        ref: 'Class'
    },
    content: {  // 내용
        type: String
    },
    image: {  // 후기 이미지
        type: String
    }
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = { Review }