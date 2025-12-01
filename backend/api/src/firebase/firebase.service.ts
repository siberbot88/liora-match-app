import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
    private firebaseApp: admin.app.App;

    constructor(private configService: ConfigService) { }

    async onModuleInit() {
        try {
            const serviceAccountPath = this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH');

            if (serviceAccountPath) {
                // Read and parse service account JSON file
                const serviceAccount = JSON.parse(
                    readFileSync(resolve(process.cwd(), serviceAccountPath), 'utf8')
                );

                this.firebaseApp = admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });

                console.log(' Firebase Admin SDK initialized');
            } else {
                console.warn('  Firebase Admin SDK not initialized - missing service account path');
            }
        } catch (error) {
            console.error(' Firebase Admin SDK initialization failed:', error.message);
            throw error;
        }
    }

    getAuth(): admin.auth.Auth {
        return admin.auth(this.firebaseApp);
    }

    getFirestore(): admin.firestore.Firestore {
        return admin.firestore(this.firebaseApp);
    }

    async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
        return this.getAuth().verifyIdToken(idToken);
    }

    async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
        return this.verifyIdToken(token);
    }

    getApp() {
        return this.firebaseApp;
    }

    async sendPushNotification(tokens: string[], payload: { title: string; body: string; data?: any }) {
        if (!tokens || tokens.length === 0) {
            return { successCount: 0, failureCount: 0 };
        }

        try {
            const message: admin.messaging.MulticastMessage = {
                tokens,
                notification: {
                    title: payload.title,
                    body: payload.body,
                },
                data: payload.data || {},
            };

            const response = await admin.messaging().sendEachForMulticast(message);
            
            console.log(` Push notifications sent: ${response.successCount} success, ${response.failureCount} failed`);
            
            return {
                successCount: response.successCount,
                failureCount: response.failureCount,
            };
        } catch (error) {
            console.error('Failed to send push notifications:', error);
            throw error;
        }
    }
}
