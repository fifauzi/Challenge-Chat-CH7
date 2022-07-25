import {
  StatusBar,
  RefreshControl,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useCallback, useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import ChatComp from '../../component/chatComp';
import {setChoosenUser} from './Redux/action';
import {HeaderComponent} from '../../component/headerComp';
import {EmptyComponent} from '../../component/emptyComp';
import {useDispatch, useSelector} from 'react-redux';
import {setDataUser} from '../Login/Redux/action';
import {myDb} from '../../helpers/Db';
import Icon from 'react-native-vector-icons/Ionicons';
import {ms} from 'react-native-size-matters';
import auth from '@react-native-firebase/auth';

export default function Dashboard({navigation}) {
  const [data, setData] = useState([]);
  const {_user} = useSelector(state => state.login);

  const dispatch = useDispatch();

  const getAllData = useCallback(async () => {
    try {
      const res = await myDb.ref(`contactRooms/${_user._id}`).once('value');
      setData(res.val().contact);
      console.log(res.val());
    } catch (error) {
      console.log(error);
    } finally {
    }
  }, [_user.email]);

  useEffect(() => {
    const onValueChange = myDb
      .ref(`contactRooms/${_user._id}`)
      .on('value', snapshot => {
        console.log('User data: ', snapshot.val());
      });

    // Stop listening for updates when no longer required
    return () =>
      myDb.ref(`contactRooms/${_user._id}`).off('value', onValueChange);
    getAllData();
  }, [getAllData]);

  const selectedUser = item => {
    dispatch(setChoosenUser(item));
    navigation.navigate('Chat');
  };
  const AllUser = async () => {
    navigation.navigate('allUser');
  };
  const signOut = async () => {
    try {
      await auth()
        .signOut()
        .then(() => {
          dispatch(setDataUser({}));
          dispatch(setChoosenUser({}));
          navigation.navigate('Login');
          console.log('out');
        });
    } catch (error) {
      console.error(error);
    }
  };

  const RenderItem = ({item}) => {
    const {displayName, email, photoURL} = item;
    return (
      <ChatComp
        name={displayName}
        email={email}
        photo={photoURL}
        {...item}
        onPress={() => selectedUser(item)}
      />
    );
  };

  const [refresh, setRefresh] = useState(false);

  const onRefresh = () => {
    setRefresh(true);
    getAllData();
    setRefresh(false);
  };

  console.log(data);
  return (
    <SafeAreaView style={{height: ms(700)}}>
      <StatusBar hidden />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
        data={data}
        keyExtractor={item => item._id}
        renderItem={RenderItem}
        ListEmptyComponent={() => {
          return <EmptyComponent />;
        }}
        ListHeaderComponent={() => {
          return (
            <HeaderComponent
              title="Chat"
              // onChangeText={text => searchFilter(text)}
            />
          );
        }}
      />

      <Icon
        name="add-circle-outline"
        color="#1e2021"
        size={40}
        style={styles.add}
        onPress={AllUser}
      />

      <Icon
        name="log-out-outline"
        color="red"
        size={40}
        style={styles.logout}
        onPress={() =>
          Alert.alert('Sign Out', 'Apakah anda yakin untuk Sign Out ?', [
            {text: 'Tidak', onPress: () => console.log('Cancel Pressed!')},
            {
              text: 'Ya',
              onPress: () => {
                signOut();
              },
            },
          ])
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  add: {
    position: 'absolute',
    top: ms(110),
    left: ms(30),
    width: ms(90),
  },
  logout: {
    position: 'absolute',
    top: ms(620),
    left: ms(307),
    width: ms(90),
  },
});
