import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Input} from '@rneui/base';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ms} from 'react-native-size-matters';

import authProvider from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';
import {setDataUser} from './Redux/action';

import {myDb} from '../../helpers/Db';
import messagingProvider from '@react-native-firebase/messaging';

const auth = authProvider();
const messaging = messagingProvider();

export default function Login({navigation}) {
  const dispatch = useDispatch();
  const [userState, setUserState] = useState({
    email: '',
    password: '',
  });

  const LoginWithEmail = async () => {
    try {
      const res = await auth.signInWithEmailAndPassword(
        userState.email,
        userState.password,
      );

      const token = await messaging.getToken();

      if (token) {
        let isUpdate = false;
        await myDb.ref(`users/${res.user.uid}`).update({
          notifToken: token,
        });
        isUpdate = true;

        if (isUpdate) {
          const results = await myDb.ref(`users/${res.user.uid}`).once('value');
          if (results.val()) {
            dispatch(setDataUser(results.val()));
            navigation.navigate('Dashboard');
          }
        }
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Email or Password is wrong, please try again');
      }

      if (error.code === 'auth/invalid-email') {
        Alert.alert('Email is not valid');
      }
    } finally {
    }
  };

  const handleUserState = (field, value) => {
    setUserState(prevState => {
      prevState[field] = value;
      return {
        ...prevState,
      };
    });
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.imageContainer}></View>

        <View style={styles.textInputContainer}>
          <Input
            placeholder="Email"
            onChangeText={text => handleUserState('email', text)}
            rightIcon={{type: 'feather', name: 'mail'}}
          />
        </View>
        <View style={styles.textInputContainer}>
          <Input
            placeholder="Password"
            secureTextEntry
            onChangeText={text => handleUserState('password', text)}
          />
        </View>
        <View style={styles.but}>
          <TouchableOpacity onPress={LoginWithEmail}>
            <Text style={styles.register}>Sign In</Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.registerText}>Doesn't have account ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: ms(600),
  },

  textInputContainer: {
    top: ms(150),
    left: ms(30),
    width: ms(300),
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
  },
  but: {
    top: ms(160),
    alignItems: 'center',
  },
  register: {
    fontSize: 20,
    paddingTop: ms(12),
    width: ms(90),
    height: ms(50),

    textAlign: 'center',
    color: 'black',
    backgroundColor: '#11cdf7',
    borderRadius: 36,
  },
  registerText: {
    fontSize: 15,
    top: ms(10),
    color: 'black',
  },
});
