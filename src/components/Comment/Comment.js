import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from './styles';

const Comment = props => (
    <View style = { styles.container }>
        <Image
          style = { styles.image }
          source = { { uri: props.userImageUrl } }
        />

        <View style = { styles.textsWrapper }>
            <Text style = { styles.userNameText }>{ props.userName }</Text>
            <Text style = { styles.commentText }>{ props.commentMessage }</Text>
        </View>
    </View>
);

export default Comment;