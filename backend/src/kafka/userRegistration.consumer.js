import { kafka } from "../config/kafka.js";
import authService from "../services/auth.service.js";

const consumer = kafka.consumer({groupId: process.env.KAFKA_GROUP_ID || "auth-service-group"});

export async function startUserRegistrationConsumer() {

  const topic = process.env.KAFKA_USER_REGISTERED_TOPIC || "user-registration";
  await consumer.connect();

  console.log("Kafka consumer connected");

  await consumer.subscribe({
    topic,
    fromBeginning: true
  });

  console.log( `Subscribed to topic: ${topic}`);

  await consumer.run({
    eachMessage: async ({topic,partition,message}) => {

      try {

        const rawValue = message.value?.toString();
        if (!rawValue) {
          return;
        }

        const event = JSON.parse(rawValue);

        console.log( "Received Kafka event:", event.eventType);

        if ( event.eventType !== "USER_REGISTERED" ) {
          return;
        }

        await authService.createCredentials( event.userId, event.username, event.password);
        console.log( `Credentials created for user ${event.userId}`);

      } catch (error) {
        console.error("Kafka message processing failed:", error);
      }
    }
  });
}