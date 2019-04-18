import { StyleSheet } from 'react-native';
import { LOWER_BACKGROUND_C } from '../../utils/Colors';

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: LOWER_BACKGROUND_C
    },
    wrapper: {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center"
    },
    text: {
        textAlign: "center", 
        color: "white"
    } 
} );

export default styles;