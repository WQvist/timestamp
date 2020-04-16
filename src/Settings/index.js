import React, { Component } from "react";
import Settings from './Settings'
import HomeScreen from "./../HomeScreen/HomeScreen";
import { StackNavigator } from "@react-navigation/stack";

export default (StackNavigator(
    {
        Settings: { screen: Settings },
        HomeScreen: { screen: HomeScreen }
    },
    {
        initialRouteName: "Settings"
    }
));