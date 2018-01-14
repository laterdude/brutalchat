x="";
member_names_div=$('#member_names')[0];
pingSocket="";

$(document).ready(function(){
  $('.chat_type_area').focus();
  fetch_older_messages();
  $(document).on('keypress',function(){checkForEnter(event)});
  // create new connection as the page is loaded
  connection = new WebSocket('wss://'+window.location.hostname+':'+window.location.port);
  pingSocket=setInterval(function(){sendPingRequest();},50000);
  $('.small').on('mouseenter',function(e){
    content=this.children[0].innerHTML;
    $('#tooltip')[0].innerHTML=content;
    $('#tooltip').css({'display':'initial'});
    tooltipWidth=$('#tooltip').width();
    left=e.clientX-(tooltipWidth/2);
    $('#tooltip').css({'top':(e.clientY+20)+'px','left':left+'px'});
  });
  $('.small').on('mouseleave',function(e){
    $('#tooltip').css({'display':'none'});
  });
  connection.onmessage=function(msg){
    clearInterval(pingSocket);
    pingSocket=setInterval(function(){sendPingRequest();},50000);
    msg=JSON.parse(msg.data)
    if(msg.message_type=='message'){
      sender=msg.username;
      message=msg.message;
      display_message(sender,message);
    }
    else
    if(msg.message_type=='new user'){
      flag=1;
      new_user_name=msg.username;
      console.log(new_user_name);
      console.log('matching with ');
      for(i=0;i<$('#member_names').children().length;i++) {
        console.log($('#member_names').children()[i].innerHTML);
      }
      for(i=0;i<$('#member_names').children().length;i++) {
        if($('#member_names').children()[i].innerHTML==new_user_name) {
          flag=-1;
          break;
        }
      }
      if(flag==1)
      {
        var member=document.createElement('div');
        member.className='member';
        member.className+=' '+new_user_name;
        member.innerHTML=msg.username;
        $('#members_content').children()[0].innerHTML=parseInt($('#members_content').children()[0].innerHTML)+1;
        $('#member_names').append(member);
        $('#small_screen_members_content').append($(member).clone());
        if($('#user_content').text()==$('#member_names').children()[0].innerHTML) {
          send_message('','<span class="green">'+msg.username+' connected</span>');
        }
      }
    }
    else
    if(msg.message_type=='user exit'){
      for(i=0;i<$('#member_names').children().length;i++) {
        if($('#member_names').children()[i].innerHTML==msg.username) {
            $('#members_content').children()[0].innerHTML=parseInt($('#members_content').children()[0].innerHTML)-1;
            member_names_div.removeChild($('#member_names').children()[i]);
            $('#small_screen_members_content')[0].removeChild($('#small_screen_members_content').children()[i]);
            if($('#user_content').text()==$('#member_names').children()[0].innerHTML) {
              send_message('','<span class="red">'+msg.username+' disconnected</span>');
            }
          break;
        }
      }
    }
    else
    if(msg.message_type=='room delete'){
      $('#group_deleted').css({'display':'block'});
      setTimeout(function(){log_each_user_out()},1000);
    }
    else
    if(msg.message_type=='ping'){
      console.log('--------Ping request completed for '+msg.username+' -----------------');
    }
  }
  $('.send_chat').on('click',function(){
    send_message();
  });
  $('#exit,#small_screen_exit_icon').on('click',function(){
    leave_group();
  });
  $('#delete,#small_screen_delete_icon').on('click',function(){
    delete_group();
  });
});

function checkForEnter(e) {
  if(e.keyCode==13&&$('.chat_type_area').is(':focus')) {
    send_message();
  }
}

function display_message(sender,message) {
  username=$('#user_content').text();
  messageBox=document.createElement('div');
  messageBox.className='message_box';
  box=document.createElement('div');
  box.id='non_user_box';
  if(sender=='')
  {
    box.id='server_box'
  }
  else
  if(username==sender)
  {
    box.id='user_box';
  }
  var span1=document.createElement('span');
  var span2=document.createElement('span');
  span1.id='username';
  span1.innerHTML='<kbd>'+sender+'</kbd>';
  if(sender!='')
  {
    box.appendChild(span1);
  }
  span2.id='usermessage';
  if(sender!='')
  {
     $(span2).text(message);
  }
  else {
    span2.innerHTML=message;
  }
  box.appendChild(span2);
  messageBox.appendChild(box);
  $('#chatArea').append(messageBox);
  $('#chatArea')[0].scrollTop=$('#chatArea')[0].scrollHeight
}

function fetch_older_messages() {
  $.ajax({
    type:'POST',
    url:'/fetchMessages',
    success:function(result){
      result=JSON.parse(result);
      for(i=0;i<result.length;i++)
      {
        display_message(result[i].username,result[i].message);
      }
    }
  });
}

function send_message(username,message) {
  if(message==undefined&&username==undefined)  {
    message=$('.chat_type_area').val();
    username=$('#user_content').text();
  }
  roomName=$('#group_content').text();
  $('.chat_type_area').val('');
  $('.chat_type_area').focus();
  message_data={'username':username,'message':message,'roomName':roomName};
  $.ajax({
    type:'POST',
    url:'/sendMessage',
    data:message_data
  });
}

function leave_group() {
  $.ajax({
    type:'POST',
    url:'/exitChat',
    success:function(result){
      window.location='./';
    }
  });
}

function log_each_user_out() {
  $.ajax({
    type:'POST',
    url:'/logEachUserOut',
    success:function(result){
      window.location='./';
    }
  });
}

function delete_group() {
  $.ajax({
    type:'POST',
    url:'/deleteGroup',
  });
}

function sendPingRequest() {
  $.ajax({
    type:'POST',
    url:'/pingSocket'
  });
}
