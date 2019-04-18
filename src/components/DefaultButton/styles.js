import { StyleSheet } from 'react-native';
import { UPPER_BACKGROUND_C, WHITE_C } from '../../utils/Colors';

const styles = StyleSheet.create( {
    container: {
        alignItems: "center",
        padding: 5,
        backgroundColor: UPPER_BACKGROUND_C,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: UPPER_BACKGROUND_C,
        margin: 8
    },
    buttonTitle: {
        fontSize: 18,
        textTransform: "uppercase",
        color: WHITE_C
    },
    enabled: {
        opacity: 1
    },
    disabled: {
        opacity: 0.3
    }
} );

export default styles;