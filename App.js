import React from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Text,
	StatusBar,
} from 'react-native';
import 'react-native-gesture-handler'
import HomeScreen from './src/HomeScreen/HomeScreen.js'
import Settings from './src/Settings/Settings.js'
import Statistics from './src/Statistics/Statistics.js'
import {createStackNavigator} from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator()

function App(){
	return(
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerTitleStyle: {
						color: 'black'
					},
					headerShown: false
				}}
				>
				<Stack.Screen
					name="HomeScreen"
					component={HomeScreen}
				/>
				<Stack.Screen
					name="Settings"
					component={Settings}
				/>
				<Stack.Screen
					name="Statistics"
					component={Statistics}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default App;
