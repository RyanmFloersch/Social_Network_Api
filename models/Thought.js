const {Schema, model} = require('mongoose');
const {reactionSchema} = require('./Reaction');

// Schema to create Thought model
const thoughtSchema = new Schema({
    thoughtText:{
        type:String,
        minLength: 1,
        maxLength: 128,
        required: true        
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    username:{
        type:String,
        required:true
    },
    reactions:[reactionSchema]
},
{
    toJSON:{
        virtuals:true
    },
    id:false
});

thoughtSchema
.virtual('reactionCount')
.get(async function(){
    return await this.reactions.length;
});

const Thought = model('thought', thoughtSchema);

module.exports = Thought;
