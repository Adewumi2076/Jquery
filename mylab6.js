var users=[];
var table;
table=$('#dataTable').DataTable({
"lengthMenu": [20,40,60,80,100]
});
jQuery.each( [ "put", "delete" ], function( i, method ) {
  jQuery[ method ] = function( url, data, callback, type ) {
    if ( jQuery.isFunction( data ) ) {
      type = type || callback;
      callback = data;
      data = undefined;
    }
    return jQuery.ajax({
      url: url,
      type: method,
      dataType: type,
      data: data,
      success: callback
    });
  };
});
function User(userId, id, title, body) {
  this.userId = userId;
  this.id = id;
  this.title = title;
  this.body= body;
  this.printAsTableRow = function() {
        return `<tr class="data-row" data-number="`+this.id+`">
        <td>`+this.userId+`</td>
        <td>`+this.id+`</td>
        <td>`+this.title+`</td>
        <td>`+this.body+`</td>
        <td><button data-number="`+this.id+`" class="edit btn btn-warning">Edit</button><button data-number="`+this.id+`" class="delete btn btn-danger">Delete</button></td>
      </tr>
      `;
  }
  this.updateUser=function(userId, id, title, body) {
    this.userId = userId;
    this.id = id;
    this.title = title;
    this.body= body;
  }
}
function displayTable(){
  
  table.destroy();
  $(".data-row").remove();
  for(i=0;i<users.length;i++){
    $("tbody").append(users[i].printAsTableRow());
  }
  table=$('#dataTable').DataTable({
  "lengthMenu": [ 20,40,60,80,100 ]
  });
}
function deleteUser(id){
      users =  users.filter(function(user) {
	   return user.id != id;
  });

}
$(document).ready(function(){
  $.get('https://jsonplaceholder.typicode.com/posts',function(data){
    console.log(data);
    for(i=0;i<data.length;i++){
      var newUser=new User (data[i]['userId'],data[i]['id'],data[i]['title'],data[i]['body']);
      users.push(newUser);
    }
    displayTable();

  });
  $(document).on("click",".delete",function(e){
    e.preventDefault();
    $('#confirm-delete').modal('show');
    console.log($(this).data("number"));
    $("#deleteBtn").attr("data-number",$(this).data("number"));
  });
  $(document).on("click","#deleteBtn",function(e){
    e.preventDefault();
    $("#confirm-delete").modal("hide");
    $.ajax({
      url: 'https://jsonplaceholder.typicode.com/posts/'+$(this).attr("data-number"),
      type: 'DELETE',
      success: function(result) {
          alert(" deleted successfuly");
      }
    });
    deleteUser($(this).data("number"));
    displayTable();
  });

  $(document).on("click",".edit",function(e){
    e.preventDefault();
    $("#userIdInput").val($(this).parent().parent().children().eq(0).text());
      $("#IdInput").val($(this).parent().parent().children().eq(1).text());
      $("#titleInput").val($(this).parent().parent().children().eq(2).text());
      $("#bodyInput").val($(this).parent().parent().children().eq(3).text());
    $("#actionInput").val("edit");
    $("#rownumInput").val($(this).parent().parent().data("number"));
  });
  $(document).on("submit","#inputForm", function(e){
    e.preventDefault();
    if($("#actionInput").val()=="add"){
      $.post("https://jsonplaceholder.typicode.com/posts/",
      {
        userId:$("#userIdInput").val(),
        Id:$("#IdInput").val(),
        title:$("#titleInput").val(),
        body:$("#bodyInput").val(),
        
      },
      function(data){
        var newUser=new User (data['userId'],data['id'],data['title'],data['body']);
        users.push(newUser);
        displayTable();
      }
    );

    } else if($("#actionInput").val()=="edit"){

      $.put('https://jsonplaceholder.typicode.com/posts/'+$("#rownumInput").val(),
      {
        userId:$("#UserIdInput").val(),
          Id:$("#IdInput").val(),
          title:$("#titleInput").val(),
          body:$("#bodyInput").val()
      },
      function(data){
        let obj = users.find((o, i) => {
          if (o.id ==$("#rownumInput").val()) {
            users[i].updateUser(data['userId'],data['id'],data['title'],data['body']);
            return true;
          }
        });
        displayTable();
      }
    );
    }
    $("#inputForm")[0].reset();
    $("#actionInput").val("add");
  });
});
