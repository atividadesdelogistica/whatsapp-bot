const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys')

const express = require('express')
const qrcode = require('qrcode')

const app = express()

let qrImage = null

// 🌐 ROTA PRINCIPAL
app.get('/', (req, res) => {
  res.send('Bot WhatsApp ativo 🚀')
})

// 📱 ROTA DO QR CODE (WEB)
app.get('/qr', (req, res) => {
  if (!qrImage) {
    return res.send('⏳ QR ainda não gerado... aguarde o bot iniciar.')
  }

  res.send(`
    <html>
      <head>
        <title>QR WhatsApp Bot</title>
      </head>
      <body style="background:#111;color:#fff;text-align:center;font-family:sans-serif">
        <h1>Escaneie o QR Code</h1>
        <img src="${qrImage}" style="width:300px;height:300px;margin-top:20px"/>
      </body>
    </html>
  `)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log('Servidor rodando na porta ' + PORT)
})

// 🤖 FUNÇÃO DO BOT
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth')

  const sock = makeWASocket({
    auth: state
  })

  sock.ev.on('creds.update', saveCreds)

  // 🔌 CONEXÃO
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update

    // 📱 GERAR QR NA WEB
    if (qr) {
      console.log('QR recebido, gerando página...')
      qrImage = await qrcode.toDataURL(qr)
    }

    if (connection === 'open') {
      console.log('Bot conectado! 🤖')
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
🎮 HABILIDADES OBRIGATÓRIAS
✅ Alok → Cura / velocidade
✅ Kelly → Corrida rápida
✅ Moco → Marca inimigos
✅ Maxim → Cura rápida
ou
✅ Leon → Recuperação em combate

━━━━━━━━━━━━━━
📌 Envie seu ID para participar`
      })
    }
  })

  // 🔥 MANTER RODANDO (RENDER NÃO DORMIR)
  setInterval(() => {
    console.log('bot ativo...')
  }, 30000)
}

startBot()