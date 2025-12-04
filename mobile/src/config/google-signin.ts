import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const configureGoogleSignIn = () => {
    GoogleSignin.configure({
        webClientId: '533983392668-c66epftfe3jpmgoul575r12b0vjcvlvi.apps.googleusercontent.com', // TODO: Replace with actual Web Client ID from Firebase Console
        offlineAccess: true,
    });
};
