const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const whatsappApiUrl = process.env.WHATSAPP_API_URL;
const whatsappApiToken = process.env.WHATSAPP_API_TOKEN;
const phoneNumberId = process.env.PHONE_NUMBER_ID;

// Função para enviar botões interativos para o WhatsApp
async function sendWhatsAppButtons(userPhone) {
  const data = {
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": userPhone,
    "type": "interactive",
    "interactive": {
      "type": "button",
      "body": {
        "text": "Escolha uma opção"
      },
      "action": {
        "buttons": [
          {
            "type": "reply",
            "reply": {
              "id": "opcao1",
              "title": "Opção 1"
            }
          },
          {
            "type": "reply",
            "reply": {
              "id": "opcao2",
              "title": "Opção 2"
            }
          }
        ]
      }
    }
  };

  try {
    const response = await axios.post(
      `${whatsappApiUrl}/v13.0/${phoneNumberId}/messages`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${whatsappApiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Botões enviados com sucesso:', response.data);
  } catch (error) {
    console.error('Erro ao enviar botões:', error.response ? error.response.data : error.message);
  }
}

// Webhook que recebe as requisições do Dialogflow
app.post('/webhook', async (req, res) => {
  const intentName = req.body.queryResult.intent.displayName;
  const userPhone = req.body.originalDetectIntentRequest.payload.data.from;

  if (intentName === 'exemplo-intent') {
    await sendWhatsAppButtons(userPhone);
  }

  res.json({
    fulfillmentText: "Mensagem recebida, botões enviados!"
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
