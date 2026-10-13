import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';
import { art as c } from './theme';

// 原創 Q 版金色佛像：螺髮肉髻、背光光芒、禪定印托明珠、金色寬瓣蓮台
export default function BuddhaArt({ height = 400 }: { height?: number }) {
  const rays = Array.from({ length: 24 }, (_, i) => i * 15);
  const curls: [number, number][] = [];
  for (let row = 0; row < 3; row++)
    for (let i = 0; i < 9 - row * 2; i++) curls.push([200 - (8 - row * 2) * 6.5 + i * 13, 128 + row * 14 - Math.abs(i - (4 - row)) * 2]);
  const back = [-70, -45, -22, 0, 22, 45, 70];
  const front = [-60, -30, 0, 30, 60];
  const petal = 'M200 470 C170 440 172 395 200 370 C228 395 230 440 200 470 Z';
  return (
    <Svg width={height * 0.8} height={height} viewBox="0 0 400 500">
      <Defs>
        <RadialGradient id="halo" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={c.haloInner} stopOpacity="1" />
          <Stop offset="0.7" stopColor={c.haloOuter} stopOpacity="0.55" />
          <Stop offset="1" stopColor={c.haloOuter} stopOpacity="0" />
        </RadialGradient>
        <RadialGradient id="skin" cx="45%" cy="40%" r="65%">
          <Stop offset="0" stopColor="#FFF0C2" /><Stop offset="1" stopColor={c.skin} />
        </RadialGradient>
        <LinearGradient id="robe" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={c.robeLight} /><Stop offset="1" stopColor={c.robe} />
        </LinearGradient>
        <LinearGradient id="petal" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFF6D8" /><Stop offset="1" stopColor={c.petalShade} />
        </LinearGradient>
        <RadialGradient id="pearl" cx="40%" cy="35%" r="60%">
          <Stop offset="0" stopColor="#FFFFFF" /><Stop offset="1" stopColor={c.haloOuter} />
        </RadialGradient>
      </Defs>

      {/* 背光 */}
      <G opacity="0.55">
        {rays.map((a) => (
          <Path key={a} d="M200 200 L193 20 L207 20 Z" fill={c.ray} transform={`rotate(${a} 200 200)`} />
        ))}
      </G>
      <Circle cx="200" cy="200" r="175" fill="url(#halo)" />
      <Circle cx="200" cy="165" r="105" fill="none" stroke={c.petalEdge} strokeWidth="3" opacity="0.5" />
      <Circle cx="200" cy="165" r="115" fill="none" stroke={c.petalEdge} strokeWidth="1.5" opacity="0.35" strokeDasharray="4 8" />

      {/* 後排蓮瓣 */}
      {back.map((a) => (
        <Path key={a} d={petal} fill="url(#petal)" stroke={c.petalEdge} strokeWidth="2" transform={`rotate(${a} 200 470) translate(0 -10) scale(1 1.05)`} />
      ))}

      {/* 身體與袈裟 */}
      <Path d="M130 395 C120 320 145 268 200 262 C255 268 280 320 270 395 Z" fill="url(#robe)" stroke={c.robeShade} strokeWidth="2.5" />
      <Path d="M200 262 C178 300 168 345 172 395" fill="none" stroke={c.sash} strokeWidth="5" strokeLinecap="round" />
      <Path d="M165 268 C185 290 215 290 235 268" fill="none" stroke={c.robeShade} strokeWidth="3" />
      {/* 盤腿 */}
      <Path d="M95 400 C100 365 150 352 200 360 C250 352 300 365 305 400 C300 425 100 425 95 400 Z" fill={c.robe} stroke={c.robeShade} strokeWidth="2.5" />
      <Path d="M130 395 C160 380 240 380 270 395" fill="none" stroke={c.robeShade} strokeWidth="2.5" />
      {/* 禪定印托明珠 */}
      <Ellipse cx="200" cy="378" rx="42" ry="14" fill={c.skin} stroke={c.skinShade} strokeWidth="2" />
      <Circle cx="200" cy="362" r="14" fill="url(#pearl)" stroke={c.petalEdge} strokeWidth="1.5" />
      <Circle cx="200" cy="362" r="24" fill={c.haloInner} opacity="0.35" />

      {/* 頭 */}
      <Ellipse cx="128" cy="200" rx="13" ry="30" fill={c.skin} stroke={c.skinShade} strokeWidth="2" />
      <Ellipse cx="272" cy="200" rx="13" ry="30" fill={c.skin} stroke={c.skinShade} strokeWidth="2" />
      <Ellipse cx="200" cy="190" rx="72" ry="74" fill="url(#skin)" stroke={c.skinShade} strokeWidth="2" />
      {/* 螺髮與低肉髻 */}
      <Path d="M128 175 C128 120 165 100 200 100 C235 100 272 120 272 175 C255 150 230 142 200 142 C170 142 145 150 128 175 Z" fill={c.hair} />
      <Ellipse cx="200" cy="100" rx="34" ry="22" fill={c.hair} />
      {curls.map(([x, y], i) => <Circle key={i} cx={x} cy={y} r="6" fill={c.hairDot} stroke={c.hair} strokeWidth="1.5" />)}
      {[-20, 0, 20].map((d) => <Circle key={d} cx={200 + d} cy={96} r="6" fill={c.hairDot} stroke={c.hair} strokeWidth="1.5" />)}
      <Circle cx="200" cy="76" r="7" fill={c.urna} />
      {/* 五官 */}
      <Circle cx="200" cy="172" r="4" fill={c.urna} />
      <Path d="M165 192 Q177 202 189 192" fill="none" stroke={c.line} strokeWidth="3.5" strokeLinecap="round" />
      <Path d="M211 192 Q223 202 235 192" fill="none" stroke={c.line} strokeWidth="3.5" strokeLinecap="round" />
      <Path d="M163 180 Q177 173 190 179" fill="none" stroke={c.line} strokeWidth="2" opacity="0.6" strokeLinecap="round" />
      <Path d="M210 179 Q223 173 237 180" fill="none" stroke={c.line} strokeWidth="2" opacity="0.6" strokeLinecap="round" />
      <Ellipse cx="160" cy="212" rx="11" ry="6" fill={c.cheek} opacity="0.45" />
      <Ellipse cx="240" cy="212" rx="11" ry="6" fill={c.cheek} opacity="0.45" />
      <Path d="M197 205 Q200 210 203 205" fill="none" stroke={c.skinShade} strokeWidth="2" strokeLinecap="round" />
      <Path d="M186 222 Q200 233 214 222" fill="none" stroke={c.line} strokeWidth="3" strokeLinecap="round" />
      <Path d="M185 252 Q200 258 215 252" fill="none" stroke={c.skinShade} strokeWidth="2" />

      {/* 前排蓮瓣 */}
      {front.map((a) => (
        <Path key={a} d="M200 498 C172 482 176 450 200 428 C224 450 228 482 200 498 Z" fill="url(#petal)" stroke={c.petalEdge} strokeWidth="2.5" transform={`rotate(${a * 1.3} 200 498)`} />
      ))}
      <Ellipse cx="200" cy="482" rx="120" ry="12" fill={c.petalEdge} opacity="0.5" />
    </Svg>
  );
}
