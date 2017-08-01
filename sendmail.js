var aws = require('aws-sdk');

aws.config.update({region: 'us-east-1'});

var ses = new aws.SES()

ses.sendEmail({
  Source: 'jha@aughey.com',
  Destination: { ToAddresses: ['jha@aughey.com'] },
  Message: {
    Subject: {
       Data: "This is a test message",
    },
    Body: {
       Text: {
          Data: "This is a test body in the message."
       }
    }
  }
},
function(err,data) {
console.log(err);
console.log(data);
});
