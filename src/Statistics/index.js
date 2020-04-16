import React, { Component } from "react";
import Statistics from './Statistics'
import HomeScreen from "./../HomeScreen/HomeScreen";
import { StackNavigator } from "@react-navigation/stack";

export default (StackNavigator(
    {
        Statistics: { screen: Settings },
        HomeScreen: { screen: HomeScreen }
    },
    {
        initialRouteName: "Statistics"
    }
));