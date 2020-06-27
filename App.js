import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Alert, View, Text, Modal, Dimensions, TouchableHighlight, TextInput, Keyboard, FlatList } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import Feather from 'react-native-vector-icons/Feather';
import Moment from 'moment';

var full_width = Dimensions.get('window').width;

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      currentDate: '',
      marked: '',
      minDate: '',
      maxDate: '',
      datesArray: [],
      selectedDate: '',
      event_date: '',
      modalVisible: false,
      eventName: '',
      eventDesc: '',
      eventsArray: [],
      extractEvents: [],
      modalVisible_event: false,
      modal_name: '',
      modal_desc: ''
    }
  }

  componentWillMount() {
    const presentDay = new Date();
    const presentMonth = new Date();
    const presentYear = new Date();
    presentDay.setDate(presentDay.getDate());
    presentMonth.setMonth(presentMonth.getMonth());
    presentYear.setFullYear(presentYear.getFullYear());
    this.setState({
      currentDate: Moment(presentYear).format('YYYY') + '-' + Moment(presentMonth).format('MM') + '-' + Moment(presentDay).format('DD'),
      event_date: Moment(presentDay).format('DD') + ' ' + Moment(presentMonth).format('MMM') + ', ' + Moment(presentYear).format('YYYY'),
      minDate: Moment(presentYear).format('YYYY') + '-01-01',
      maxDate: Moment(presentYear).format('YYYY') + '-12-31',
    });
  }

  onDaySelected = (day) => {
    this.setState({
      selectedDate: day.dateString,
      event_date: Moment(day).format('DD') + ' ' + Moment(day).subtract(1, 'M').format('MMM') + ', ' + Moment(day).format('YYYY'),
      extractEvents: [], eventName: '', eventDesc: ''
    });
    //Alert.alert('selected day : ' + Moment(day).subtract(1, 'M').format('YYYY-MM-DD'))

    if (this.state.eventsArray.length > 0) {
      const date = Moment(day).format('DD') + ' ' + Moment(day).subtract(1, 'M').format('MMM') + ', ' + Moment(day).format('YYYY');
      let extractEvents = [];
      for (let index = 0; index < this.state.eventsArray.length; index++) {

        if (this.state.eventsArray[index].date === date) {

          extractEvents.push({
            date: this.state.eventsArray[index].date,
            name: this.state.eventsArray[index].name,
            desc: this.state.eventsArray[index].desc
          });

          this.setState({ extractEvents });

        }
      }
      this.setState({ extractEvents });
    }

    console.log(this.state.extractEvents)
  }

  saveEvent() {

    if (this.state.eventName === '' || this.state.eventDesc === '') {
      Alert.alert('Enter Event name or Event description')
    }
    else {
      this.setState({ modalVisible: false, eventName: '', eventDesc: '' });

      this.state.eventsArray.push({
        date: this.state.event_date,
        name: this.state.eventName,
        desc: this.state.eventDesc
      });

      var newStateArray = this.state.extractEvents.slice();
      newStateArray.push({
        date: this.state.event_date,
        name: this.state.eventName,
        desc: this.state.eventDesc
      });
      this.setState({ extractEvents: newStateArray });

      this.state.datesArray.push(Moment(this.state.event_date).format('YYYY-MM-DD'));
      console.log(this.state.datesArray);

      this.markedDates();
    }

  }

  markedDates = () => {
    var obj = this.state.datesArray.reduce((c, v) => Object.assign(c, {
      [v]: {
        //selected: true,
        marked: true
      }
    }), {});
    this.setState({ marked: obj });
  }

  render() {
    console.disableYellowBox = true;
    return (
      <SafeAreaView style={styles.Background}>

        <View style={{ width: '100%' }}>
          <Calendar
            current={this.state.currentDate}
            minDate={this.state.minDate}
            maxDate={this.state.maxDate}
            onDayPress={(day) => this.onDaySelected(day)}
            monthFormat={'MMM yyyy'}
            onMonthChange={(month) => { console.log('month changed', month) }}
            hideArrows={false}
            // Do not show days of other months in month page. Default = false
            hideExtraDays={true}
            disableMonthChange={false}
            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
            firstDay={1}
            hideDayNames={false}
            showWeekNumbers={false}
            // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
            disableAllTouchEventsForDisabledDays={true}
            style={{
              height: 350
            }}
            theme={{
              calendarBackground: '#F1F3F4',
              todayTextColor: 'blue',
              //selectedDayTextColor: 'red',
              //dayTextColor: '#00ADF5',
              monthTextColor: 'black',
              //selectedDayBackgroundColor: '#00ADF5',
              dotColor: 'red',
              selectedDotColor: 'red',
              indicatorColor: 'blue',
              textDayFontFamily: 'monospace',
              textMonthFontFamily: 'monospace',
              textDayHeaderFontFamily: 'monospace',
              textDayFontWeight: 'bold',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 17,
              textMonthFontSize: 17,
              textDayHeaderFontSize: 17,
              arrowColor: 'black',
            }}
            markedDates={{
              ...this.state.marked,
              [this.state.selectedDate]: {
                selectedColor: 'red',
                textColor: 'white',
                ...this.state.marked[this.state.selectedDate],
                selected: true
              }
            }}
          />
        </View>
        <ScrollView
          //  contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>

          {this.state.extractEvents.length === 0 ?

            <Text style={{ textAlign: 'center', fontSize: 18, marginTop: 10 }}>No Events!</Text>
            :
            <FlatList style={{ width: '100%' }}
              data={this.state.extractEvents}
              renderItem={({ index, item }) => (
                <TouchableHighlight
                  style={{ marginRight: 8 }}
                  activeOpacity={0.8}
                  underlayColor={'transparent'}
                  onPress={() => this.setState({ modal_name: item.name, modal_desc: item.desc, modalVisible_event: true })}>
                  <View style={styles.render_view}>
                    <View style={styles.sub_view}></View>
                    <View>
                      <Text style={{ fontSize: 16, fontWeight: 'bold' }} numberOfLines={1}>{item.name}</Text>
                      <Text numberOfLines={1}>{item.desc}</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          }

        </ScrollView>

        <View style={styles.bottomView} >
          <TouchableHighlight
            style={{ marginRight: 8 }}
            activeOpacity={0.8}
            underlayColor={'transparent'}
            onPress={() => this.setState({ modalVisible: true })}>
            <View style={styles.plus_btn}>
              <Feather size={20}
                color='white' name="plus" />
            </View>
          </TouchableHighlight>
        </View>

        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => { console.log("Modal has been closed.") }}>
          <View style={styles.modalBg}>
            <View style={styles.popUp}>
              <Text style={styles.dialogTxt}>Add Event on {this.state.event_date}</Text>

              <View style={styles.inputTextStyle}>
                <TextInput style={styles.inputBox}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  placeholder="Enter event name"
                  placeholderTextColor='#999999'
                  keyboardType='default'
                  returnKeyType='done'
                  autoCapitalize='none'
                  value={this.state.eventName}
                  onChangeText={(eventName) => this.setState({ eventName })}
                  onSubmitEditing={Keyboard.dismiss}
                  ref={(component) => this._textInput = component}
                />
              </View>

              <View style={styles.inputTextStyle}>
                <TextInput style={styles.inputBox}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  placeholder="Enter description"
                  placeholderTextColor='#999999'
                  keyboardType='default'
                  returnKeyType='done'
                  autoCapitalize='none'
                  value={this.state.eventDesc}
                  onChangeText={(eventDesc) => this.setState({ eventDesc })}
                  onSubmitEditing={Keyboard.dismiss}
                  ref={(component) => this._textInput = component}
                />
              </View>

              <View style={styles.cancelBg}>
                <TouchableHighlight
                  style={{ marginRight: 8 }}
                  activeOpacity={0.8}
                  underlayColor={'transparent'}
                  onPress={() => this.setState({ modalVisible: false })}>
                  <View style={styles.cancelView}>
                    <Text style={styles.cancelTxt}>Cancel</Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  style={{ marginRight: 8 }}
                  activeOpacity={0.8}
                  underlayColor={'transparent'}
                  onPress={() => this.saveEvent()}>
                  <View style={[styles.cancelView, { marginLeft: 10 }]}>
                    <Text style={styles.cancelTxt}>Save</Text>
                  </View>
                </TouchableHighlight>

              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.modalVisible_event}
          onRequestClose={() => { console.log("Modal has been closed.") }}>
          <View style={styles.modalBg}>
            <View style={styles.popUp}>
              <Text style={styles.dialogTxt}>View Event on {this.state.event_date}</Text>

              <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>{this.state.modal_name}</Text>

              <Text style={{ marginTop: 10 }}>{this.state.modal_desc}</Text>

              <View style={styles.cancelBg}>
                <TouchableHighlight
                  style={{ marginRight: 8 }}
                  activeOpacity={0.8}
                  underlayColor={'transparent'}
                  onPress={() => this.setState({ modalVisible_event: false })}>
                  <View style={styles.cancelView}>
                    <Text style={styles.cancelTxt}>OK</Text>
                  </View>
                </TouchableHighlight>

              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  scrollView: {
    width: '100%',

  },
  Background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: (Platform.OS === 'ios') ? 20 : 0
  },
  bottomView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 10,
    position: 'absolute',
    bottom: 0
  },
  plus_btn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  popUp: {
    backgroundColor: 'white',
    borderRadius: 5,
    width: full_width - 40,
    padding: 15
  },
  dialogTxt: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  cancelBg: {
    top: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 15,
    flexDirection: 'row'
  },
  cancelView: {
    backgroundColor: 'red',
    height: 35,
    borderRadius: 5,
    borderColor: 'red',
    borderWidth: 1,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelTxt: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
  inputTextStyle: {
    borderRadius: 10,
    borderWidth: 1,
    //margin: 15,
    width: '100%',
    height: 50,
    borderColor: '#393A3C',
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 15
  },
  inputBox: {
    color: 'black',
    fontSize: 14,
    width: '100%'
  },
  render_view: {
    flex: 1,
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
    margin: 10,
    borderBottomWidth: 0.5
  },
  sub_view: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: 'red'
  }
});