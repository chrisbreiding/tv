const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

exports.test = functions.https.onRequest(async (req, res) => {
  const original = req.query.text
  const snapshot = await admin.database().ref('/messages').push({ original })

  res.redirect(303, snapshot.ref.toString())
})

exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
.onCreate(async (snapshot, context) => {
  const original = snapshot.val()

  // eslint-disable-next-line no-console
  console.log('Uppercasing', context.params.pushId, original)
  const uppercase = original.toUpperCase()

  return await snapshot.ref.parent.child('uppercase').set(uppercase)
})
