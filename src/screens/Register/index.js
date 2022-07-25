import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import {Input} from '@rneui/base';
import React, {useEffect, useState} from 'react';
import {ms} from 'react-native-size-matters';

import authProvider from '@react-native-firebase/auth';
import messagingProvider from '@react-native-firebase/messaging';
import {myDb} from '../../helpers/Db';

import {setDataUser} from '../Login/Redux/action';

const auth = authProvider();
const messaging = messagingProvider();

const Register = ({navigation}) => {
  const [userState, setUserState] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    avatar:
      'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
  });

  const registAccount = async () => {
    try {
      const res = await auth.createUserWithEmailAndPassword(
        userState.email,
        userState.password,
      );
      const token = await messaging.getToken();
      console.log(res);

      if (token) {
        const payload = {
          displayName: userState.name,
          email: res.user.email,
          phoneNumber: res.user.phoneNumber,
          photoURL: userState.avatar,
          bio: userState.bio,
          contact: [],
          roomChat: [],
          _id: res.user.uid,
          notifToken: token,
        };
        await myDb.ref(`users/${res.user.uid}`).set(payload);

        Alert.alert('Registrasi Berhasil', 'silahkan login', [
          {
            text: 'Next',
            onPress: () => {
              navigation.navigate('Login');
            },
          },
        ]);
      }
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('email address is already in use');
      }
      if (error.code === 'auth/invalid-email') {
        Alert.alert('That email address is invalid!');
      }
    }
  };
  const createDataUser = (field, value) => {
    setUserState(prevState => {
      prevState[field] = value;
      return {
        ...prevState,
      };
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Sign Up for Register</Text>

        <View>
          <View style={styles.form}>
            <Text
              style={{
                fontSize: 14,
                color: 'black',
                fontWeight: '600',
                left: ms(10),
              }}>
              Name
            </Text>
            <Input
              style={styles.textinput}
              placeholder="Name"
              placeholderTextColor="#bbb"
              onChangeText={text => createDataUser('name', text)}
              // value={name}
            />

            <Text
              style={{
                fontSize: 14,
                color: 'black',
                fontWeight: '600',
                left: ms(10),
              }}>
              Email
            </Text>
            <Input
              style={styles.textinput}
              placeholder="Email"
              placeholderTextColor="#bbb"
              onChangeText={text => createDataUser('email', text)}
              // value={email}
            />

            <Text
              style={{
                fontSize: 14,
                color: 'black',
                fontWeight: '600',
                left: ms(10),
              }}>
              Password
            </Text>
            <Input
              style={styles.textinput}
              placeholderTextColor="#bbb"
              placeholder="Password"
              secureTextEntry
              onChangeText={text => createDataUser('password', text)}
              // value={password}
            />
            <Text
              style={{
                fontSize: 14,
                color: 'black',
                fontWeight: '600',
                left: ms(10),
              }}>
              Bio
            </Text>
            <Input
              style={styles.textinput}
              placeholderTextColor="#bbb"
              placeholder="Bio"
              onChangeText={text => createDataUser('bio', text)}
              // value={bio}
            />
          </View>
          <View style={styles.but}>
            {/* //! BUTTON SIGN UP */}
            <View>
              <TouchableOpacity onPress={registAccount}>
                <Text style={styles.register}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* //! BUTTON TO LOGIN */}
            <View style={styles.registeraccount}>
              <Text style={{color: 'black'}}>have an account? </Text>

              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>
                  Login here
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfaf7',
  },
  title: {
    top: ms(30),
    justifyContent: 'center',
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  form: {
    top: ms(70),
    width: ms(300),
    left: ms(34),
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
  },
  but: {
    top: ms(80),
    alignItems: 'center',
  },
  textinput: {
    borderBottomColor: 'grey',
    borderWidth: 1,
    borderRadius: 10,
  },
  register: {
    fontSize: 20,
    paddingTop: ms(12),
    width: ms(100),
    height: ms(50),

    textAlign: 'center',
    color: 'black',
    backgroundColor: '#11cdf7',
    borderRadius: 36,
  },
});
