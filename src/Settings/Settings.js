import React, {Component, useState} from 'react';
import { View, 
    Text, 
    Switch, 
    StyleSheet,
    Dimensions,
    Modal,
    Button,
    TouchableOpacity, 
    Alert} from "react-native"
import { Container, 
    Header, 
    Content, 
    Picker, 
    Form, 
    Body, 
    Title, 
    Left, 
    Right, 
    Button as NativeButton, } from "native-base"
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker as WheelPicker, DatePicker } from 'react-native-wheel-datepicker'
import Popover from 'react-native-popover-view'
import CheckBox from '@react-native-community/checkbox'
import DateTimePicker from '@react-native-community/datetimepicker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

let date = null

export default class Settings extends Component{
    constructor() {
        super()
        this.state= {
            working: false,
            autoConnectOnWifi: false,
            // notifyWhenFullDayWorked: false,
            remindToCheckIn: false,
            remindToCheckOut: false,
            lunchDuration: 0,
            lunchDurationScrollerVisibility: false,
            workingDaysCheckboxVisibility: false,
            workingDays: {
                'monday': true, 
                'tuesday': true, 
                'wednesday': true, 
                'thursday': true, 
                'friday': true, 
                'saturday': false, 
                'sunday': false, },
            notifyOnAmountOfOvertime: false,
            showCheckInTimePicker: false,
            showCheckOutTimePicker: false,
            checkInHour: "8",
            checkInMinute: "00",
            checkOutHour: "16",
            checkOutMinute: "00",
            settingsChanged: false,
        }
        this.mySettings = {}
        this.showTimePicker = false
        /*
        mySettings = {
            checkInTime: ["7", "00"],
            checkOutTime: ["16", "00"],
            autoConnectOnWifi: false,
            remindToCheckIn: false,
            remindToCheckOut: false,
            lunchDuration: 0,
            workingDays: {
                monday: false, 
                tuesday: false, 
                wednesday: false, 
                thursday: false, 
                friday: false, 
                saturday: false, 
                sunday: false,
            }
        }
        */
    }

    componentDidMount(){
        date = Date.now()
        this.mySettings = {
            checkInTime: ["07", "00"],
            checkOutTime: ["16", "00"],
            autoConnectOnWifi: false,
            remindToCheckIn: false,
            remindToCheckOut: false,
            lunchDuration: 30,
            workingDays: {
                monday: true, 
                tuesday: true, 
                wednesday: true, 
                thursday: true, 
                friday: true, 
                saturday: false, 
                sunday: false,
            }
        }
        this.loadUserSettings()
    }

    componentWillUnmount(){
        this.saveUserSettings()
    }

    updateSettings = () => {

    }

    loadUserSettings = async () => {
        try {
            const value = await AsyncStorage.getItem('mySettings')
            if(value !== null) {
                this.mySettings = JSON.parse(value)
                console.log("loadUserSettings done")
                this.applySettings()
            }
            else{
				// Set standard settings
				console.log("no settings found")
            }
        } catch(e) {
            console.log("loadUserSettings error: " + e)
        }
    }

    applySettings = () => {
		// this.mySettings = {
        //     checkInTime: ["7", "00"],
        //     checkOutTime: ["16", "00"],
        //     autoConnectOnWifi: false,
        //     remindToCheckIn: false,
        //     remindToCheckOut: false,
        //     lunchDuration: 0,
        //     workingDays: {
        //         monday: false, 
        //         tuesday: false, 
        //         wednesday: false, 
        //         thursday: false, 
        //         friday: false, 
        //         saturday: false, 
        //         sunday: false,
        //     }
		// }
		this.setState({
            checkInHour: this.mySettings.checkInTime[0],
            checkInMinute: this.mySettings.checkInTime[1],
            checkOutHour: this.mySettings.checkOutTime[0],
            checkOutMinute: this.mySettings.checkOutTime[1]
        })
	}

    saveUserSettings = async () => {
        try {
            await AsyncStorage.setItem('mySettings', JSON.stringify(this.mySettings))
            console.log("saveUserSettings done")
        } catch (e) {
            console.log("saveUserSettings error")
        }
    }

    resetToDefaultSettings = () => {
        let settings = {
            checkInTime: ["7", "00"],
            checkOutTime: ["16", "00"],
            autoConnectOnWifi: false,
            remindToCheckIn: false,
            remindToCheckOut: false,
            lunchDuration: 0,
            workingDays: {
                monday: false, 
                tuesday: false, 
                wednesday: false, 
                thursday: false, 
                friday: false, 
                saturday: false, 
                sunday: false,
            }
        }
    }

