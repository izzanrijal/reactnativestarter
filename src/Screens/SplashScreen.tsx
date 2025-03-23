import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from '@config/supabase';
import { SplashScreenProps } from 'src/Types/types';
import { callEmailVerifyFunction } from '@hooks/callEmailVerifyFunction';

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
    
    // Function to send verification email and handle navigation
    const sendVerificationEmail = async (email) => {
        try {
            // Use callEmailVerifyFunction to send verification email
            callEmailVerifyFunction(email, (verificationCode) => {
                console.log('Verification code sent to email:', verificationCode);
                
                // Set global variables for navigation
                global.userEmail = email;
                global.verificationCode = verificationCode.toString();
                
                // Navigate to verification screen using reset instead of replace
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'VerificationScreen' }],
                });
                
                // Show alert to check email
                setTimeout(() => {
                    Alert.alert(
                        'Verification Required',
                        'Please check your email for the verification code.'
                    );
                }, 500);
            });
        } catch (error) {
            console.error('Error sending verification email:', error);
            
            // Fallback to generating code locally if email sending fails
            const fallbackCode = Math.floor(1000 + Math.random() * 9000).toString();
            console.log('Email sending failed. Using fallback code:', fallbackCode);
            
            // Set global variables for navigation
            global.userEmail = email;
            global.verificationCode = fallbackCode;
            
            // Navigate to verification screen using reset instead of replace
            navigation.reset({
                index: 0,
                routes: [{ name: 'VerificationScreen' }],
            });
            
            // Show fallback code to user
            setTimeout(() => {
                Alert.alert(
                    'Verification Required',
                    `We couldn't send an email. Your verification code is: ${fallbackCode}`
                );
            }, 500);
        }
    };
    
    const checkUser = async () => {
        console.log('SplashScreen');
        
        try {
            // First, check if we have global verification variables set
            if (global.userEmail && global.verificationCode) {
                console.log('Redirecting to verification from SplashScreen');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'VerificationScreen' }],
                });
                return;
            }

            // Get current user session
            const { data, error } = await supabase.auth.getSession();
            
            if (error) {
                throw error;
            }

            if (data?.session) {
                // User is logged in, now check if they're verified
                const userId = data.session.user.id;
                const userEmail = data.session.user.email;

                try {
                    // Check verification status in user_profile table
                    const { data: profileData, error: profileError } = await supabase
                        .from('user_profile')
                        .select('is_verified')
                        .eq('user_uuid', userId)
                        .single();

                    if (profileError) {
                        // Handle error (table might not exist yet in dev)
                        console.error('Error checking verification status:', profileError);
                        
                        if (profileError.code === '42P01') {
                            // Table doesn't exist, proceed to home as it's likely first run
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'HomeScreen' }],
                            });
                            return;
                        }
                        
                        // No profile found, create one with unverified status
                        if (profileError.code === 'PGRST116') {
                            try {
                                // Create a new profile with unverified status
                                await supabase
                                    .from('user_profile')
                                    .insert({
                                        user_uuid: userId,
                                        user_email: userEmail,
                                        created_at: new Date().toISOString(),
                                        is_verified: false
                                    });
                                
                                // Send verification email and navigate
                                sendVerificationEmail(userEmail);
                                return;
                            } catch (createError) {
                                console.error('Error creating profile:', createError);
                                // Fall back to HomeScreen
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'HomeScreen' }],
                                });
                                return;
                            }
                        }
                        
                        // Other errors, proceed to home as fallback
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'HomeScreen' }],
                        });
                        return;
                    }

                    // Check verification status
                    if (profileData && profileData.is_verified === true) {
                        // User is verified, proceed to home
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'HomeScreen' }],
                        });
                    } else {
                        // User is logged in but not verified
                        // Send verification email and navigate
                        sendVerificationEmail(userEmail);
                    }
                } catch (err) {
                    console.error('Error in verification check:', err);
                    // Fallback to home screen
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'HomeScreen' }],
                    });
                }
            } else {
                // No session, go to auth stack - use reset instead of replace
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'SignInScreen' }],
                });
            }
        } catch (error) {
            console.error('Session check error:', error);
            // On error, go to auth stack - use reset instead of replace
            navigation.reset({
                index: 0,
                routes: [{ name: 'SignInScreen' }],
            });
        }
    };
      

    useEffect(() => {
        // Add a small delay to ensure navigation is ready
        const timer = setTimeout(() => {
            checkUser();
        }, 300);
        
        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading...</Text>
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center' as 'center',
        alignItems: 'center' as 'center',
    },
};

export default SplashScreen;