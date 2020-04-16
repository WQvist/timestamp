import HomeScreen from './HomeScreen'
import Settings from '../Settings/index'
import { StackNavigator } from '@react-navigation/stack'

const HomeScreenRouter = StackNavigator(
    {
        Home: {screen: HomeScreen},
        Settings: {screen: Settings}
    }
)

export default HomeScreenRouter