    wifiSetting = () => {
        if(!this.state.autoConnectOnWifi){
            this.props.navigation.navigate('WifiSettings')
        }
        this.setState(prevState => ({
            autoConnectOnWifi: !prevState.autoConnectOnWifi
        }))
        this.setState({settingsChanged: true})
    }

    checkInReminder = () => {
        this.setState(prevState => ({
            remindToCheckIn: !prevState.remindToCheckIn
        }))
        this.mySettings.remindToCheckIn = this.state.remindToCheckIn
        this.setState({settingsChanged: true})

    }

    checkOutReminder = () => {
        this.setState(prevState => ({
            remindToCheckOut: !prevState.remindToCheckOut
        }))
        this.mySettings.remindToCheckOut = this.state.remindToCheckOut
        this.setState({settingsChanged: true})

    }

    setWorkingHours = (direction, selectedDate) => {
        try {
            if(direction === "out"){
                this.setState({
                    checkOutHour: ("0"+parseInt(selectedDate.getHours())).substr(-2),
                    checkOutMinute: ("0"+parseInt(selectedDate.getMinutes())).substr(-2)
                })
                this.mySettings.checkOutTime = [this.state.checkOutHour, this.state.checkOutMinute]
                console.log("blabla: " + (new Date(((parseInt(this.state.checkOutHour)-1)*60+parseInt(this.state.checkOutMinute))*60*1000)))
                this.setState({showCheckOutTimePicker: false})
            }
            else{
                this.setState({
                    checkInHour: ("0"+parseInt(selectedDate.getHours())).substr(-2),
                    checkInMinute: ("0"+parseInt(selectedDate.getMinutes())).substr(-2)
                })
                this.mySettings.checkInTime = [this.state.checkInHour, this.state.checkInMinute]
                this.setState({showCheckInTimePicker: false})
            }
        }catch(e) {
            console.log("setWorkingHours error: " + e)
        }
        this.setState({settingsChanged: true})
    }

    saveSettingsButton = async () => {
        if(this.state.settingsChanged){
            await this.saveUserSettings()
            this.setState({settingsChanged: false})
            // this.props.navigation.navigate('HomeScreen')
        }
    }

    remindToSaveSettings = () => {
        Alert.alert(
            'Save settings?',
            '',
            [
                {text: 'Ignore',
                    onPress: () => this.props.navigation.navigate('HomeScreen'),
                    style: 'cancel',
                },
                {text: 'OK', onPress: () => this.saveSettingsButton()},
            ],
            {cancelable: false},
        );
    }

