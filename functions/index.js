const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onPlayerUpdate = functions.firestore
  .document('players/{playerId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();
    const playerId = context.params.playerId;

    // Crear el mensaje de notificación
    const message = {
      notification: {
        title: 'Actualización de Jugador',
        body: `El jugador ${newData.name} ha sido actualizado`
      },
      data: {
        playerId: playerId,
        type: 'player_update'
      },
      topic: 'player_updates' // Todos los dispositivos suscritos a este tema recibirán la notificación
    };

    try {
      // Enviar la notificación
      const response = await admin.messaging().send(message);
      console.log('Notificación enviada:', response);
      return null;
    } catch (error) {
      console.error('Error al enviar la notificación:', error);
      return null;
    }
  });

exports.onPlayerCreate = functions.firestore
  .document('players/{playerId}')
  .onCreate(async (snap, context) => {
    const newData = snap.data();
    const playerId = context.params.playerId;

    const message = {
      notification: {
        title: 'Nuevo Jugador',
        body: `Se ha añadido un nuevo jugador: ${newData.name}`
      },
      data: {
        playerId: playerId,
        type: 'player_create'
      },
      topic: 'player_updates'
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Notificación enviada:', response);
      return null;
    } catch (error) {
      console.error('Error al enviar la notificación:', error);
      return null;
    }
  }); 