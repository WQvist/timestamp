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
        }
    }

    componentDidMount(){
    }

    componentWillUnmount(){

    }

    loadUserSettings(){

    }

    goToSettings = (navigation ) => {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Button onPress={() => this.props.navigation.navigate('Settings')} title="SETTINGS" />
            </View>
        );
    }

    startWorking = () => {
        this.setState({isWorking: true})
        let checkInTime = Math.floor(Date.now()/1000)
        console.log("Started working: " + checkInTime)
    }

    stopWorking = () => {
        this.setState({isWorking: false})
        let checkOutTime = Math.floor(Date.now()/1000)
        console.log("Stopped working: " + checkOutTime)
    }

    render(){
        const Drawer = createDrawerNavigator();

        return(
            // <NavigationContainer>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <Header>
                        <Left>
                            <NativeButton transparent onPress={() => this.props.navigation.navigate('Settings')}>
                                <Icon name="menu"  size={30} color="#fff" />
                            </NativeButton>
                        </Left>
                        <Body>
                            <Title>Home</Title>
                        </Body>
                        <Right>
                            <NativeButton transparent onPress={() => this.props.navigation.navigate('Statistics')}>
                                <Icon name="graph"  size={30} color="#fff" />
                            </NativeButton>
                        </Right>
                    </Header>
                    <View style={{flex: 5}}>
                        <Calendar
                            onDayPress={(day) => {console.log('Press', day)}}
                            onDayLongPress={(day) => {console.log('Long press', day)}}
                        />
                    </View>
                    
                    <View style={{flex: 4}}>
                        <View style={{backgroundColor: 'blue', flex: 0.5, marginLeft: '5%', marginRight: '5%', borderRadius: 20, flexDirection: 'column', alignContent: 'space-between'}}>
                            <Text style={{}}>
                                Hej
                            </Text>
                            <Text>
                                Hej1
                            </Text>
                            <Text>
                                Hej2
                            </Text>
                        </View>
                    </View>
                    <View style={{bottom: '5%', right: '5%', position: 'absolute'}}>
                        <TouchableHighlight
                            style={[styles.fab, (this.state.isWorking) ? styles.working : styles.notWorking]}
                            onPress={() => (this.state.isWorking) ? this.stopWorking() : this.startWorking()}>
                            <Icon name={this.state.isWorking ? "logout" : "control-play"}  size={30} color="#fff" />
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