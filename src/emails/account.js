const sgMail = require("@sendgrid/mail");

const sendGridAPI = process.env.SEND_GRID_API;

sgMail.setApiKey(sendGridAPI);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "gopinathkrm@gmail.com",
    subject: "Thanks for joining in",
    text: `welcome to the app ${name}. Hope you like it`,
  });
};

const cancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "gopinathkrm@gmail.com",
    subject: "Thanks for being with us",
    text: `Hi ${name}.Thanks for your feedback`,
  });
};

module.exports = {
  sendWelcomeEmail,
  cancelEmail,
};
