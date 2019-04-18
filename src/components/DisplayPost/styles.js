import { StyleSheet } from 'react-native';
import { LOWER_BACKGROUND_C, WHITE_C } from '../../utils/Colors';

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
    wrapper: {
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center"
    },
    textWrapper: {
        margin: 10
    },  
    text: {
        textAlign: "center", 
        color: WHITE_C,
        fontWeight: "bold"
    },
    imageWrapper: {
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
        width: 250,
        height: 250,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5
    },  
    image: {
        width: 250,
        height: 250,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5
    },
    btnContainer: {
        margin: 8
    } 
} );

export default styles;