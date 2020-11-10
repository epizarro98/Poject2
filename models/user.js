'use strict';
const bcrypt = require('bcrypt')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.hasMany(models.mail)
    }
  };
  user.init({
    name: {
       type: DataTypes.STRING,
       allowNull: false,
       validate:{
         len: {
           args: [2,25],
           msg: 'Name must be 2-25 characters long.'
         }
       }
    },
    email: 
    {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true, 
          msg: "Please enter valid e-mail address."
        }
    }
  }, 
    password: {
      type: DataTypes.STRING,
      allowNull: false, 
      validate: {
        len: {
          args: [8,99], 
          msg: "passwprd must be betweeen 8 and 99 charcters"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'user',
  });
  
  //   user.addHook('beforeCreate', async (pendingUser, options)=>{
  //     await bcrypt.hash(pendingUser.password, 10)
  //   .then(hashedPassword=>{
  //     console.log(`${pendingUser.password} became ------> ${hashedPassword}`)
  //     //replace the original password with the hash 
  //     pendingUser.password = hashedPassword
  //   })
  // })
//same thing has above 

  user.addHook('beforeCreate', (pendingUser, option)=>{
    let hashedPassword = bcrypt.hashSync(pendingUser.password, 10)
    console.log(`${pendingUser.password} became ------> ${hashedPassword}`)
    pendingUser.password = hashedPassword

  })
  return user;
};