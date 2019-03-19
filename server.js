const express=require("express")
const sequelize=require("sequelize")
const path=require('path')
const fs=require('fs')
const app=express()

/**     *************************         ***************    */

let courses={}
let course_location=path.join(__dirname,'/data/subjects.json')
//Courses Initialization
{
   fs.readFile(course_location,(err,data)=>{
       if(err)
         console.error(err)
       else courses=JSON.parse(data.toString());  
   })
}


/** *************** ***************** ****************  */

/**                     ********************                */

const db= new sequelize({
    dialect:'mysql',
    database:'sample',
    username:'root',
    password:'alkanagpal'
})


let subject
let query


function createtable(course)
{
 
 let obj={}
 obj['RollNo']=sequelize.INTEGER
 obj['Name']=sequelize.STRING
  for(let subjects of courses[course])
   {
     obj[subjects]= sequelize.STRING
   }
  subject=db.define('course',obj)
}

function addrow(obj)
{
   async function dbops(){
       await subject.sync()
       let table=await subject.create(obj)
   }
   dbops()
}

/**                     ********************                */




app.use(express.urlencoded({
    extended:true
}))

app.use(express.json())


//Get requests
{

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/main/index.html'))
})

app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/login'))
})

app.get('/main/courses',(req,res)=>{
    res.send(courses)
})

app.get('/table',(req,res)=>{
    db.query(`SELECT * FROM ${query}`,{type:sequelize.QueryTypes.SELECT})
            .then(data=>{console.log(data)})
    res.send({})        
})

}



//Post requests
{
app.post('/main/new',(req,res)=>{
    if(!courses[req.body.name])
    {
      courses[req.body.name]=[]
      updatesub()
    }
      console.log(courses)  
})
app.post('/main/courses',(req,res)=>{
    courses=req.body.courses;
    updatesub()
})

app.post('/main/createtable',(req,res)=>{
    course=req.body.course
    createtable(course)
})

app.post('/table',(req,res)=>{
    query=req.body.course
})

}



app.use(express.static(path.join(__dirname,"/public")))
app.listen(4000,()=>{
    console.log("Server Started at http://localhost:4000/")
})


//Add Subjects
function updatesub()
{
  fs.writeFile(course_location,JSON.stringify(courses),(err)=>{
      if(err)
        console.error(err)
  })
}