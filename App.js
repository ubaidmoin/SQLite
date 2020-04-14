import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import DB from './DB';

const db = new DB();

const getReminders = () => {
  let reminders = [];
  db.getReminders().then((data) => {
    reminders = data;
    console.warn(reminders);
    return reminders;
  }).catch((err) => {
    console.warn(err);    
  })
}

const addReminder = () => {
  let reminder = {
    title: 'Test',
    note: 'Testing for Umair',
    date: new Date().toDateString(),
    time: new Date().getTime(),
    completed: false
  }
  db.addReminder(reminder);
}

const App = () => {
  const res = getReminders();
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={{flex: 1, alignItems:'center', justifyContent:'center'}}> 
        <TouchableOpacity style={{padding: 5, borderWidth: 1, borderRadius: 2}} onPress={addReminder}>
          <Text style={{fontSize: 12}}>Click me to add reminder...</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
