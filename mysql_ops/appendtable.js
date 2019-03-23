const sequelize=require('sequelize')


const db=new sequelize({
    dialect:'mysql',
    database:'sample',
    username:'root',
    password:'alkanagpal',
    logging:true,
    timestamps:false
})


async function dbops(tname,cname){
    db.define(`${tname}`)
    await db.sync()
    db.query(`ALTER TABLE ${tname}s DROP COLUMN createdAt`)
    db.query(`ALTER TABLE ${tname}s DROP COLUMN updatedAt`)
    db.query(`ALTER TABLE ${tname}s ADD  ${cname} INTEGER`)
}

module.exports={
    addcol:dbops
}