
$(document).ready(function(){
  $('#name_input').focus();
  $('#name_input').on('keydown keyup',function(){handleNameInputLimit(event)});
  $(document).on('keydown',function(){submitUsingEnterKey(event)});
  $('#create_room_submit_button').on('click',function(){
    $('#create_room_name_input_label').slideUp(100,function(){
      $('#create_room_name_input').slideUp(100,function(){
        $('#create_room_password_input_label').slideUp(100,function(){
          $('#create_room_password_input').slideUp(100,function(){
            $('#create_room_submit_button').slideUp(100,function(){
              $('#admin_field').slideDown(1000);
            });
          });
        });
      });
    });
  });
  $('#admin_create_room_submit_button').on('click',function(){
    createRoom();
  });
  $('#join_room_submit_button').on('click',function(){
    joinRoom();
  });
  $('#admin_go_back').on('click',function(){
    $('#admin_field').slideUp(1000,function(){
        $('#create_room_name_input_label').slideDown(100,function(){
          $('#create_room_name_input').slideDown(100,function(){
            $('#create_room_password_input_label').slideDown(100,function(){
              $('#create_room_password_input').slideDown(100,function(){
                $('#create_room_submit_button').slideDown(100);
              });
            });
          });
        });
    });
  });
});

function handleNameInputLimit(e) {
  nameInput=$('#name_input');
  if(nameInput.text().length>=20&&e.code!='Backspace') {
    e.preventDefault();
  }
}

function submitUsingEnterKey(e) {
  if(e.keyCode==13) {
    if($('#name_input').is(':focus')){
      $('#create_room_name_input').focus();
    }
    else
    if($('#create_room_name_input').is(':focus')||$('#create_room_password_input').is(':focus')){
      $('#create_room_submit_button').click();
    }
    else
    if($('#admin_pass_input').is(':focus')){
      createRoom();
    }
    else
    if($('#join_room_name_input').is(':focus')||$('#join_room_password_input').is(':focus')){
      joinRoom();
    }
  }
}

function createRoom() {
  username=$('#name_input').text();
  roomName=$('#create_room_name_input').val();
  roomPassword=$('#create_room_password_input').val();
  adminPassword=$('#admin_pass_input').val();
  createRoomParameters={username:username,roomName:roomName,roomPassword:roomPassword,adminPassword:adminPassword};
  $.ajax({
    url:'/createRoom',
    type:'POST',
    data:createRoomParameters,
    success:function(result){
      if(result!='') {
        $('#create_room_error_message').text(result);
        $('#create_room_error_message').css({'display':'inherit'});
      }
      else {
        window.location='./chat';
      }
    }
  });
}

function joinRoom(action) {
  username=$('#name_input').text();
  roomName=$('#join_room_name_input').val();
  roomPassword=$('#join_room_password_input').val();
  createRoomParameters={username:username,roomName:roomName,roomPassword:roomPassword};
  $.ajax({
    url:'/joinRoom',
    type:'POST',
    data:createRoomParameters,
    success:function(result){
      if(result!='') {
        $('#join_room_error_message').text(result);
        $('#join_room_error_message').css({'display':'inherit'});
      }
      else {
        window.location='./chat';
      }
    }
  });
}
