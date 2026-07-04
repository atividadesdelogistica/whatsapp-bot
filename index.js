const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys')

const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Bot WhatsApp ativo 🚀')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log('Servidor rodando na porta ' + PORT)
})

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

      if (shouldReconnect) startBot()
    }
  })

  sock.ev.on('group-participants.update', async (data) => {
    if (data.action === 'add') {
      await sock.sendMessage(data.id, {
        text: `👋 BEM-VINDO(A)!

🎮 Habilidades obrigatórias:
✅ Alok
✅ Kelly
✅ Moco
✅ Maxim ou Leon`
      })
    }
  })

  setInterval(() => {
    console.log("bot ativo...")
  }, 30000)
}

startBot()
