import { StyleSheet } from 'react-native';
import { WHITE_C } from '../../utils/Colors';

const styles = StyleSheet.create( {
    container: {
        width: "80%",
        flexDirection: "row",
        backgroundColor: WHITE_C,
        margin: 8
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
        padding: 4
    },
    textInput: {
        width: "100%",
        marginLeft: 4
    }
} );

export default styles;