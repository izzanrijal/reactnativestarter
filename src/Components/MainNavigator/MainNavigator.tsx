import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import SignUpScreen from "@screens/SignUpScreen";
import SplashScreen from "@screens/SplashScreen";
import SignInScreen from "@screens/SignInScreen";
import HomeScreen from "@screens/HomeScreen";
import VerificationScreen from "@screens/VerificationScreen";
import ChangePasswordScreen from "@screens/ChangePasswordScreen";
import ButtonExamples from "@screens/ButtonExamples";
import supabase from "@config/supabase";
import { Session } from "@supabase/supabase-js";
import { Alert } from "react-native";
import { callEmailVerifyFunction } from "@hooks/callEmailVerifyFunction";

const Stack = createStackNavigator();

// Helper function to create user_profile table if it doesn't exist
const ensureUserProfileTable = async () => {
  try {
    // We'll use a standard query first to check if the table exists
    const { data, error } = await supabase
      .from('user_profile')
      .select('count(*)')
      .limit(1);

    // If table doesn't exist error (code 42P01)
    if (error && error.code === '42P01') {
      console.log('Creating user_profile table');
      
      // We need to use SQL to create the table since we don't have direct table creation API
      // This is executed as a stored procedure in Supabase
      await supabase.rpc('create_user_profile_table');
      
      return false; // Table didn't exist but was created
    }
    
    return true; // Table exists
  } catch (err) {
    console.error('Error checking/creating user_profile table:', err);
    return false; // Assume table doesn't exist on error
  }
};

const MainNavigator = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCheckComplete, setVerificationCheckComplete] = useState(false);
  const [initialRoute, setInitialRoute] = useState("SplashScreen");
  const [dbTableExists, setDbTableExists] = useState(false);

  // Check for database table on component mount
  useEffect(() => {
    const checkDatabase = async () => {
      const exists = await ensureUserProfileTable();
      setDbTableExists(exists);
    };
    
    checkDatabase();
  }, []);

  // Function to send verification email and handle state updates
  const sendVerificationEmail = async (userEmail) => {
    try {
      // Use callEmailVerifyFunction to send verification email
      callEmailVerifyFunction(userEmail, (verificationCode) => {
        console.log('Verification code sent to email:', verificationCode);
        
        // Set global variables
        global.verificationCode = verificationCode.toString();
        global.userEmail = userEmail;
        
        setVerificationCheckComplete(true);
        setIsVerified(false);
        setInitialRoute("VerificationScreen");
        
        // Show alert after a slight delay
        setTimeout(() => {
          Alert.alert(
            'Verification Required',
            'Please check your email for the verification code to verify your account.'
          );
        }, 500);
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      
      // Fallback to generating code locally if email sending fails
      const fallbackCode = Math.floor(1000 + Math.random() * 9000).toString();
      console.log('Email sending failed. Using fallback code:', fallbackCode);
      
      // Set global variables
      global.verificationCode = fallbackCode;
      global.userEmail = userEmail;
      
      setVerificationCheckComplete(true);
      setIsVerified(false);
      setInitialRoute("VerificationScreen");
      
      // Show fallback code alert
      setTimeout(() => {
        Alert.alert(
          'Verification Required',
          `We couldn't send the email. Your verification code is: ${fallbackCode}`
        );
      }, 500);
    }
  };

  // Check verification status when session changes
  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (!session) {
        setIsVerified(false);
        setVerificationCheckComplete(true);
        setInitialRoute("SplashScreen");
        return;
      }

      try {
        // Get user ID from the session
        const userId = session.user.id;
        const userEmail = session.user.email;
        
        // Check if user profile exists and if verification status is true
        const { data: profile, error } = await supabase
          .from('user_profile')
          .select('is_verified')
          .eq('user_uuid', userId)
          .single();
        
        // Handle verification status based on database
        if (error) {
          // If user profile doesn't exist (PGRST116 = "Record not found")
          if (error.code === 'PGRST116') {
            console.log("User profile doesn't exist, creating one with unverified status");
            
            try {
              // Create user profile with unverified status
              await supabase
                .from('user_profile')
                .insert({
                  user_uuid: userId,
                  user_email: userEmail,
                  created_at: new Date().toISOString(),
                  is_verified: false
                });
              
              // Send verification email
              sendVerificationEmail(userEmail);
            } catch (createError) {
              console.error("Error creating user profile:", createError);
              // Still prevent access to secure screens
              setIsVerified(false);
              setInitialRoute("VerificationScreen");
              
              // Create fallback verification
              sendVerificationEmail(userEmail);
            }
          } else {
            // Other database errors, default to unverified for security
            console.error("Error checking verification status:", error);
            setIsVerified(false);
            setInitialRoute("VerificationScreen");
            
            // Send verification code for safety
            sendVerificationEmail(userEmail);
          }
        } else {
          // User profile exists, check verification status
          if (profile && profile.is_verified === true) {
            // User is verified
            setIsVerified(true);
            setInitialRoute("HomeScreen");
            setVerificationCheckComplete(true);
          } else {
            // User exists but is not verified
            // Send verification email
            sendVerificationEmail(userEmail);
          }
        }
      } catch (err) {
        console.error('Error in verification check:', err);
        // Default to unverified for security
        setIsVerified(false);
        setInitialRoute("VerificationScreen");
        setVerificationCheckComplete(true);
      }
    };
    
    if (session) {
      checkVerificationStatus();
    } else {
      setVerificationCheckComplete(true);
      setInitialRoute("SplashScreen");
    }
  }, [session]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading || !verificationCheckComplete) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          id={undefined}
          screenOptions={{ headerShown: false, gestureEnabled: false }}
        >
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
        initialRouteName={initialRoute}
      >
        {/* Common screens across all conditions */}
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        
        {session ? (
          isVerified ? (
            // Verified User Navigation - only these users can access secure screens
            <>
              <Stack.Screen name="HomeScreen" component={HomeScreen} />
              <Stack.Screen name="ButtonExamples" component={ButtonExamples} />
              <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
              <Stack.Screen 
                name="VerificationScreen" 
                component={VerificationScreen} 
                options={{ gestureEnabled: false }}
              />
              {/* Authentication screens in case user needs to re-authenticate */}
              <Stack.Screen name="SignInScreen" component={SignInScreen} />
              <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            </>
          ) : (
            // Unverified User Navigation - restricted access
            <>
              <Stack.Screen 
                name="VerificationScreen" 
                component={VerificationScreen} 
                initialParams={{
                  email: global.userEmail,
                  verificationCode: global.verificationCode
                }}
                options={{ gestureEnabled: false }}
              />
              <Stack.Screen name="SignInScreen" component={SignInScreen} />
              <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
              {/* Include HomeScreen but with access control in component */}
              <Stack.Screen name="HomeScreen" component={HomeScreen} />
            </>
          )
        ) : (
          // Unauthenticated User Navigation
          <>
            <Stack.Screen name="SignInScreen" component={SignInScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen 
              name="VerificationScreen" 
              component={VerificationScreen} 
              options={{ gestureEnabled: false }}
            />
            {/* Include HomeScreen but with access control in component */}
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;