import React, {Component} from 'react';
import { View, Text } from "react-native"
import { Container, Header, Content, Picker, Form } from "native-base";
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';

export default class Settings extends Component{
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
                <Header />
                <Content>
                <Form>
                    <Picker
                        note
                        mode="dropdown"
                        style={{ width: 120 }}
                        selectedValue={this.state.selected}
                        onValueChange={this.onValueChange.bind(this)}
                    >
                        <Picker.Item label="Wallet" value="key0" />
                        <Picker.Item label="ATM Card" value="key1" />
                        <Picker.Item label="Debit Card" value="key2" />
                        <Picker.Item label="Credit Card" value="key3" />
                        <Picker.Item label="Net Banking" value="key4" />
                    </Picker>
                </Form>
                </Content>
            </Container>
        )
    }
}