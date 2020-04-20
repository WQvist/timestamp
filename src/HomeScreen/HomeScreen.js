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
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {Dimensions} from 'react-native';

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
        }
        this.checkInTimestamp = 0
        this.checkOutTimestamp = 0
	}

	componentDidMount(){
        this.getData()
	}

	componentWillUnmount(){
        this.saveData()
	}

	loadUserSettings = async () => {
        try {
            const value = await AsyncStorage.getItem('mySettings')
            if(value !== null) {
                console.log("getData done")
            }
            else{
				// Set standard settings
				console.log("no settings found")
            }
        } catch(e) {
            console.log("getData error")
        }
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
        this.setState({isWorking: true})
		let date = new Date()
		this.checkInTimestamp = Math.floor(date/1000)
		let hours = "0" + date.getHours()
		let minutes = "0" + date.getMinutes()
		let seconds = "0" + date.getSeconds()
        this.setState({checkInTime: hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)})
        this.setState({checkInDate: this.nameOfDay(date.getDay()) + " " + this.nameOfMonth(date.getMonth()) + " " + date.getDate() })
		this.setState({infoText: "Checked in since:"})
		console.log("Started working: " + this.checkInTimestamp)
	}

	stopWorking = () => {
        this.setState({isWorking: false})
		let date = new Date()
		this.checkOutTimestamp = Math.floor(date/1000)
		let hours = "0" + date.getHours()
		let minutes = "0" + date.getMinutes()
		let seconds = "0" + date.getSeconds()
        this.setState({checkOutTime: hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)})
        this.setState({checkOutDate: this.nameOfDay(date.getDay()) + " " + this.nameOfMonth(date.getMonth()) + " " + date.getDate() })
		this.setState({infoText: "Checked out since:"})
		console.log("Stopped working: " + this.checkOutTimestamp)
        // 8 hours = 28800 sec
        let timeWorked = (this.checkOutTimestamp - this.checkInTimestamp)
        let newDay = date.getFullYear() + '-' + ("0" + (date.getMonth()+1)).substr(-2) + '-' + date.getDate()
        if(timeWorked > 100){
            this.setState({
                eightHourDays: {
                    ...this.state.eightHourDays,
                    [newDay]: {selected: true, selectedColor: 'green'}
                }
            })
        }
        else{
            this.setState({
                eightHourDays: {
                    ...this.state.eightHourDays,
                    [newDay]: {selected: true, selectedColor: 'red'}
                }
            })
        }
	}

	render(){
		const Drawer = createDrawerNavigator();

		return(
			// <NavigationContainer>
				<View style={{ flex: 1, backgroundColor: 'white' }}>
					<Header>
						<Left>
							<NativeButton transparent onPress={() => this.props.navigation.navigate('Settings')}>
								<Icon name="menu"	size={20} color="#fff" />
							</NativeButton>
						</Left>
						<Body>
							<Title>Home</Title>
						</Body>
						<Right>
							<NativeButton transparent onPress={() => this.props.navigation.navigate('Statistics')}>
								<Icon name="graph"	size={30} color="#fff" />
							</NativeButton>
						</Right>
					</Header>
					<View style={{flex: 5}}>
						<Calendar
							onDayPress={(day) => {console.log('Press', day)}}
                            onDayLongPress={(day) => {console.log('Long press', day)}}
                            markedDates={this.state.eightHourDays}
						/>
					</View>
					
					<View style={{flex: 4}}>
						<View style={{backgroundColor: 'white', flex: 0.5, marginLeft: '5%', marginRight: '5%', flexDirection: 'column', alignContent: 'space-between'}}>
                            <Text style={{alignSelf: 'center',}}>
								{this.state.infoText}{"\n"}
							</Text>
                            {!this.state.isWorking ? 
                            <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
								<View style={{flex: 1}}>
									<Text style={{fontSize: 18}}>
										Today: 7.29/8.00 hrs
									</Text>
								</View>
								<View style={{flex: 1}}>
								<Text style={{fontSize: 18}}>
										This week: 11.42/40.00 hrs
									</Text>
								</View>
								<View style={{flex: 1}}>
								<Text style={{fontSize: 18}}>
										+/-: +12.18 hrs
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
							<Icon name={this.state.isWorking ? "logout" : "control-play"}	size={30} color="#fff" />
						</TouchableHighlight>
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