import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
    private firebaseApp: admin.app.App;

    constructor(private configService: ConfigService) { }

    async onModuleInit() {
        try {
            // Option 1: Using service account file path
            const serviceAccountPath = this.configService.get('FIREBASE_SERVICE_ACCOUNT_PATH');

            if (serviceAccountPath) {
                this.firebaseApp = admin.initializeApp({
                    credential: admin.credential.cert(serviceAccountPath),
                });
            } else {
                // Option 2: Using individual environment variables
                const projectId = this.configService.get('FIREBASE_PROJECT_ID');
                const privateKey = this.configService.get('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n');
                const clientEmail = this.configService.get('FIREBASE_CLIENT_EMAIL');

                if (projectId && privateKey && clientEmail) {
                    this.firebaseApp = admin.initializeApp({
                        credential: admin.credential.cert({
                            projectId,
                            privateKey,
                            clientEmail,
                        }),
                    });
                } else {
                    console.warn('⚠️  Firebase Admin SDK not initialized - missing credentials');
                    return;
                }
            }

            console.log('✅ Firebase Admin SDK initialized');
        } catch (error) {
            console.error('❌ Firebase Admin SDK initialization failed:', error.message);
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
}
