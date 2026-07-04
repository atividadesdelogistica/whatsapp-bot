<<<<<<< HEAD
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys')

const express = require('express')
const app = express()

// 🌐 SERVIDOR (OBRIGATÓRIO PRA RENDER)
app.get('/', (req, res) => {
  res.send('Bot WhatsApp ativo 🚀')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
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

  // 🔌 CONEXÃO
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

  // 👋 ENTRADA NO GRUPO
  sock.ev.on('group-participants.update', async (data) => {
    if (data.action === 'add') {
      await sock.sendMessage(data.id, {
        text: `👋 *BEM-VINDO(A) A ABYSS KINGS!*

━━━━━━━━━━━━━━
🎮 *HABILIDADES OBRIGATÓRIAS*
✅ Alok
➡️ Cura / velocidade

✅ Kelly
➡️ Corrida rápida

✅ Moco
➡️ Marca inimigos

✅ Maxim
➡️ Cura rápida

ou

✅ Leon
➡️ Recuperação em combate

━━━━━━━━━━━━━━
📌 Envie seu ID para participar`
      })
    }
  })

  // 🔥 MANTER PROCESSO VIVO (IMPORTANTE PRA RENDER)
  setInterval(() => {
    console.log("bot ativo...")
  }, 30000)
}

=======
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys')

const express = require('express')
const app = express()

// 🌐 SERVIDOR (OBRIGATÓRIO PRA RENDER)
app.get('/', (req, res) => {
  res.send('Bot WhatsApp ativo 🚀')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
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

  // 🔌 CONEXÃO
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

  // 👋 ENTRADA NO GRUPO
  sock.ev.on('group-participants.update', async (data) => {
    if (data.action === 'add') {
      await sock.sendMessage(data.id, {
        text: `👋 *BEM-VINDO(A) A ABYSS KINGS!*

━━━━━━━━━━━━━━
🎮 *HABILIDADES OBRIGATÓRIAS*
✅ Alok
➡️ Cura / velocidade

✅ Kelly
➡️ Corrida rápida

✅ Moco
➡️ Marca inimigos

✅ Maxim
➡️ Cura rápida

ou

✅ Leon
➡️ Recuperação em combate

━━━━━━━━━━━━━━
📌 Envie seu ID para participar`
      })
    }
  })

  // 🔥 MANTER PROCESSO VIVO (IMPORTANTE PRA RENDER)
  setInterval(() => {
    console.log("bot ativo...")
  }, 30000)
}

>>>>>>> 9596bed14e226c6c4da68c20fe5a8dda28e8a8af
startBot()