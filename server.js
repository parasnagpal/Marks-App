const express=require("express")
const sequelize=require('sequelize')
const path=require('path')
const fs=require('fs')
const app=express()


const newtable=require('./mysql_ops/newtable')
const apptable=require('./mysql_ops/appendtable')

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

//let subject
let query

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

     newtable.db.query(`SELECT * from ${query}s`,{type:sequelize.QueryTypes.SELECT})
            .then(data=>{console.log(data)
               res.send(data)
             })
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
    
      newtable.newtable(req.body.name)
})


app.post('/main/courses',(req,res)=>{
    courses=req.body.courses;
    updatesub()
})

app.post('/main/addcol',(req,res)=>{
    apptable.addcol(req.body.table,req.body.col)
})




app.post('/main/rowdata',(req,res)=>{
    console.log(req.body)
    newtable.newrow(req.body.course,req.body)
})

app.post('/table',(req,res)=>{
    query=req.body.course
    subject=query
})

}



app.use(express.static(path.join(__dirname,"/public")))
app.listen(process.env.PORT||4000,()=>{
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