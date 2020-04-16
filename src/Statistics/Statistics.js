import React, {Component} from 'react';
import { View, Text } from "react-native"
import { Container, Header, Content, Picker, Form } from "native-base";
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';

export default class Statistics extends Component{
    constructor() {
        super()
        this.state= {
            working: false,
            selected: "key1",
        }
    }

    componentDidMount(){
    }

    componentWillUnmount(){

    }

    onValueChange(value) {
        this.setState({
            selected: value
        });
    }

    loadUserSettings(){

    }

    render(){
        return(
            <Container>
                <View style={{backgroundColor: 'red'}}>
                    <Text>Hello statistics!</Text>
                </View>
            </Container>
        )
    }
}