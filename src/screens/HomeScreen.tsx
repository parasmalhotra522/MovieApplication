import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, TextInput, Dimensions, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { getNowPlaying, getUpcoming, Movie } from '../api/tmdb';
import { colors } from '../theme';
import NowPlayingCard from '../components/NowPlaying';
import ComingCard from '../components/ComingCard';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [a, b] = await Promise.all([getNowPlaying(), getUpcoming()]);
        if (!mounted) return;
        setNow(a.slice(0, 6));
        setUpcoming(b.slice(0, 6));
      } catch (e) {
        console.error(e);
      } finally {
        mounted = false;
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <View style={s.screen}>
      <StatusBar barStyle="light-content" />
      {/* top bar */}
      <View style={s.top}>
        <View>
          <Text style={s.hello}>Welcome Khadafi👋</Text>
          <Text style={s.title}>Let's relax and watch a movie.</Text>
        </View>
        <Image source={{ uri: 'https://i.pravatar.cc/100?img=12' }} style={s.avatar} />
      </View>

      {/* search */}
      <View style={s.searchRow}>
        <Ionicons name="search" size={18} color="#8E8E93" style={{ marginLeft: 16 }} />
        <TextInput
          placeholder="Search movie, cinema, genre..."
          placeholderTextColor="#8E8E93"
          style={s.searchInput}
        />
      </View>

      {/* Now Playing */}
      

<View style={[s.rowHead, { marginVertical: 12 }]}>
  <Text style={s.h2}>Now Playing</Text>
  <TouchableOpacity>
    <Text style={s.seeAll}>See All</Text>
  </TouchableOpacity>
</View>
      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
      ) : (
        <>
          <FlatList
            data={now}
            keyExtractor={(item) => String(item.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onMomentumScrollEnd={ev => {
              const i = Math.round(ev.nativeEvent.contentOffset.x / width);
              setIndex(Math.max(0, Math.min(i, now.length - 1)));
            }}
            snapToInterval={width}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: (width - Math.min(0.62 * width, 260)) / 2 - 14 }}
            renderItem={({ item }) => (
              <NowPlayingCard
                movie={item}
                onPress={() => nav.navigate('Details', { id: item.id })}
              />
            )}
          />
          {/* dots */}
          <View style={s.dots}>
            {now.map((_, i) => (
              <View key={i} style={[s.dot, i === index && s.dotActive]} />
            ))}
          </View>

          {/* Coming Soon */}
          <View style={[s.rowHead, { marginTop: 16, marginBottom: 16 }]}>
  <Text style={s.h2}>Coming Soon</Text>
  <TouchableOpacity>
    <Text style={s.seeAll}>See All</Text>
  </TouchableOpacity>
</View>

          <FlatList
            data={upcoming}
            keyExtractor={(item) => String(item.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 12 }}
            renderItem={({ item }) => (
              <ComingCard
                movie={item}
                onPress={() => nav.navigate('Details', { id: item.id })}
              />
            )}
          />
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingTop: 52 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  hello: { color: colors.textDim, fontSize: 14 },
  title: { color: colors.text, fontSize: 18, fontWeight: '700', marginTop: 4, width: width - 100 },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.search,
    height: 44,
    borderRadius: 14
  },
  searchInput: { color: colors.text, paddingHorizontal: 10, flex: 1, fontSize: 14 },
  rowHead: { marginTop: 22, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  h2: { color: colors.text, fontSize: 20, fontWeight: '700' },
  seeAll: { color: "#F0B450", fontSize: 13 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3A3A3A', marginHorizontal: 3 },
  dotActive: { width: 14, height: 6, borderRadius: 3, backgroundColor: colors.accent }
});
