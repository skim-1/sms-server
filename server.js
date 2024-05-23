const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
const PORT = process.env.PORT || 3000;

const NOTIFYRE_API_KEY = 'xvFze+KbxM6EtLJ0wR4viIJOxG9GjCX/4qXRIu9Z4gU';
const NOTIFYRE_API_URL = 'https://api.notifyre.com/send-sms';

// Dummy data - replace with actual database queries
const getRecipients = async () => {
  return [
    { phone: '+12817266900' },
    { phone: '+18328178850' },
    // Add more recipients
  ];
};

const sendSMS = async (phone, message) => {
  try {
    const response = await axios.post(NOTIFYRE_API_URL, {
      to: phone,
      message: message
    }, {
      headers: {
        'Authorization': `Bearer ${NOTIFYRE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return null;
  }
};

app.post('/send-mass-sms', async (req, res) => {
  const { message } = req.body;
  const recipients = await getRecipients();

  const results = await Promise.all(recipients.map(recipient => 
    sendSMS(recipient.phone, message)
  ));

  res.status(200).json({
    message: 'SMS sent successfully',
    results: results
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});