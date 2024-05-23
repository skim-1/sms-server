const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());

const notifyreApiUrl = process.env.NOTIFYRE_API_URL;

app.post('/typeform-webhook', (req, res) => {
  const phoneNumber = req.body.form_response.answers.find(
    (answer) => answer.field.ref === 'phone_number'
  ).text;

  const smsData = {
    Body: 'Thanks for filling out the form!',
    Recipients: [
      {
        type: 'mobile_number',
        value: phoneNumber,
      },
    ],
    From: process.env.NOTIFYRE_PHONE_NUMBER,
    AddUnsubscribeLink: true,
  };

  axios
    .post(notifyreApiUrl, smsData, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': process.env.NOTIFYRE_API_KEY,
      },
    })
    .then((response) => {
      console.log('SMS sent successfully:', response.data);
      res.status(200).json({ message: 'SMS sent successfully' });
    })
    .catch((error) => {
      console.error('Error sending SMS:', error.response.data);
      res.status(500).json({ error: 'Failed to send SMS' });
    });
});

app.post('/send-sms', (req, res) => {
  const { message, phoneNumbers } = req.body;

  const smsData = {
    Body: message,
    Recipients: phoneNumbers.map((phoneNumber) => ({
      type: 'mobile_number',
      value: phoneNumber,
    })),
    From: process.env.NOTIFYRE_PHONE_NUMBER,
    AddUnsubscribeLink: true,
  };

  axios
    .post(notifyreApiUrl, smsData, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': process.env.NOTIFYRE_API_KEY,
      },
    })
    .then((response) => {
      console.log('SMS sent successfully:', response.data);
      res.status(200).json({ message: 'SMS sent successfully' });
    })
    .catch((error) => {
      console.error('Error sending SMS:', error.response.data);
      res.status(500).json({ error: 'Failed to send SMS' });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});