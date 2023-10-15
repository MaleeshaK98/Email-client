document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  //document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit',send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(r) {

  // Show compose view and hide other views
  document.querySelector('#email-detail-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = r.length>0 ? r:'';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}
function show_mail(id){
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    // Print email
    console.log(email);
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#email-detail-view').style.display = 'block';
    document.querySelector('#email-detail-view').innerHTML = 
    `<ul class="list-group">
      <li class="list-group-item"><strong>From: </strong> ${email.sender}</li>
      <li class="list-group-item"><strong>To: </strong>${email.recipients}</li>
      <li class="list-group-item"><strong>TimeStamp: </strong>${email.timestamp}</li>
      <li class="list-group-item"><strong>Subject: </strong>${email.subject}</li>
      <li class="list-group-item">${email.body}</li>
      
    </ul>
    
    <button class="btn btn-sm btn-outline-primary" id="reply">reply</button>`

    document.querySelector('#reply').addEventListener('click',function(){
      compose_email(email.sender)

    })

    // ... do something else with email ...
  });
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-detail-view').style.display = 'none';
    fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      emails.forEach(email => {
        const newmail = document.createElement('div');
        newmail.className = 'list-group-item';
        
        newmail.innerHTML = `<h6>sender: ${email.sender}</h6>
        <h5>subject: ${email.subject}</h5>
        <p>${email.timestamp}</p>`;
        ///element.className = email.read ? 'read':'unread';
        newmail.addEventListener('click',function(){
          show_mail(email.id)
        });
        
        // newmail.addEventListener('click',()=>{
        //   fetch(`/emails/${email.id}`)
        //   .then(response => response.json())
        //   .then(email => {
        //       // Print email
        //       document.querySelector('#emails-view').style.display = 'none';
        //       document.querySelector('#compose-view').style.display = 'none';
        //       document.querySelector('#email-detail-view').style.display = 'block';
        //       document.querySelector('#email-detail-view').innerHTML = `<h6>sender: ${email.sender}</h6>
        //       <h5>subject: ${email.subject}</h5>
        //       <h6>${email.body}</h6>
        //       <p>${email.timestamp}</p>
        //       <button class="btn btn-sm btn-outline-primary" id="reply">reply</button>`;
              
        
              
              
              
        //       console.log(email);
        
        //       // ... do something else with email ...
        //   });
          
      //  });
        document.querySelector('#emails-view').append(newmail);
        
      });

      // ... do something else with emails ...
  });

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}
function send_email(event){
  event.preventDefault();
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent');
  });
  
}
