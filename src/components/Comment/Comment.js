import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Comment = props => (
    <View style = { styles.container }>
        <Image
          style = { styles.image }
          source = { { uri: props.userImageUrl } }
        />

        <View >
            <Text>{ props.userName }</Text>
            <Text>{ props.commentMessage }</Text>
        </View>
    </View>
);

const styles = StyleSheet.create( {
    container: {
        width: "80%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        margin: 5
    },
    image: {
        width: 100,
        height: 100
    }
} );

export default Comment;