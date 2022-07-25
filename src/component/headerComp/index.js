import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Avatar} from '@rneui/base';
import Feather from 'react-native-vector-icons/Feather';
import {ms} from 'react-native-size-matters';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {TouchableOpacity} from 'react-native-gesture-handler';

import auth from '@react-native-firebase/auth';
import {useDispatch, u} from 'react-redux';
import {LOG_OUT} from '../../screens/Login/Redux/action';

export const HeaderComponent = ({callback = () => {}}) => {
  const dispatch = useDispatch();
  // const logout = async () => {
  //   try {
  //     await auth().signOut();
  //     navigate('Login');
  //     dispatch(LOG_OUT());
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const Logout = () => {
    auth()
      .signOut()
      .then(() => navigation.navigate('Login'));
  };

  return (
    <View style={headerStyle.headerContainer}>
      <View style={headerStyle.headerContent}>
        <Feather name="search" color={'white'} size={ms(24)} />
        <Text style={headerStyle.headerTitle}>MyChat</Text>
        <TouchableOpacity onPress={Logout}>
          <Avatar
            size={48}
            rounded
            source={{uri: 'https://randomuser.me/api/portraits/men/46.jpg'}}
          />
          {/* <Icon
            name="person"
            color="white"
            size={26}
            style={headerStyle.setting}
            onPress={() => {
              navigation.navigate('Profile');
            }}
          /> */}
        </TouchableOpacity>
      </View>
      <View style={headerStyle.body}></View>
    </View>
  );
};

const headerStyle = StyleSheet.create({
  headerContainer: {
    height: ms(120),
    backgroundColor: '#0F3D3E',
    marginBottom: ms(16),
  },

  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: ms(16),
    paddingHorizontal: widthPercentageToDP(4),
  },
  headerTitle: {
    color: 'black',
    fontSize: ms(20),
  },
  body: {
    backgroundColor: 'white',
    height: ms(120),
    marginTop: ms(32),
    borderTopRightRadius: ms(24),
    borderTopLeftRadius: ms(24),
  },
  add: {
    top: ms(10),
    right: ms(10),
    width: ms(10),
  },
  setting: {
    marginLeft: ms(265),
    top: ms(-36),
    width: ms(30),
  },
});
