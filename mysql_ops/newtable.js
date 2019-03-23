const sequelize=require('sequelize')

const db=new sequelize({
    dialect:'mysql',
    database:'sample',
    username:'root',
    password:'alkanagpal',
    logging:true,
    timestamps:false

})


async function createtable(tname,subjects)
{
     
        db.define(`${tname}`)
        await db.sync()
        db.query(`ALTER TABLE ${tname}s ADD name VARCHAR(255)`)
        db.query(`ALTER TABLE ${tname}s ADD roll INTEGER`)
        db.query(`ALTER TABLE ${tname}s DROP COLUMN createdAt`)
        db.query(`ALTER TABLE ${tname}s DROP COLUMN updatedAt`)
        for(let sub in subjects)
        {
            db.query(`ALTER TABLE ${tname}s ADD ${sub} INTEGER`)
        }
}

async function addrow(tname,data){
    console.log(data)
    table=db.define(tname)
    await db.sync()
    await createtable(tname,data.subjects)
    db.query(`INSERT INTO ${tname}s (name,roll) VALUES ('${data.name}',${data.roll})`)
    for(let subject in data.subjects)
      {
          db.query(`UPDATE ${tname}s SET ${subject}=${data.subjects[subject]} WHERE roll=${data.roll}`)
      }
}

async function fetchdata(query)
{
    db.define(`${query}s`)
    
    await db.sync() 
    await db.query(`SELECT * from ${query}s`,{type:sequelize.QueryTypes.SELECT})
            .then(data=>{
             })
    
    
    return query
}


module.exports={
    newtable:createtable,
    newrow:addrow,
    fetchdata,db
}