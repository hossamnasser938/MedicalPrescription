import { StyleSheet } from 'react-native';
import { LOWER_BACKGROUND_C } from '../../utils/Colors';

const styles = StyleSheet.create( {
    outerContainer: {
        flexGrow: 1
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: LOWER_BACKGROUND_C
    },
    btnContainer: {
        width: "80%"
    }
} );

export default styles;