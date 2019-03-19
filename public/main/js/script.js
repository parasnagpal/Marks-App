$(()=>{
    let courses={}
    $.get('/main/courses',(data)=>{
        console.log(data);
        courses=data
        updatecourse()
    })


    //Addcourse logic
    $('#add_course').click(()=>{
        $('#new_course').html(
             $('<input>').attr('id','course_name')
               .keyup((e)=>{
                   if(e.keyCode==13)
                   {
                     $.post('/main/new',{
                         name:$('#course_name').val()
                     })
                     
                     addcourse($('#course_name').val(),true)
                   }
               })
        )
    })

    
    
    

    function addcourse(course_name,force)
    {
        let addcourse=false
       if(!courses[course_name] || force)
        {
           if(!force)
            courses[course_name]=[]
            let item=course_name
            let id=course_name
             $('.cards').append(
               $('<div>')
                  .attr('class','card m-3')
                  .attr('id',`_${item}`)
                  .append(
                      $('<h1>')
                        .text(`${item}`)
                        .attr('class','card-title')
                  )
                 
                  .append(
                    $('<ul>')
                     .attr('id',`${item}`)
                     .attr('class','card-body')
                ) 
                .append(
                    $('<input>')
                       .attr('type','text')
                       .hide()
                       .attr('id',`${id}_`)
                )
                .append( 
                    $('<button>')
                         .text('Edit')
                         .attr('class','btn btn-dark m-2')
                         .click((e)=>{
                            $(`#_${id} input`).show()
                             .keyup((e)=>{
                                 if(e.keyCode==13 )
                                   {
                                       appendlist(id,$(`#_${id} input`).val())
                                       courses[item].push($(`#_${id} input`).val())
                                       $.post('/main/courses',{
                                           courses:courses
                                       })
                                       $.post('/main/createtable',{
                                           course:item
                                       })
                                   }
                             })
                         })
                       
                )
                .append(
                    $('<button>')
                      .text('View')
                      .attr('class','btn btn-dark m-2')
                      .click(()=>{
                          ViewCourse(item)
                          $('#new_course').attr('style','float:unset !important;display:block;')
                                          
                      })
                )
             )
             .attr('style','width: 18rem; ')
             
       }

       function appendlist(id,val)
       {
           console.log("Appending")
         $(`#_${id} ul`)
           .append(`<li>${val}</li>`)
       }
      
      if(!force)
       for(let keys in courses)
       {
           for(let val of courses[keys])
           {
           console.log("Appeng")

               $(`#${keys}`)
               .html('')
               .append(`<li>${val}</li>`)
              
           }
       }
       
    }
    
    function updatecourse()
    {
        console.log("updatin")
        for(let course in courses)
        {
            console.log(courses[course])
            addcourse(course,true)
            updatesubs(course)
            
        }

        function updatesubs(course)
        {
            console.log(courses[course])
            for(let subject of courses[course])
            {
                $(`#${course}`).append(`<li>${subject}</li>`)
            }
        }
    }


    

    //ViewCourse :Student details
    function ViewCourse(course)
    {
       $.post('/table',{
           course
       })
       $.get('/table',(data)=>{
           console.log(data)
       })
       //Dom change
       $('#new_course').html('')
               .append(
                     $('<table class="table">')
                          .attr('id','table')
               )
        $('.cards').html('')       
        tablecreate(course)

    }

    function tablecreate(course)
    {
        let rowcount=0
        function tableAppend(){
            $('#table')
                  .append('<tr id="tr1"><th scope="col">Roll Number</th><th scope="col">Name</th></tr>')
            for(let subs of courses[course])
            
               $('#tr1').append(`<th scope="col">${subs}</th>`)
                  
        }
        tableAppend()

        $('body').append(
            $('<button>')
                .text('Add data')
                .attr('class','btn btn-dark m-2')
                .click(()=>{
                    $.post('/main/createtable',{
                        course
                    })
                    {
                        $('#table')
                         .append(`<tr id="tr_${rowcount++}"><td><input id='roll'></td><td><input id='name'></td></tr>`)
                         for(let subs of courses[course])
                                    $(`#tr_${rowcount-1}`).append(`<th><input id='sub_${subs}'></th>`)
                         $('body').append(
                                $(`<button class="push btn btn-dark m-2">`)
                                    .text('Push')
                                    .click(()=>{
                                        {
                                            //roll
                                              let roll=$('#roll').val()
                                            //name
                                              let name=$('#name').val()
                                              let sub={}
                                            for(let subs of courses[course])
                                                sub[subs]=$(`#sub_${subs}`).val()  
                                            console.log(sub)     
                                            $(`#tr_${rowcount-1}`).html('')    
                                                                  .append(
                                                                      $('<td>').text(`${roll}`)
                                                                  )
                                                                  .append(
                                                                      $(`<td>`).text(`${name}`)
                                                                  )
                                            for(let subs of courses[course])
                                              $(`#tr_${rowcount-1}`).append(`<td>${sub[subs]}</td>`)
                                             $('.push').hide() 
                                            
                                        }
                                    })
                         )
                    }
                })
        )
    }

})