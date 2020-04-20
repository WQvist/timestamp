import React, {Component, useState} from 'react';
import { View, 
    Text, 
    Switch, 
    StyleSheet,
    Alert } from "react-native"
import { Container, 
    Header, 
    Content, 
    Picker, 
    Form, 
    Body, 
    Title, 
    Left, 
    Right, 
    Button as NativeButton } from "native-base"
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions'

export default class Settings extends Component{
    constructor() {
        super()
        this.state= {
            working: false,
            selected: "key1",
            autoConnectOnWifi: false,
            notifyEightHours: false,
        }
    }

    componentDidMount(){
        this.checkPermission()
    }

    componentWillUnmount(){

    }

    checkPermission = async () => {
        check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then(result => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    console.log("unavailable")
                    break;
                case RESULTS.DENIED:
                    request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
                    .then(result => {
                        if(result !== 'granted'){
                            alert("The app needs location permission to handle Wifi settings")
                            this.props.navigation.goBack()
                            request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
                        }
                    })
                    break;
                case RESULTS.GRANTED:
                    break;
                case RESULTS.BLOCKED:
                    alert("You need to permit location permission.")
                    console.log('The permission is denied and not requestable anymore');
                    break;
            }
        })
        .catch(error => {
            console.log("Permission error: " + error)
        });
    }

    infoText = () => {
        Alert.alert(
            'How this works',
            '1. In the list of Wifi connections, choose the Wifi at your office.',
            [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: true},
        );
    }

    render(){
        return(
            <Container>
                <Header>
                    <Left>
                        <NativeButton transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name="arrow-left"	size={15} color="#fff" />
                        </NativeButton>
                    </Left>
                    <Body>
                        <Title>Settings</Title>
                    </Body>
                    <Right>
                        <NativeButton transparent onPress={() => this.infoText()}>
                            <Icon name="info"	size={20} color="#fff" />
                        </NativeButton>
                    </Right>
                </Header>


            </Container>
        )
    }
}

const styles = StyleSheet.create({

});