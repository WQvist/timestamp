import React, {Component, useState} from 'react';
import { View, 
    Text, 
    Switch, 
    StyleSheet,
    TouchableHighlight,
    Dimensions,
    Modal,
    Button } from "react-native"
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
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import { Picker as WheelPicker, DatePicker } from 'react-native-wheel-datepicker'
import Popover from 'react-native-popover-view'
import CheckBox from '@react-native-community/checkbox'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class Settings extends Component{
    constructor() {
        super()
        this.state= {
            working: false,
            firstDayOfWeek: "key1",
            autoConnectOnWifi: false,
            notifyEightHours: false,
            lunchDuration: 0,
            lunchDurationScrollerVisibility: false,
            workingDaysCheckboxVisibility: false,
            workingDays: {
                'monday': false, 
                'tuesday': false, 
                'wednesday': false, 
                'thursday': false, 
                'friday': false, 
                'saturday': false, 
                'sunday': false, }
        }
    }

    componentDidMount(){
    }

    componentWillUnmount(){

    }

    wifiSetting = () => {
        if(!this.state.autoConnectOnWifi){
            this.props.navigation.navigate('WifiSettings')
        }
        this.setState(prevState => ({
            autoConnectOnWifi: !prevState.autoConnectOnWifi
        }))
    }

    notifyOnFullDaysWork = () => {
        this.setState(prevState => ({
            notifyEightHours: !prevState.notifyEightHours
        }))
    }

    render(){
        return(
            <Container>
                <Header>
                    <Left>
                        <NativeButton transparent onPress={() => this.props.navigation.navigate('HomeScreen')}>
                            <Icon name="arrow-left"	size={15} color="#fff" />
                        </NativeButton>
                    </Left>
                    <Body>
                        <Title>Settings</Title>
                    </Body>
                    <Right/>
                </Header>
                {/* First day of week */}
                <View style={styles.settingsRectangle}>
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
                        <Picker.Item label="Mon" value="key0" />
                        <Picker.Item label="Sun" value="key1" />
                    </Picker>
                </Form>
                    </View>
                </View>
                <View style={styles.divider}/>
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
                {/* Notify when 8 hours worked */}
                <View style={styles.settingsRectangle}>
                    <View style={styles.settingsTextField}>
                        <Text style={{fontSize: 15, marginLeft: 10}}>
                            Notify when 8 hours worked
                        </Text>
                    </View>
                    <View style={{flex: 1, alignContent: 'flex-start'}}>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={this.notifyOnFullDaysWork}
                            value={this.state.notifyEightHours}
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
                    <TouchableHighlight
                        onPress={() => this.setState({lunchDurationScrollerVisibility: true})}
                        style={{flex: 1, width: windowWidth, flexDirection: 'row', alignContent: 'flex-end'}}>
                        <Text style={{flex: 1, fontSize: 25, alignSelf: 'center', textAlign: 'center'}}>
                            {this.state.lunchDuration}
                        </Text>
                    </TouchableHighlight>
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
                    <TouchableHighlight
                        onPress={() => this.setState({workingDaysCheckboxVisibility: true})}
                        style={{flex: 1, width: windowWidth, flexDirection: 'row', alignContent: 'flex-end'}}>
                        <Text style={{flex: 1, fontSize: 12, alignSelf: 'center', textAlign: 'center'}}>
                            Press to select...
                        </Text>
                    </TouchableHighlight>
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