    render(){
        return(
            <Container>
                <Header>
                    <Left>
                        <NativeButton transparent onPress={() => this.state.settingsChanged ? this.remindToSaveSettings() : this.props.navigation.navigate('HomeScreen')}>
                            <Icon name="chevron-left" size={30} color="#fff" />
                        </NativeButton>
                    </Left>
                    <Body>
                        <Title>Settings</Title>
                    </Body>
                    <Right>
                        <NativeButton transparent onPress={() => this.saveSettingsButton()}>
                            <Icon name="save" size={30} color={this.state.settingsChanged ? "#fff" : "#9c9c9c"} />
                        </NativeButton>
                    </Right>
                </Header>
                {/* Normal check-in time */}
                <View style={[styles.settingsRectangle]}>
                    <View style={styles.settingsTextField}>
                        <Text style={{fontSize: 15, marginLeft: 10}}>
                            Normal check-in time
                        </Text>
                    </View>
                    {this.state.showCheckInTimePicker && (
                        <DateTimePicker
                            value={new Date(((parseInt(this.state.checkInHour)-1)*60+parseInt(this.state.checkInMinute))*60*1000)}
                            mode={'time'}
                            is24Hour={true}
                            display="clock"
                            onChange={(event, selectedDate) => {this.setState({showCheckInTimePicker: false});this.setWorkingHours("in", selectedDate)}}
                        />
                    )}
                    <TouchableOpacity
                        onPress={() => this.setState({showCheckInTimePicker: true})}
                        style={{flex: 1, width: windowWidth, flexDirection: 'row', alignContent: 'flex-end'}}>
                        <Text style={{flex: 1, fontSize: 25, alignSelf: 'center', textAlign: 'center'}}>
                            {this.state.checkInHour}:{this.state.checkInMinute}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.divider}/>
                {/* Normal check-out time */}
                <View style={[styles.settingsRectangle]}>
                    <View style={styles.settingsTextField}>
                        <Text style={{fontSize: 15, marginLeft: 10}}>
                            Normal check-out time
                        </Text>
                    </View>
                    {this.state.showCheckOutTimePicker && (
                        <DateTimePicker
                            value={new Date(((parseInt(this.state.checkOutHour)-1)*60+parseInt(this.state.checkOutMinute))*60*1000)}
                            mode={'time'}
                            is24Hour={true}
                            display="clock"
                            onChange={(event, selectedDate) => {this.setState({showCheckOutTimePicker: false});this.setWorkingHours("out", selectedDate)}}

                        />
                    )}
                    <TouchableOpacity
                        onPress={() => this.setState({showCheckOutTimePicker: true})}
                        style={{flex: 1, width: windowWidth, flexDirection: 'row', alignContent: 'flex-end'}}>
                        <Text style={{flex: 1, fontSize: 25, alignSelf: 'center', textAlign: 'center'}}>
                            {this.state.checkOutHour}:{this.state.checkOutMinute}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.divider}/>
                {/* First day of week */}
                {/* <View style={styles.settingsRectangle}>
                    <View style={styles.settingsTextField}>
                        <Text style={{fontSize: 15, marginLeft: 10}}>
                            First day of week
                        </Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                    <Form>
                        <Picker
                            note
                            mode="dropdown"
                            style={{ width: 100 }}
                            selectedValue={this.state.firstDayOfWeek}
                            onValueChange={(value) => this.setState({firstDayOfWeek: value})}
                        >
                        <Picker.Item label="Mon" value="mon" />
                        <Picker.Item label="Sun" value="sun" />
                    </Picker>
                </Form>
                    </View>
                </View>
                <View style={styles.divider}/> */}
                {/* Auto-check in on Wifi connection */}
                <View style={styles.settingsRectangle}>
                    <View style={styles.settingsTextField}>
                        <Text style={{fontSize: 15, marginLeft: 10}}>
                            Auto-check in on Wifi connection
                        </Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={this.wifiSetting}
                            value={this.state.autoConnectOnWifi}
                            style={{flex: 1}}
                        />
                    </View>
                </View>
                <View style={styles.divider}/>
                {/* Remind me to check in */}
                <View style={styles.settingsRectangle}>
                    <View style={styles.settingsTextField}>
                        <Text style={{fontSize: 15, marginLeft: 10}}>
                            Remind me to check in
                        </Text>
                    </View>
                    <View style={{flex: 1, alignContent: 'flex-start'}}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={this.checkInReminder}
                            value={this.state.remindToCheckIn}
                            style={{flex: 1}}
                        />
                    </View>
                </View>
                <View style={styles.divider}/>
                {/* Remind me to check out */}
                <View style={styles.settingsRectangle}>
                    <View style={styles.settingsTextField}>
                        <Text style={{fontSize: 15, marginLeft: 10}}>
                            Remind me to check out
                        </Text>
                    </View>
                    <View style={{flex: 1, alignContent: 'flex-start'}}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={this.checkOutReminder}
                            value={this.state.remindToCheckOut}
                            style={{flex: 1}}
                        />
                    </View>
                </View>
                <View style={styles.divider}/>
                {/* Lunch duration in minutes */}
                <View style={styles.settingsRectangle}>
                    <View style={styles.settingsTextField}>
                        <Text style={{fontSize: 15, marginLeft: 10}}>
                            Lunch duration in minutes
                        </Text>
                    </View>
                    <Popover
                        isVisible={this.state.lunchDurationScrollerVisibility}
                        mode={"rn-modal"}
                        popoverStyle={{width: 100}}
                        onRequestClose={() => this.setState({lunchDurationScrollerVisibility: false})}
                        >
                        <WheelPicker
                            style={{ flex: 1 }}
                            selectedValue={this.state.lunchDuration}
                            pickerData={[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90]}
                            onValueChange={value => this.setState({lunchDuration: value})}
                        />
                    </Popover>
                    <TouchableOpacity
                        onPress={() => this.setState({lunchDurationScrollerVisibility: true})}
                        style={{flex: 1, width: windowWidth, flexDirection: 'row', alignContent: 'flex-end'}}>
                        <Text style={{flex: 1, fontSize: 25, alignSelf: 'center', textAlign: 'center'}}>
                            {this.state.lunchDuration}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.divider}/>
                {/* Working days */}
                <View style={styles.settingsRectangle}>
                    <View style={styles.settingsTextField}>
                        <Text style={{fontSize: 15, marginLeft: 10}}>
                        Working days
                        </Text>
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.workingDaysCheckboxVisibility}
                        onRequestClose={() => {
                            this.setState({workingDaysCheckboxVisibility: false});
                        }}
                    >
                        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', height: windowHeight*0.5}}>
                            <View style={styles.modalView}>
                                <View style={styles.dayPickerLine}>
                                    <Text style={styles.dayText}>Monday</Text>
                                    <CheckBox
                                        value={this.state.workingDays.monday}
                                        disabled={false}
                                        onValueChange={(value) => this.setState(prevState => ({
                                            workingDays: {
                                                ...prevState.workingDays,
                                                monday: value
                                            }}))}
                                    />
                                </View>
                                <View style={styles.dayPickerLine}>
                                    <Text style={styles.dayText}>Tuesday</Text>
                                    <CheckBox
                                        value={this.state.workingDays.tuesday}
                                        disabled={false}
                                        onValueChange={(value) => this.setState(prevState => ({
                                            workingDays: {
                                                ...prevState.workingDays,
                                                tuesday: value
                                            }}))}
                                    />
                                </View>
                                <View style={styles.dayPickerLine}>
                                    <Text style={styles.dayText}>Wednesday</Text>
                                    <CheckBox
                                        value={this.state.workingDays.wednesday}
                                        disabled={false}
                                        onValueChange={(value) => this.setState(prevState => ({
                                            workingDays: {
                                                ...prevState.workingDays,
                                                wednesday: value
                                            }}))}
                                    />
                                </View>
                                <View style={styles.dayPickerLine}>
                                    <Text style={styles.dayText}>Thursday</Text>
                                    <CheckBox
                                        value={this.state.workingDays.thursday}
                                        disabled={false}
                                        onValueChange={(value) => this.setState(prevState => ({
                                            workingDays: {
                                                ...prevState.workingDays,
                                                thursday: value
                                            }}))}
                                    />
                                </View>
                                <View style={styles.dayPickerLine}>
                                    <Text style={styles.dayText}>Friday</Text>
                                    <CheckBox
                                        value={this.state.workingDays.friday}
                                        disabled={false}
                                        onValueChange={(value) => this.setState(prevState => ({
                                            workingDays: {
                                                ...prevState.workingDays,
                                                friday: value
                                            }}))}
                                    />
                                </View>
                                <View style={styles.dayPickerLine}>
                                    <Text style={styles.dayText}>Saturday</Text>
                                    <CheckBox
                                        value={this.state.workingDays.saturday}
                                        disabled={false}
                                        onValueChange={(value) => this.setState(prevState => ({
                                            workingDays: {
                                                ...prevState.workingDays,
                                                saturday: value
                                            }}))}
                                    />
                                </View>
                                <View style={styles.dayPickerLineWithoutBorder}>
                                    <Text style={styles.dayText}>Sunday</Text>
                                    <CheckBox
                                        value={this.state.workingDays.sunday}
                                        disabled={false}
                                        onValueChange={(value) => this.setState(prevState => ({
                                            workingDays: {
                                                ...prevState.workingDays,
                                                sunday: value
                                            }}))}
                                    />
                                </View>
                                <Button
                                    onPress={() => {
                                        this.setState({workingDaysCheckboxVisibility: false})
                                    }}
                                    title="Done"
                                    color="grey"
                                />
                            </View>
                        </View>
                    </Modal>
                    <TouchableOpacity
                        onPress={() => this.setState({workingDaysCheckboxVisibility: true})}
                        style={{flex: 1, width: windowWidth, flexDirection: 'row', alignContent: 'flex-end'}}>
                        <Text style={{flex: 1, fontSize: 12, alignSelf: 'center', textAlign: 'center'}}>
                            Press to select...
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.divider}/>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    divider: {
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    settingsRectangle: {
        flexDirection: 'row', 
        height: 50
    },
    settingsTextField: {
        flex: 5, 
        flexDirection: 'column', 
        alignSelf:'center'
    },
    modalView: {
        flex: 0,
        flexDirection: 'column',
        margin: 20,
        width: windowWidth*0.8,
        height: windowHeight*0.6,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    dayText: {
        flex: 1, 
        flexDirection: 'column',
        fontSize: 20,
    },
    dayPickerLine: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        maxHeight: 40, 
        borderBottomColor: '#cfd1d0', 
        borderBottomWidth: 1
    },
    dayPickerLineWithoutBorder: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        maxHeight: 40, 
    }
});