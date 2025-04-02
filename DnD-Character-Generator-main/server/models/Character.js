const { Schema, model } = require('mongoose'); //defines the schema and model for the character

const characterSchema = new Schema({

        name: {
            type: String,
            required: true,
            trim: true
        },  
        class: {
            type: String,
            required: true,
        },
        race: {
            type: String,
            required: true,

        },
        level:{
            type: Number,
            required: true,
            default: 1,
            min:1,
            max:20
        },
        background:{
            type: String,
            required: true,
        },
        alignment:{
            type: String,
            required: true,
        },
        stats:{
            strength: Number,
            dexterity: Number,
            constitution: Number,
            intelligence: Number,
            wisdom: Number,
            charisma: Number
        },
        spells: [String], //spells in an array

        skills: [String], //skills in an array
             
        equipment:[String], //equipment in an array


        user: { //connects the user to who created the char
            type: Schema.Types.ObjectId, //mongos id format
            ref: 'User', //referenece the creator
            required: true
        } },{
            timestamps: true
        });

        const Character = model('Character', characterSchema);
        module.exports = Character;





        