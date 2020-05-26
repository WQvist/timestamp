import React, {Component} from 'react';
import { View, 
	Text,
	Button,
	TouchableHighlight,
	StyleSheet } from "react-native"
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Header,
	Left,
	Right,
	Button as NativeButton,
	Icon as IconBase,
	Body,
	Title,
	Fab } from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Dimensions} from 'react-native';
import Modal from 'react-native-modal';
import * as RNFS from 'react-native-fs';
import Share from 'react-native-share';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class HomeScreen extends Component{
	constructor() {
		super()
		this.state= {
			isWorking: false,
			checkInTime: "",
            checkOutTime: "",
            checkInDate: "",
            checkOutDate: "",
            infoText: "Checked out since:",
			eightHourDays: {},
			hoursWorked: "0",
			minutesWorked: "00",
			modalVisible: false,
		}
		this.timer = 0
        this.checkInTimestamp = 0
		this.checkOutTimestamp = 0
		this.mySettings = {}
		this.currentState = {}	// {'isWorking': bool, 'hoursWorked': int, 'minutesWorked': int, 'checkInTime': string, 'checkInDate': string}
		this.workHistory = {}	// workHistory = {
								// 		"2020-04-27": {
								// 			checkIns: [timestamps],
								// 			checkOuts: [timestamps]
								// 		}
								// }
		this.currentDay = ""	// eg. 2020-04-27
		this.popupDayInfo = ""
		this.pressOnDayDate = ""
		this.pressOnDayCheckIn = ""
		this.pressOnDayCheckOut = ""
		this.pressOnDayFlexSum = ""
	}

	componentDidMount(){
		this.loadCurrentState()
		this.getData()
		this.loadWorkHistory()
		this.loadUserSettings()
		let date = new Date()
		this.currentDay = date.getFullYear() + '-' + ("0" + (date.getMonth()+1)).substr(-2) + '-' + ("0" + (date.getDate())).substr(-2)	// eg. 2020-04-27
	}

	componentWillUnmount(){
		this.saveCurrentState()
		this.saveData()
		this.saveWorkHistory()
	}

	loadCurrentState = async () => {
		try {
            const value = await AsyncStorage.getItem('currentState')
            if(value !== null) {
				console.log("loadCurrentState done")
				this.currentState = JSON.parse(value)
				if(this.currentState.isWorking){
					this.setState({
						isWorking: this.currentState.isWorking,
						hoursWorked: this.currentState.hoursWorked,
						minutesWorked: this.currentState.minutesWorked,
						checkInDate: this.currentState.checkInDate,
						checkInDate: this.currentState.checkInDate
					})
				}
				console.log("working? " + this.state.isWorking)
            }
            else{
				// Set standard settings
				console.log("loadCurrentState not found")
            }
        } catch(e) {
            console.log("loadCurrentState error")
        }
	}

	saveCurrentState = async () => {
		if(this.state.isWorking){
			this.currentState.isWorking = this.state.isWorking
			this.currentState.hoursWorked = this.state.hoursWorked
			this.currentState.minutesWorked = this.state.minutesWorked
			this.currentState.checkInDate = this.state.checkInTime
			this.currentState.checkInDate = this.state.checkInDate
		}
		else{
			this.currentState = {}
		}
		try {
			await AsyncStorage.setItem('currentState', JSON.stringify(this.currentState))
			console.log("saveCurrentState done")
		} catch (e) {
			console.log("saveCurrentState error")
		}
	}

	loadUserSettings = async () => {
        try {
            const value = await AsyncStorage.getItem('mySettings')
            if(value !== null) {
				console.log("loadUserSettings done")
				this.mySettings = JSON.parse(value)
				console.log("mySettings: " + this.mySettings)
				this.applySettings()
            }
            else{
				this.applyDefaultSettings()
				console.log("no settings found")
            }
        } catch(e) {
            console.log("loadUserSettings error: " + e)
        }
	}

	applyDefaultSettings = () => {
		this.mySettings = {
			checkInTime: ["7", "00"],
			checkOutTime: ["16", "00"],
			autoConnectOnWifi: false,
			notifyWhenFullDayWorked: false,
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
	}
	
	applySettings = () => {
		// this.mySettings = {
        //     checkInTime: ["7", "00"],
        //     checkOutTime: ["16", "00"],
        //     autoConnectOnWifi: false,
        //     notifyWhenFullDayWorked: false,
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
		console.log("applySettings")
		this.hoursInWorkday = this.mySettings.checkOutTime[0]-this.mySettings.checkOutTime[0]
		this.minutesInWorkday = this.mySettings.checkOutTime[1]-this.mySettings.checkOutTime[1]
		let daysToWork = 0
		for(const day in this.mySettings.workingDays){
			if(this.mySettings.workingDays.day){
				daysToWork+=1
			}
		}
		this.workWeekInHours = daysToWork*this.hoursInWorkday
		console.log("workWeekInHours: " + this.workWeekInHours)
	}
    
    saveData = async () => {
        try {
            await AsyncStorage.setItem('myDays', JSON.stringify(this.state.eightHourDays))
            console.log("saveData done")
        } catch (e) {
            console.log("saveData error")
        }
    }

    getData = async () => {
        try {
            const value = await AsyncStorage.getItem('myDays')
            if(value !== null) {
                this.setState({eightHourDays: JSON.parse(value)})
                console.log("getData done")
        }
        } catch(e) {
            console.log("getData error")
        }
	}

	saveWorkHistory = async () => {
        try {
            await AsyncStorage.setItem('workHistory', JSON.stringify(this.workHistory))
            console.log("saveWorkHistory done")
        } catch (e) {
            console.log("saveWorkHistory error")
        }
    }
	
	loadWorkHistory = async () => {
		// workHistory = {
		// 		"2020-04-27": {
		// 			checkIns: [],
		// 			checkOuts: []
		// 		}
		// }
        try {
            const value = await AsyncStorage.getItem('workHistory')
            if(value !== null) {
                this.workHistory = JSON.parse(value)
				console.log("loadWorkHistory done")
				console.log("this.workHistory: " + this.workHistory)
				console.log("JSON.parse(value): " + JSON.parse(value))
				for(day in this.workHistory){

				}
        }
        } catch(e) {
            console.log("loadWorkHistory error")
        }
	}

	goToSettings = (navigation ) => {
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Button onPress={() => this.props.navigation.navigate('Settings')} title="SETTINGS" />
			</View>
		);
	}

	nameOfDay = (dayNumber) => {
        let day = ""
		switch (dayNumber) {
			case 0:
				day = "Sunday";
				break;
			case 1:
				day = "Monday";
				break;
			case 2:
				day = "Tuesday";
				break;
			case 3:
				day = "Wednesday";
				break;
			case 4:
				day = "Thursday";
				break;
			case 5:
				day = "Friday";
				break;
			case 6:
				day = "Saturday";
            }
        return day
    }
    
    nameOfMonth = (monthNumber) => {
        let month = ""
		switch (monthNumber) {
			case 0:
				month = "January";
				break;
			case 1:
				month = "February";
				break;
			case 2:
				month = "March";
				break;
			case 3:
				month = "April";
				break;
			case 4:
				month = "May";
				break;
			case 5:
				month = "June";
				break;
			case 6:
                month = "July";
                break;
            case 7:
				month = "August";
				break;
			case 8:
				month = "September";
				break;
			case 9:
				month = "October";
				break;
			case 10:
				month = "November";
				break;
			case 11:
                month = "December";
        }
        return month
	}

	startWorking = () => {
		let date = new Date()
		this.timer = setInterval(this.howLongWorked, 1000*60)	// every minute
		this.setState({isWorking: true})
		this.checkInTimestamp = Math.floor(date/1000)
		if(!(this.currentDay in this.workHistory)){
			this.workHistory[this.currentDay] = {checkIns: [], checkOuts: []}
		}
		this.workHistory[this.currentDay].checkIns.push(this.checkInTimestamp)
		console.log("this.checkInTimestamp: " + this.checkInTimestamp)
		let hours = "0" + date.getHours()
		let minutes = "0" + date.getMinutes()
		let seconds = "0" + date.getSeconds()
        this.setState({checkInTime: hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)})
        this.setState({checkInDate: this.nameOfDay(date.getDay()) + " " + this.nameOfMonth(date.getMonth()) + " " + date.getDate() })
		this.setState({infoText: "Checked in since:"})
		console.log("Started working: " + this.checkInTimestamp)
		this.howLongWorked()
	}

	howLongWorked = () => {
		let sum = 0
		if(this.workHistory[this.currentDay].checkIns.length > 1){
			for(let i=0; i<this.workHistory[this.currentDay].checkIns.length-1; i++){
				// Note that last checkIn value has no corresponding checkOut value
				sum += (this.workHistory[this.currentDay].checkOuts[i] - this.workHistory[this.currentDay].checkIns[i])
			}
		}
		let date = new Date()
		let currentTimestamp = Math.floor(date/1000)
		let secondsWorked = currentTimestamp-this.checkInTimestamp + sum
		this.setState({hoursWorked: Math.floor(secondsWorked/3600)})
		this.setState({minutesWorked: ("0" + Math.floor((secondsWorked-this.state.hoursWorked*3600)/60)).substr(-2)})
	}

	summarizeWeek = () => {
		let date = new Date()
		let today = date.getDay()
	}

	stopWorking = () => {
		clearInterval(this.timer)
        this.setState({isWorking: false})
		let date = new Date()
		this.checkOutTimestamp = Math.floor(date/1000)
		this.workHistory[this.currentDay].checkOuts.push(this.checkOutTimestamp)
		let hours = "0" + date.getHours()
		let minutes = "0" + date.getMinutes()
		let seconds = "0" + date.getSeconds()
        this.setState({checkOutTime: hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)})
        this.setState({checkOutDate: this.nameOfDay(date.getDay()) + " " + this.nameOfMonth(date.getMonth()) + " " + date.getDate() })
		this.setState({infoText: "Checked out since:"})
		console.log("Stopped working: " + this.checkOutTimestamp)
        let timeWorked = (this.checkOutTimestamp - this.checkInTimestamp)
        if(timeWorked > 100){	// 8 hours = 28800 sec
            this.setState({
                eightHourDays: {
                    ...this.state.eightHourDays,
                    [this.currentDay]: {selected: true, selectedColor: 'green'}
                }
            })
        }
        else{
            this.setState({
                eightHourDays: {
                    ...this.state.eightHourDays,
                    [this.currentDay]: {selected: true, selectedColor: 'red'}
                }
            })
        }
	}

	pressOnDay(visible, day) {
		if(day){
			this.pressOnDayDate = day.dateString
			this.press
			this.calculateWorkingHoursInDay(day.dateString)
		}
		this.setState({ modalVisible: visible });
	}

	calculateWorkingHoursInDay = (day) => {
		let workingSum = 0
		for(let i=0; i<this.workHistory[day].checkIns.length; i++){
			workingSum += (this.workHistory[day].checkOuts[i] - this.workHistory[day].checkIns[i])
		}
		console.log("workingSum: " + workingSum)
		return workingSum
	}

	exportWorkHistory () {
		let path = RNFS.TemporaryDirectoryPath + "/workHistory.json"
		
		RNFS.writeFile(path, this.workHistory, 'utf8')
		.then((success) => {
			console.log('FILE WRITTEN to ' + path);
		})
		.catch((err) => {
			console.log(err.message);
		});

		Share.open({
			url: "file://" + path
		})
		.then((res) => {
			console.log(res) 
		})
		.catch((err) => { 
			console.log(err)
		});
	}

	render(){
		const Drawer = createDrawerNavigator();

		return(
			// <NavigationContainer>
				<View style={{ flex: 1, backgroundColor: 'white' }}>
					<Header>
						<Left>
							<NativeButton transparent onPress={() => this.props.navigation.navigate('Settings')}>
								<Icon name="settings"	size={20} color="#fff" />
							</NativeButton>
						</Left>
						<Body>
							<Title>Home</Title>
						</Body>
						<Right>
							<NativeButton transparent onPress={() => this.exportWorkHistory()}>
								<Icon name="share"	size={30} color="#fff" />
							</NativeButton>
						</Right>
					</Header>
					<View style={{flex: 6}}>
						<Calendar
							onDayPress={(day) => this.pressOnDay(true, day)}
                            onDayLongPress={(day) => {console.log('Long press', day)}}
							markedDates={this.state.eightHourDays}
							showWeekNumbers={true}
						/>
					</View>
					
					<View style={{flex: 4}}>
						<View style={{backgroundColor: 'white', flex: 0.5, marginLeft: '5%', marginRight: '5%', flexDirection: 'column', alignContent: 'space-between'}}>
                            <Text style={{alignSelf: 'center',}}>
								{this.state.infoText} {this.state.checkInTime} {"\n"}
							</Text>
                            {this.state.isWorking ? 
                            <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
								<View style={{flex: 1}}>
									<Text style={{fontSize: 18}}>
										Today: {this.state.hoursWorked}:{this.state.minutesWorked}/8:00 hrs
									</Text>
								</View>
								<View style={{flex: 1}}>
								<Text style={{fontSize: 18}}>
										This week: 11.42/40.00 hrs
									</Text>
								</View>
								<View style={{flex: 1}}>
								<Text style={{fontSize: 18}}>
										Flex: +12.18 hrs
									</Text>
								</View>
                                {/* <Text style={{alignSelf: 'center', fontSize: 20, color: 'green'}}>
                                    {this.state.checkInDate}
                                </Text>
                                <Text style={{alignSelf: 'center', fontSize: 60, color: 'green', fontWeight: 'bold'}}>
                                    {this.state.checkInTime}
                                </Text> */}
                            </View>
                            :
                            <View>
                                <Text style={{alignSelf: 'center', fontSize: 20, color: 'black'}}>
                                    {this.state.checkOutDate}
                                </Text>
                                <Text style={{alignSelf: 'center', fontSize: 60, color: 'black', fontWeight: 'bold'}}>
                                    {this.state.checkOutTime}
                                </Text>
                            </View>
                            }
						</View>
					</View>
					<View style={{bottom: '5%', right: '5%', position: 'absolute'}}>
						<TouchableHighlight
							style={[styles.fab, (this.state.isWorking) ? styles.working : styles.notWorking]}
							onPress={() => (this.state.isWorking) ? this.stopWorking() : this.startWorking()}>
							<Icon name={this.state.isWorking ? "stop" : "play-arrow"}	size={30} color="#fff" />
						</TouchableHighlight>
					</View>
					<View>
					<Modal animationType = {"none"} transparent = {true}
						visible = {this.state.modalVisible}
						onBackdropPress={() => {
							this.pressOnDay(!this.state.modalVisible)}}
						>
						<View style = {styles.modalView}>
							<Text style = {styles.text}>{this.pressOnDayDate}</Text>
							<Text style = {styles.text}>Working hours: </Text>
							<Text style = {styles.text}>Flex: </Text>
							<Text style = {styles.text}>{this.popupDayInfo}</Text>
						</View>
					</Modal>
				</View>
				</View>
				
				
			// </NavigationContainer>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 4,
		borderWidth: 0.5,
		borderColor: '#d6d7da',
	},
	modalView: {
		margin: 20,
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
	title: {
		fontSize: 19,
		fontWeight: 'bold',
	},
	activeTitle: {
		color: 'red',
	},
	fab: {
		alignItems:'center',
		justifyContent:'center',
		width:74,
		height:74,
		// backgroundColor:'#4287f5',
		borderRadius:37,
		elevation: 5
	},
	working: {
		backgroundColor: 'red'
	},
	notWorking: {
		backgroundColor: 'green'
	},
	statistics: {
		backgroundColor: 'white',
		width: windowWidth,
		height: windowHeight
	}
});