import {Alert, RefreshControl, StatusBar, FlatList} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {HeaderComponent} from '../../component/headerComp';
import ChatComp from '../../component/chatComp';
import {SafeAreaView} from 'react-native-safe-area-context';
import {myDb} from '../../helpers/Db';
import {useDispatch, useSelector} from 'react-redux';
import {setChoosenUser} from '../Dasboard/Redux/action';
import {EmptyComponent} from '../../component/emptyComp';

export default function Dasboard({navigation}) {
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState('');

  const [contactList, setContactList] = useState([]);

  const {_user} = useSelector(state => state.login);
  const {_choosenUser} = useSelector(state => state.dash);

  const [refresh, setRefresh] = useState(false);

  const onRefresh = () => {
    setRefresh(true);
    getAllData();
    setRefresh(false);
  };

  const dispatch = useDispatch();

  const getAllData = useCallback(async () => {
    try {
      const res = await myDb.ref('/users').once('value');
      const userList = Object.values(res.val()).filter(
        val => val._id !== _user._id,
      );
      setData(userList);
      setFilterData(userList);
      console.log(userList);
      myDb.ref(`contactRooms/${_user.displayName}`).on('value', snapshot => {
        const res = snapshot.val();
        if (res && res.contact) {
          setContactList(res.contact);
        } else {
          setContactList([]);
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
    }
  }, [_user.email]);

  useEffect(() => {
    getAllData();
    return () => {
      setData([]);
      setFilterData([]);
    };
  }, [getAllData]);

  const selectedUser = item => {
    newContact(item);
    console.log(_choosenUser);
  };

  const newContact = async item => {
    try {
      const myFriend = await myDb.ref(`chatRooms/`).once('value');
      const dataFriend = myFriend.val();
      console.log('data ', dataFriend);

      await myDb.ref(`chatRooms/${(_user._id, _choosenUser._id)}`).update({
        firstUser: _user.displayName,
        secondUser: item.displayName,
      });

      await myDb.ref(`contactRooms/${_user.displayName}`).update({
        contact: [...contactList, {...item}],
      });
      const friendContact = await myDb
        .ref(`contactRooms/${item.displayName}`)
        .once('value');
      console.log(friendContact.val());
      if (friendContact.val()) {
        await myDb.ref(`contactRooms/${item.displayName}`).update({
          contact: [...friendContact.val().contact, {..._user}],
        });
      } else {
        await myDb.ref(`contactRooms/${item.displayName}`).update({
          contact: [{..._user}],
        });
      }

      dispatch(setChoosenUser(item));
      navigation.navigate('Chat');
    } catch (error) {
      console.log(error);
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
        onPress={() => {
          selectedUser(item);
        }}
      />
    );
  };

  const searchFilter = text => {
    if (text) {
      const newData = data.filter(i =>
        i.displayName.toUpperCase().includes(text.toUpperCase()),
      );
      setFilterData(newData);
      setSearch(text);
    } else {
      setFilterData(data);
      setSearch(text);
    }
  };

  return (
    <SafeAreaView>
      <StatusBar hidden />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
        data={filterData}
        keyExtractor={item => item._id}
        renderItem={RenderItem}
        ListEmptyComponent={() => {
          return <EmptyComponent />;
        }}
        ListHeaderComponent={() => {
          return (
            <HeaderComponent
              value={search}
              title="All User"
              onChangeText={text => searchFilter(text)}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}
