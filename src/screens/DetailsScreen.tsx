import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, ImageBackground, Dimensions, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { getMovieDetails, img, MovieDetails } from '../api/tmdb';
import { colors } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

function minsToHm(m?: number) {
  if (!m) return '';
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h}h ${mm}m`;
}

export default function DetailsScreen({ route, navigation }: any) {
  const { id } = route.params;
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [expanded, setExpanded] = useState(false);
  const toggleReadMore = () => setExpanded(!expanded);
  useEffect(() => {
    (async () => {
      const data = await getMovieDetails(id);
      setMovie(data);
    })();
  }, [id]);

  const director = useMemo(
    () => movie?.credits?.crew.find(c => c.job === 'Director')?.name ?? '—',
    [movie]
  );

  const trailerKey = useMemo(() => {
    const v = movie?.videos?.results?.find(v => v.site === 'YouTube' && v.type.includes('Trailer'));
    return v?.key;
  }, [movie]);

  if (!movie) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar barStyle="light-content" />
      </View>
    );
  }
  const displayText = expanded
    ? movie.overview
    : movie.overview.length > 100
      ? `${movie.overview.slice(0, 100)}...`
      : movie.overview;


  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} bounces={false}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={{ uri: img.backdrop(movie.backdrop_path)! }}
        style={{ width: '100%', height: width * 0.9, justifyContent: 'flex-start' }}
        resizeMode="cover"
      >
        <View style={s.backdropOverlay} />
        {/* back button */}
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={s.backBtn}>
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </TouchableOpacity>

        {/* info card */}
        <View style={s.infoCard}>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>{movie.title}</Text>
            <Text style={s.meta}>
              {(movie.release_date ?? '').slice(0, 4)} • {movie.genres?.[0]?.name ?? 'Adventure'} • {minsToHm(movie.runtime)}
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.8} style={s.saveBtn}>
            <Ionicons name="bookmark-outline" size={18} color={colors.text} />
          </TouchableOpacity>

          <View style={s.row}>
            <View style={s.dirChip}>
              <Image source={{ uri: 'https://i.pravatar.cc/100?img=32' }} style={s.dirAvatar} />
              <View style={{padding:5}}>
                <Text style={s.dirLabel}>Sutradara</Text>
                <Text style={s.dirName}>{director}</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={s.trailerBtn}
              onPress={() => {
                if (trailerKey) Linking.openURL(`https://www.youtube.com/watch?v=${trailerKey}`);
              }}
            >
              <Ionicons name="play" size={14} color={colors.text} />
              <Text style={s.trailerText}>Watch trailer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Synopsis */}
      
<View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
      <Text style={s.sectionTitle}>Synopsis</Text>
      <Text style={s.synopsis}>
        {displayText}
        {movie.overview.length > 100 && (
          <Text
            style={{ color: "#F0B450", fontWeight: '700' }}
            onPress={toggleReadMore}
          >
            {expanded ? ' Show Less' : ' Read More'}
          </Text>
        )}
      </Text>
    </View>

      {/* Cast */}
     

<View style={{ paddingHorizontal: 16, paddingTop: 8, marginTop:12 }}>
  <Text style={s.sectionTitle}>Cast</Text>
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingVertical: 10 }}
  >
    {movie.credits?.cast.slice(0, 12).map(c => (
      <View key={c.id} style={s.castChip}>
        <Image
          source={{ uri: img.profile(c.profile_path)! }}
          style={s.castAvatar}
        />
        <Text numberOfLines={1} style={s.castName}>
          {c.name}
        </Text>
      </View>
    ))}
  </ScrollView>
</View>






      {/* Cinema (static UI to match screenshot) */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <Text style={s.sectionTitle}>Cinema</Text>

        <View style={s.cinemaCard}>
          <View style={{ flex: 1 }}>
            <Text style={s.cinemaName}>HARTONO MALL CGV</Text>
            <Text style={s.cinemaSub}>4.53 Km | Jl. Ring Road Utara Jl. Kaliw...</Text>
          </View>
          <View style={s.cgvBadge}
          ><Text style={s.cgvText}>CGV</Text></View>
        </View>

        <View style={[s.cinemaCard, { borderColor: 'transparent', marginTop: 10 }]}>
          <View style={{ flex: 1 }}>
            <Text style={s.cinemaName}>LIPPO PLAZA JOGJA CINEPOLIS</Text>
          </View>
          <View style={s.cineBadge}><Text style={s.cgvText}>cinépolis</Text></View>
        </View>

        {/* Book Now (non-functional per requirement) */}
        <TouchableOpacity activeOpacity={0.9} style={s.bookBtn} disabled>
          <Text style={s.bookText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 28 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  backdropOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  backBtn: {
    marginTop: 52, marginLeft: 16,
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  infoCard: {
    position: 'absolute',
    left: 16, right: 16, bottom: 18,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 8
  },
  title: { color: colors.text, fontSize: 22, fontWeight: '800' },
  meta: { color: colors.textDim, marginTop: 6 },
  saveBtn: {
    position: 'absolute', right: 14, top: 14,
    width: 34, height: 34, borderRadius: 8, backgroundColor: '#2A2A2A',
    alignItems: 'center', justifyContent: 'center'
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  dirChip: { flexDirection: 'row', alignItems: 'center', padding: 8 },
  dirAvatar: { width: 42, height: 42, borderRadius: 8, marginRight: 8 },
  dirLabel: { color: colors.textDim, fontSize: 10 },
  dirName: { color: colors.text, fontWeight: '700', marginTop: 1 },
  trailerBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2A2A2A', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  trailerText: { color: colors.text, fontWeight: '700', fontSize: 12, marginLeft: 6 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 11, paddingBottom:5 },
  synopsis: { color: colors.textDim, lineHeight: 20 },
  // castChip: { backgroundColor: colors.chip, padding: 8, borderRadius: 12, marginRight: 10, width: 140, alignItems: 'center', flexDirection:'row' },
  castChip:{backgroundColor: colors.chip,
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 12,
  marginRight: 10,
  flexDirection: 'row',
  alignItems: 'center',
  flexShrink: 0, },
  castAvatar: { width: 44, height: 44, borderRadius: 8, marginBottom: 8,marginTop:8, marginRight:8, backgroundColor: '#333' },
  castName: { color: colors.text, fontSize: 12, fontWeight: '600' },
  cinemaCard: {
    // backgroundColor: colors.card,
    backgroundColor: 'rgba(255, 204, 102, 0.08)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    margin:10
    
  },
  cinemaName: { color: colors.text, fontWeight: '800', fontSize: 14 },
  cinemaSub: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  cgvBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#E6555A' },
  cineBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#19235F' },
  cgvText: { color: colors.text, fontWeight: '800', fontSize: 12 },
  bookBtn: { backgroundColor: colors.accent, borderRadius: 12, height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  bookText: { color: '#fff', fontWeight: '800', fontSize: 16 }
});
