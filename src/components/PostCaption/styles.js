import { StyleSheet } from 'react-native';
import { WHITE_C } from '../../utils/Colors';

const styles = StyleSheet.create( {
    container: {
        width: "100%",
        flexDirection: "row",
        backgroundColor: WHITE_C,
        borderColor: WHITE_C,
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 8,
        marginBottom: 8
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