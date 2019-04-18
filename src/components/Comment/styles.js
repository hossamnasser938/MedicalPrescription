import { StyleSheet } from 'react-native';
import { LOWER_BACKGROUND_C, WHITE_C } from '../../utils/Colors';

const styles = StyleSheet.create( {
    container: {
        width: "80%",
        flexDirection: "row",
        alignItems: "center",
        margin: 5
    },
    image: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: LOWER_BACKGROUND_C,
        borderRadius: 5 
    },
    textsWrapper: {
        justifyContent: "space-between",
        marginLeft: 5,
        marginRight: 5
    },
    userNameText: {
        fontSize: 18,
        fontWeight: "bold",
        color: WHITE_C
    },
    commentText: {
        color: WHITE_C
    }
} );

export default styles;