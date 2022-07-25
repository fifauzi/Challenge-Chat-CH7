import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Login, Register, Dashboard, Chat, allUser} from '../screens';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import bottomTabs from './bottomTabs';

const Stack = createNativeStackNavigator();

const Router = () => {
  return (
    <Stack.Navigator initialRouteName="bottomTabs">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="allUser"
        component={allUser}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="bottomTabs"
        component={bottomTabs}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default Router;

const styles = StyleSheet.create({});
