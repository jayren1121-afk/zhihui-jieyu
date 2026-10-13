import sutrasRaw from '../assets/data/sutras.json';

export type Sutra = { id: number; sutra: string; chapter: string; text: string; plain: string; tags: string[]; cbeta: string; narrative?: boolean };
export const sutras = sutrasRaw as Sutra[];

const CRISIS = ['自殺', '想死', '不想活', '輕生', '結束生命', '活不下去', '去死', '割腕', '跳樓', '尋死', '了結自己'];
export const isCrisis = (s: string) => CRISIS.some((k) => s.includes(k));

// 心事關鍵字 → 主題標籤（同義詞越多命中，權重越高）
const SYN: Record<string, string[]> = {
  焦慮: ['焦慮', '緊張', '擔心', '不安', '煩惱', '心煩', '好煩', '壓力', '慌', '忐忑', '胡思亂想', '想太多'],
  失眠: ['失眠', '睡不著', '睡不好', '睡不著覺', '半夜醒', '整夜', '晚上都'],
  失戀: ['失戀', '分手', '前任', '前男友', '前女友', '感情', '男友', '女友', '男朋友', '女朋友', '愛情', '喜歡的人', '被甩', '劈腿', '暗戀', '離婚'],
  工作壓力: ['工作', '上班', '老闆', '主管', '同事', '加班', '業績', '職場', '升遷', '面試', '公司', '被裁', '失業', '專案', 'KPI', '壓力大'],
  家庭: ['家人', '家裡', '父母', '爸爸', '媽媽', '爸', '媽', '孩子', '小孩', '兒子', '女兒', '先生', '老公', '老婆', '太太', '婆婆', '兄弟', '姊妹', '吵架'],
  生死: ['死亡', '過世', '往生', '去世', '喪', '病逝', '告別式', '怕死', '死掉'],
  失去: ['失去', '過世', '往生', '離開了', '走了', '思念', '想念', '寵物', '再也見不到'],
  憤怒: ['生氣', '憤怒', '氣死', '討厭', '恨', '不爽', '吵架', '火大', '抓狂', '受不了', '報復'],
  迷惘: ['迷惘', '迷茫', '不知道', '方向', '意義', '未來', '徬徨', '選擇', '人生', '空虛', '茫然'],
  自卑: ['自卑', '沒用', '比不上', '不夠好', '沒自信', '醜', '失敗者', '廢物', '看不起自己', '沒價值'],
  信心: ['自信', '信心', '相信自己', '沒勇氣'],
  失敗: ['失敗', '落榜', '考不好', '搞砸', '挫折', '沒考上', '被拒絕', '做不好'],
  讀書: ['考試', '讀書', '學業', '成績', '功課', '升學', '報告', '論文', '學測'],
  金錢: ['錢', '債', '窮', '薪水', '經濟', '投資', '賠', '房貸', '卡債', '存款'],
  人際關係: ['朋友', '人際', '排擠', '霸凌', '誤會', '關係', '被孤立', '合不來', '同學'],
  委屈: ['委屈', '冤枉', '被欺負', '不公平', '被誤會', '背黑鍋'],
  批評: ['批評', '被罵', '被說', '指責', '閒話', '酸言', '被嫌'],
  後悔: ['後悔', '早知道', '遺憾', '自責', '做錯'],
  孤獨: ['孤單', '寂寞', '孤獨', '一個人', '沒人懂', '沒有朋友'],
  疾病: ['生病', '住院', '癌', '病痛', '開刀', '身體不好'],
  恐懼: ['恐懼', '害怕', '恐怖', '好怕'],
  比較: ['比較', '羨慕', '嫉妒', '別人都'],
  執著: ['放不下', '執著', '一直想', '忘不了', '走不出來'],
  知足: ['不滿足', '想要更多', '貪'],
};

export function detectTags(worry: string): Map<string, number> {
  const m = new Map<string, number>();
  for (const [tag, words] of Object.entries(SYN)) {
    const n = words.filter((w) => worry.includes(w)).length;
    if (n) m.set(tag, 1 + 0.5 * (n - 1));
  }
  return m;
}

export function retrieve(worry: string, k = 8): Sutra[] {
  const hit = detectTags(worry);
  const pool = sutras.filter((s) => !s.narrative);
  const scored = pool.map((s) => {
    let sc = 0;
    // 經文的第一個標籤是主題，權重最高
    s.tags.forEach((t, i) => { const w = hit.get(t); if (w) sc += w * (i === 0 ? 3 : i === 1 ? 2 : 1.5); });
    return { s, sc: sc + Math.random() * 0.3 };
  });
  scored.sort((a, b) => b.sc - a.sc);
  if (scored[0].sc < 1) {
    const g = pool.filter((s) => s.tags.some((t) => ['希望', '信心', '平靜', '迷惘'].includes(t)));
    return [...g].sort(() => Math.random() - 0.5).slice(0, k);
  }
  return scored.slice(0, k).map((x) => x.s);
}

