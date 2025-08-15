import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { img, Movie } from '../api/tmdb';
import { colors } from '../theme';

const { width } = Dimensions.get('window');
const CARD_W = Math.min(0.62 * width, 260);
const CARD_H = CARD_W * 1.48;

export default function NowPlayingCard({ movie, onPress }: { movie: Movie; onPress: () => void }) {
  return (
    <TouchableOpacity style={s.card} activeOpacity={0.9} onPress={onPress}>
      <Image source={{ uri: img.poster(movie.poster_path, 'w780')! }} style={s.image} />
      <View style={s.titleWrap}>
        {/* <Text numberOfLines={1} style={s.title}>{movie.title}</Text> */}
      <Text
  numberOfLines={1}
  ellipsizeMode="tail"
  style={{
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  }}
>
  {movie.title}
</Text>
      
      <Text style={{
  color: colors.textDim,
  fontSize: 13,
  textAlign: 'center',
  marginTop: 2,
}}>
  {'Adventure'}
</Text>
        {/* <Text style={s.subtitle}>Adventure</Text> */}
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.card,
    marginHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8
  },
  image: { width: '100%', height: '100%' },
  titleWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.45)'
  },
  title: { color: colors.text, fontSize: 16, fontWeight: '700' },
  subtitle: { color: colors.textDim, fontSize: 12, marginTop: 2 }
});
