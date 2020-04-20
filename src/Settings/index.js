import React, { Component } from "react";
import Settings from './Settings'
import WifiSettings from './WifiSettings'
import HomeScreen from "./../HomeScreen/HomeScreen";
import { StackNavigator } from "@react-navigation/stack";

export default (StackNavigator(
    {
        Settings: { screen: Settings },
        WifiSettings: { screen: WifiSettings },
        HomeScreen: { screen: HomeScreen }
    },
    {
        initialRouteName: "Settings"
    }
));