import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { img, Movie } from '../api/tmdb';
import { colors } from '../theme';

export default function ComingCard({ movie, onPress }: { movie: Movie; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={s.wrap}>
      <View style={s.card}>
        {movie.poster_path && <Image source={{ uri: img.poster(movie.poster_path)! }} style={s.image} />}
      </View>
      <Text numberOfLines={1} style={s.title}>{movie.title}</Text>
      <Text numberOfLines={1} style={s.sub}>Action, Adventure, Comedy</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  wrap: { width: 270, marginHorizontal: 14 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    height: 110,
    overflow: 'hidden'
  },
  image: { width: '100%', height: '100%' },
  title: { color: colors.text, fontWeight: '700', marginTop: 8 },
  sub: { color: colors.textDim, fontSize: 12, marginTop: 2 }
});
