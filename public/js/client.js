const socket=io();
var username;
var chats=document.querySelector('.chat');
var usersList=document.querySelector('.user-list');
var usersCount=document.querySelector('.user-count');
var msgSend=document.querySelector('#msg-send');
var userMsg=document.querySelector('#user-msg');




do{
    username=prompt("Enter your name");
}while(!username);

/*calls when user join */
socket.emit("new-user",username);

/** User joined notification  */
socket.on('user-connected',(socket_name)=>{
    userStatus(socket_name,'joined');
});

function userStatus(name,status){
   let div=document.createElement("div");
   div.classList.add('user-join');
   let content='<p><b>'+name+'</b> '+status+' the chat</p>';
   div.innerHTML=content;
   chats.appendChild(div);
   chats.scrollTop=chats.scrollHeight;
}

/**user disconnect notification */
socket.on('user-disconnected',(user)=>{
    userStatus(user,'left')
});

/**user list and user count */

socket.on("user-list",(users)=>{
    usersList.innerHTML="";
    userArr=Object.values(users);
    for(i=0;i<userArr.length;i++){
        let p=document.createElement('p');
        p.innerHTML=userArr[i];
        usersList.appendChild(p);
    }
    usersCount.innerHTML=userArr.length;
});

/**message send */

msgSend.addEventListener('click',()=>{
    let data={
        user:username,
        msg:userMsg.value
    };
    if(userMsg.value!=''){
        appendMessage(data,'send');
        socket.emit('message',data)
        userMsg.value='';

    }
});

function appendMessage(data,status){
    let div=document.createElement('div');
    div.classList.add('message',status);
    let content='<h5>'+data.user+'</h5>'+'<p>'+data.msg+'</p>';
    div.innerHTML=content;
    chats.appendChild(div);
    chats.scrollTop=chats.scrollHeight;
}
socket.on('message',(data)=>{
    appendMessage(data,'recived');
})