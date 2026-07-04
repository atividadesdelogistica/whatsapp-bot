const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys')

const express = require('express')
const app = express()

// 🌐 PORTA (OBRIGATÓRIO PRA RENDER)
app.get('/', (req, res) => {
  res.send('Bot WhatsApp ativo 🚀')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Servidor rodando na porta ' + PORT)
})

// 🤖 BOT WHATSAPP
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth')

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update

    if (connection === 'open') {
      console.log('Bot conectado!')
    }

    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

      if (shouldReconnect) {
        console.log('Reconectando bot...')
        startBot()
      }
    }
  })

  // 👋 MENSAGEM DE BOAS-VINDAS NO GRUPO
  sock.ev.on('group-participants.update', async (data) => {
    if (data.action === 'add') {
      await sock.sendMessage(data.id, {
        text: `👋 *BEM-VINDO(A) A ABYSS KINGS!*

🌟 Seja bem-vindo ao grupo!

🎮 *HABILIDADES OBRIGATÓRIAS:*
✅ Alok
✅ Kelly
✅ Moco
✅ Maxim ou Leon

📌 Envie seu ID para participar.

🔥 Bom jogo!`
      })
    }
  })
}

startBot()