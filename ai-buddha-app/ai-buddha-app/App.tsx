import { useRef, useState } from 'react';
import { Animated, useWindowDimensions, ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAudioPlayer } from 'expo-audio';
import BuddhaArt from './src/BuddhaArt';
import { colors, fonts, radius, space } from './src/theme';
import { answer as getAnswer, isCrisis, Sutra } from './src/logic';

export default function App() {
  return (<SafeAreaProvider><Main /></SafeAreaProvider>);
}

function Main() {
  const [worry, setWorry] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<Sutra[]>([]);
  const [crisis, setCrisis] = useState(false);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const { height: winH } = useWindowDimensions();
  const [titleH, setTitleH] = useState(70);
  const [panelH, setPanelH] = useState(190);
  const [footerH, setFooterH] = useState(40);
  // 佛像填滿剩餘高度：視窗 - 標題 - 輸入區 - 頁尾 - 間距
  const artH = Math.max(220, winH - insets.top - titleH - panelH - footerH - space.sm);
  const fade = useRef(new Animated.Value(1)).current;
  const player = useAudioPlayer(require('./assets/chime.wav'));

  const ask = async () => {
    const w = worry.trim();
    if (!w || loading) return;
    setLoading(true); setAnswer('');
    setCrisis(isCrisis(w));
    const r = await getAnswer(w);
    setSources(r.sources); setAnswer(r.text); setLoading(false);
    Animated.timing(fade, { toValue: 0.3, duration: 700, useNativeDriver: true }).start();
    try { player.seekTo(0); player.play(); } catch {}
  };

  const reset = () => {
    setAnswer(''); setCrisis(false); setWorry('');
    Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  };

  return (
    <View style={s.root}>
      <StatusBar style="dark" />
      {/* 固定背景層：佛像永遠不捲動 */}
      <Animated.View pointerEvents="none" style={[s.artLayer, { top: insets.top + titleH, opacity: fade }]}>
        <BuddhaArt height={artH} />
      </Animated.View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={{ flex: 1, paddingTop: insets.top }}>
          <View style={s.header} onLayout={(e) => setTitleH(e.nativeEvent.layout.height)}>
            <Text style={s.title}>智慧解語</Text>
            <Text style={s.subtitle}>說出你的心事，讓經典的智慧陪伴你</Text>
          </View>
          <View style={{ flex: 1 }}>
            {(!!answer || crisis) && (
              <View style={s.overlay}>
                <ScrollView contentContainerStyle={{ padding: space.lg }}>
                  {crisis && (
                    <View style={s.crisis}>
                      <Text style={s.crisisTitle}>你很重要，請讓人陪你一起度過</Text>
                      <Text style={s.crisisText}>☎ 安心專線 1925（24 小時）{'\n'}☎ 生命線 1995{'\n'}☎ 張老師專線 1980{'\n'}如有立即危險，請撥 119 或 110。</Text>
                    </View>
                  )}
                  {!!answer && (<>
                    <Text style={s.lotus}>🪷</Text>
                    <Text style={s.answer}>{answer}</Text>
                    <Text style={s.src}>參考經文：{sources.map((x) => `《${x.sutra}》`).join('、')}</Text>
                  </>)}
                </ScrollView>
              </View>
            )}
          </View>
          <View style={s.panel} onLayout={(e) => { if (!answer) setPanelH(e.nativeEvent.layout.height); }}>
            {answer ? (
              <Text style={s.asked} numberOfLines={2}>你的心事：{worry}</Text>
            ) : (
              <TextInput style={s.input} multiline value={worry} onChangeText={setWorry}
                placeholder="例如：最近工作壓力好大，晚上都睡不著……" placeholderTextColor={colors.subtext} />
            )}
            <Pressable style={({ pressed }) => [s.btn, pressed && { opacity: 0.8 }]} onPress={answer ? reset : ask}>
              {loading ? <ActivityIndicator color={colors.footerText} /> : <Text style={s.btnText}>{answer ? '🪷 再問一個' : '🙏 請賜智慧'}</Text>}
            </Pressable>
          </View>
        </View>
        <View style={[s.footer, { paddingBottom: space.sm + 2 + insets.bottom }]} onLayout={(e) => setFooterH(e.nativeEvent.layout.height)}>
          <Text style={s.footerText}>心情低落請撥 安心專線 1925（24 小時）</Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bgTop },
  scroll: { paddingHorizontal: space.lg },
  art: { alignItems: 'center' },
  header: { alignItems: 'center', paddingTop: space.sm },
  artLayer: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  overlay: { position: 'absolute', top: space.sm, bottom: space.sm, left: space.lg, right: space.lg, backgroundColor: colors.overlay, borderColor: colors.border, borderWidth: 1, borderRadius: radius + 4 },
  asked: { minHeight: 96, fontSize: fonts.body, color: colors.subtext, padding: space.md, backgroundColor: colors.card, borderRadius: radius, borderWidth: 1.5, borderColor: colors.border },
  panel: { marginHorizontal: space.lg, marginBottom: space.sm, backgroundColor: 'rgba(255,248,231,0.85)', borderRadius: radius + 4, padding: space.md },
  title: { fontSize: fonts.title, color: colors.goldDeep, fontWeight: '700', letterSpacing: 6, marginTop: space.xs },
  subtitle: { fontSize: fonts.small, color: colors.subtext, marginTop: space.xs },
  input: { minHeight: 96, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1.5, borderRadius: radius,
    padding: space.md, fontSize: fonts.body, color: colors.text, textAlignVertical: 'top' },
  btn: { marginTop: space.md, backgroundColor: colors.gold, borderRadius: radius, paddingVertical: space.md, alignItems: 'center' },
  btnText: { color: colors.footerText, fontSize: fonts.body + 2, fontWeight: '700', letterSpacing: 2 },
  crisis: { marginTop: space.lg, backgroundColor: colors.crisisBg, borderColor: colors.crisisBorder, borderWidth: 2, borderRadius: radius, padding: space.md },
  crisisTitle: { color: colors.crisisText, fontWeight: '700', fontSize: fonts.body + 1, marginBottom: space.xs },
  crisisText: { color: colors.crisisText, fontSize: fonts.body, lineHeight: 26 },
  card: { marginTop: space.lg, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: radius, padding: space.lg },
  lotus: { fontSize: 28, textAlign: 'center', marginBottom: space.sm },
  answer: { fontSize: fonts.body, lineHeight: 28, color: colors.text },
  src: { marginTop: space.md, fontSize: fonts.small, color: colors.subtext },
  footer: { backgroundColor: colors.footerBg, paddingVertical: space.sm + 2, alignItems: 'center' },
  footerText: { color: colors.footerText, fontSize: fonts.small + 1, fontWeight: '600' },
});