const cite = (s: Sutra) => `《${s.sutra}》${s.chapter ? '・' + s.chapter : ''}`;

export function templateReply(worry: string, ps: Sutra[]): string {
  const p = ps[0];
  return `我聽見了你的心事，願意說出來，已經是很勇敢的一步。\n\n${cite(p)}云：\n「${p.text}」\n\n白話來說：${p.plain}\n\n小小建議：今天先做三次深長的呼吸，然後為自己或身邊的人做一件小小的好事、說一句好話。慢慢來，一切都會好起來的。`;
}

const SYS = '你是「智慧解語」，一位溫暖慈悲的佛法陪伴者，秉持「做好事、說好話、存好心」與「給人信心、歡喜、希望、方便」。請用台灣繁體中文回覆，約200字：1) 先同理對方感受；2) 從提供的候選經文中挑最貼切的一段，逐字引用原文並註明出處；3) 用白話解釋；4) 給一個今天就能做的小行動。嚴禁引用或編造未提供的經文。不做醫療或法律診斷。';

const candidates = (ps: Sutra[]) => ps.map((s) => `id=${s.id}｜出處：${cite(s)}\n原文：${s.text}\n白話：${s.plain}`).join('\n\n');

export type Reply = { text: string; sources: Sutra[]; provider: 'gemini' | 'openai' | 'template' };

// 安全檢查：回覆必須逐字包含所選經文的開頭
const quotes = (out: string, s: Sutra) => out.includes(s.text.slice(0, 6));

async function geminiReply(worry: string, ps: Sutra[]): Promise<Reply | null> {
  const key = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!key) return null;
  // 依序嘗試：自訂模型 → 免費層可用的 flash 模型（遇到 503 忙線或 404 時換下一個）
  const models = [...new Set([process.env.EXPO_PUBLIC_GEMINI_MODEL, 'gemini-flash-lite-latest', 'gemini-3-flash-preview', 'gemini-flash-latest'].filter(Boolean) as string[])];
  const prompt = `候選經文（只能從中選一段）：\n${candidates(ps)}\n\n使用者的心事：${worry}\n\n請輸出 JSON：{"id": 所選經文的 id（數字）, "reply": "完整回覆文字"}`;
  for (const model of models) {
  const r = await withTimeout(fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYS }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, responseMimeType: 'application/json' },
    }),
  }));
  if (!r.ok) continue;
  const j = await r.json();
  const raw: string = (j?.candidates?.[0]?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? '').join('');
  const o = JSON.parse(raw) as { id: number; reply: string };
  const pick = ps.find((s) => s.id === Number(o.id));
  if (!pick || !o.reply || !quotes(o.reply, pick)) return null;
  return { text: o.reply.trim(), sources: [pick], provider: 'gemini' };
  }
  return null;
}

async function openaiReply(worry: string, ps: Sutra[]): Promise<Reply | null> {
  const key = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!key) return null;
  const base = process.env.EXPO_PUBLIC_OPENAI_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.EXPO_PUBLIC_OPENAI_MODEL || 'gpt-4o-mini';
  const r = await withTimeout(fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, temperature: 0.7, messages: [
      { role: 'system', content: SYS },
      { role: 'user', content: `候選經文（只能從中選一段）：\n${candidates(ps)}\n\n使用者的心事：${worry}` },
    ] }),
  }));
  if (!r.ok) return null;
  const out: string | undefined = (await r.json())?.choices?.[0]?.message?.content;
  const pick = out ? ps.find((s) => quotes(out, s)) : undefined;
  return out && pick ? { text: out.trim(), sources: [pick], provider: 'openai' } : null;
}

function withTimeout<T>(p: Promise<T>, ms = 25000): Promise<T> {
  return Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
}

// Gemini 為預設，失敗則試 OpenAI，再不行用模板
export async function answer(worry: string): Promise<Reply> {
  const ps = retrieve(worry);
  for (const f of [geminiReply, openaiReply]) {
    try { const r = await f(worry, ps); if (r) return r; } catch { /* 改試下一個 */ }
  }
  return { text: templateReply(worry, ps), sources: [ps[0]], provider: 'template' };
}
