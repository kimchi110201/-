import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FlaskConical,
  Puzzle,
  ShoppingBag,
  Lock,
  Check,
  RotateCcw,
  Trophy,
  Coins,
  Timer,
  Eye,
  X,
  Sparkles,
  BookOpen,
  Award,
  Gift,
  Moon,
  Dice5,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* 데이터: 앙금(침전물) 목록                                            */
/* ------------------------------------------------------------------ */
const PRECIPITATES = [
  { id: "agcl", formula: "AgCl", name: "염화은", ions: "Ag⁺ + Cl⁻", color: "흰색", hex: "#F5F5F0", border: true, tier: "basic", tip: "질산은 용액에 소금물을 넣으면 뿌옇게 흐려지는 대표적인 흰색 앙금이에요." },
  { id: "agbr", formula: "AgBr", name: "브로민화은", ions: "Ag⁺ + Br⁻", color: "연노란색", hex: "#EDE1A6", tier: "basic", tip: "AgCl보다 살짝 노르스름한 크림색을 띠어요." },
  { id: "agi", formula: "AgI", name: "아이오딘화은", ions: "Ag⁺ + I⁻", color: "노란색", hex: "#E8C547", tier: "basic", tip: "은(Ag) 계열 앙금 중 가장 진한 노란색이에요." },
  { id: "ag2cro4", formula: "Ag2CrO4", name: "크로뮴산은", ions: "Ag⁺ + CrO4²⁻", color: "붉은색(암적색)", hex: "#B23A2E", tier: "basic", tip: "크로뮴산 이온이 만나면 벽돌 같은 붉은색이 돼요." },
  { id: "baso4", formula: "BaSO4", name: "황산바륨", ions: "Ba²⁺ + SO4²⁻", color: "흰색", hex: "#F5F5F0", border: true, tier: "basic", tip: "위장 조영제로도 쓰이는, 물에 거의 안 녹는 흰색 앙금이에요." },
  { id: "caco3", formula: "CaCO3", name: "탄산칼슘", ions: "Ca²⁺ + CO3²⁻", color: "흰색", hex: "#F5F5F0", border: true, tier: "basic", tip: "석회암, 조개껍데기, 달걀 껍데기의 주성분이에요." },
  { id: "pbcl2", formula: "PbCl2", name: "염화납", ions: "Pb²⁺ + Cl⁻", color: "흰색", hex: "#F5F5F0", border: true, tier: "basic", tip: "찬물엔 잘 안 녹지만 뜨거운 물엔 잘 녹는 흰색 앙금이에요." },
  { id: "pbi2", formula: "PbI2", name: "아이오딘화납", ions: "Pb²⁺ + I⁻", color: "노란색", hex: "#E8C547", tier: "basic", tip: "\"황금비\" 실험으로 유명한 반짝이는 노란색 앙금이에요." },
  { id: "cus", formula: "CuS", name: "황화구리", ions: "Cu²⁺ + S²⁻", color: "검은색", hex: "#1C1B1A", tier: "basic", tip: "황화물(S²⁻) 계열 앙금은 대부분 검은색이에요." },
  { id: "fes", formula: "FeS", name: "황화철", ions: "Fe²⁺ + S²⁻", color: "검은색", hex: "#1C1B1A", tier: "basic", tip: "철 이온과 황화 이온이 만나면 검은 앙금이 생겨요." },
  { id: "zns", formula: "ZnS", name: "황화아연", ions: "Zn²⁺ + S²⁻", color: "흰색", hex: "#F5F5F0", border: true, tier: "advanced", tip: "황화물인데도 예외적으로 흰색을 띠는 앙금이에요." },
  { id: "baco3", formula: "BaCO3", name: "탄산바륨", ions: "Ba²⁺ + CO3²⁻", color: "흰색", hex: "#F5F5F0", border: true, tier: "advanced", tip: "탄산 계열 앙금은 대부분 흰색이라는 규칙을 기억하세요." },
  { id: "caso4", formula: "CaSO4", name: "황산칼슘", ions: "Ca²⁺ + SO4²⁻", color: "흰색", hex: "#F5F5F0", border: true, tier: "advanced", tip: "석고(깁스)의 주성분이 되는 흰색 앙금이에요." },
  { id: "pbso4", formula: "PbSO4", name: "황산납", ions: "Pb²⁺ + SO4²⁻", color: "흰색", hex: "#F5F5F0", border: true, tier: "advanced", tip: "납축전지가 방전될 때도 생기는 흰색 앙금이에요." },
  { id: "pbcro4", formula: "PbCrO4", name: "크로뮴산납", ions: "Pb²⁺ + CrO4²⁻", color: "노란색", hex: "#E8C547", tier: "advanced", tip: "예전 도로 중앙선 노란 페인트에 쓰이던 안료예요." },
  { id: "feoh3", formula: "Fe(OH)3", name: "수산화철(Ⅲ)", ions: "Fe³⁺ + OH⁻", color: "붉은갈색", hex: "#A6531C", tier: "advanced", tip: "녹슨 쇠 색깔과 비슷한 붉은갈색 앙금이에요." },
  { id: "feoh2", formula: "Fe(OH)2", name: "수산화철(Ⅱ)", ions: "Fe²⁺ + OH⁻", color: "청록색(녹색)", hex: "#4C7A5E", tier: "advanced", tip: "공기 중에 두면 서서히 산화되어 갈색으로 변해요." },
  { id: "cuoh2", formula: "Cu(OH)2", name: "수산화구리", ions: "Cu²⁺ + OH⁻", color: "파란색", hex: "#3D6EA5", tier: "advanced", tip: "선명한 파란색이라 눈으로 구분하기 쉬워요." },
  { id: "aloh3", formula: "Al(OH)3", name: "수산화알루미늄", ions: "Al³⁺ + OH⁻", color: "흰색", hex: "#F5F5F0", border: true, tier: "advanced", tip: "말랑말랑한 젤리 같은 흰색 앙금이에요." },
  { id: "mgoh2", formula: "Mg(OH)2", name: "수산화마그네슘", ions: "Mg²⁺ + OH⁻", color: "흰색", hex: "#F5F5F0", border: true, tier: "advanced", tip: "제산제(마그밀)의 주성분인 흰색 앙금이에요." },
];

const BASIC_LIST = PRECIPITATES.filter((p) => p.tier === "basic");
const ADVANCED_LIST = PRECIPITATES.filter((p) => p.tier === "advanced");

/* ------------------------------------------------------------------ */
/* 데이터: 상점 아이템                                                   */
/* ------------------------------------------------------------------ */
const SHOP_ITEMS = [
  { id: "pastel", type: "theme", name: "파스텔 카드 뒷면", desc: "메모리 게임 카드 뒷면을 포근한 파스텔 톤으로 바꿔요.", price: 800 },
  { id: "neon", type: "theme", name: "네온 랩 카드 뒷면", desc: "어두운 실험실 분위기의 네온 카드 뒷면이에요.", price: 800 },
  { id: "gold", type: "theme", name: "골드 카드 뒷면", desc: "반짝이는 금색 카드 뒷면으로 꾸며요.", price: 1200 },
  { id: "advanced-deck", type: "deck", name: "심화 앙금 카드팩", desc: "전이금속·수산화물 등 10종의 심화 카드를 암기카드와 게임에 추가해요.", price: 2000 },
  { id: "hint-pack", type: "consumable", name: "힌트 토큰 3개", desc: "게임 중 모든 카드를 잠깐 보여주는 힌트를 3회 충전해요.", price: 600 },
  { id: "title-beginner", type: "title", name: "화학 초보", desc: "프로필에 표시되는 칭호예요.", price: 1000 },
  { id: "box-small", type: "randombox", name: "미스터리 상자 (소)", desc: "500 ~ 5,000 포인트 중 무작위로 즉시 획득해요.", price: 2000, min: 500, max: 5000 },
  { id: "title-intermediate", type: "title", name: "화학 중수", desc: "프로필에 표시되는 칭호예요.", price: 5000 },
  { id: "title-master", type: "title", name: "화학 마스터", desc: "프로필에 표시되는 칭호예요.", price: 10000 },
  { id: "box-midium", type: "randombox", name: "미스터리 상자 (중)", desc: "4,000 ~ 40,000 포인트 중 무작위로 즉시 획득해요.", price: 20000, min: 4000, max: 40000 },
  { id: "box-large", type: "randombox", name: "미스터리 상자 (대)", desc: "10,000 ~ 110,000 포인트 중 무작위로 즉시 획득해요.", price: 50000, min: 10000, max: 110000 },
  { id: "title-luck", type: "title", name: "운의 신", desc: "프로필에 표시되는 전설의 칭호예요.", price: 500000 },
  { id: "reward-mentos", type: "reward", name: "멘토스", desc: "실물 간식 교환권이에요. 구매 후 직접 확인받고 받아가세요.", price: 400000 },
  { id: "reward-mychew-1", type: "reward", name: "마이쮸 1알", desc: "실물 간식 교환권이에요. 구매 후 직접 확인받고 받아가세요.", price: 300000 },
  { id: "reward-mychew-pack", type: "reward", name: "마이쮸 1줄", desc: "실물 간식 교환권이에요. 구매 후 직접 확인받고 받아가세요.", price: 700000 },
  { id: "reward-cyber-burger", type: "reward", name: "싸이버거 1개", desc: "실물 간식 교환권이에요. 구매 후 직접 확인받고 받아가세요.", price: 900000 },
];

const DEFAULT_PROFILE = {
  points: 100,
  themes: [],
  advancedUnlocked: false,
  hintTokens: 0,
  selectedTheme: "default",
  titles: [],
  equippedTitle: null,
  redeemed: {},
};

/* ------------------------------------------------------------------ */
/* 유틸                                                                 */
/* ------------------------------------------------------------------ */
function FormulaText({ formula, className }) {
  const parts = formula.split(/(\d+)/).filter(Boolean);
  return (
    <span className={className}>
      {parts.map((p, i) =>
        /^\d+$/.test(p) ? <sub key={i}>{p}</sub> : <React.Fragment key={i}>{p}</React.Fragment>
      )}
    </span>
  );
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(sec) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/* ------------------------------------------------------------------ */
/* 최상위 컴포넌트                                                       */
/* ------------------------------------------------------------------ */
export default function App() {
  const [tab, setTab] = useState("flashcards");
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loaded, setLoaded] = useState(false);
  const shopClickCountRef = useRef(0);
  const shopClickTimerRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("profile", false);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          setProfile({ ...DEFAULT_PROFILE, ...parsed });
        }
      } catch (e) {
        // 저장된 값이 없으면 기본값 사용
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persist = useCallback(async (next) => {
    setProfile(next);
    try {
      await window.storage.set("profile", JSON.stringify(next), false);
    } catch (e) {
      // 저장 실패해도 화면 진행은 계속
    }
  }, []);

  const addPoints = useCallback(
    (amount) => {
      setProfile((prev) => {
        const next = { ...prev, points: prev.points + amount };
        window.storage.set("profile", JSON.stringify(next), false).catch(() => {});
        return next;
      });
    },
    []
  );

  const spendHint = useCallback(() => {
    let ok = false;
    setProfile((prev) => {
      if (prev.hintTokens <= 0) return prev;
      ok = true;
      const next = { ...prev, hintTokens: prev.hintTokens - 1 };
      window.storage.set("profile", JSON.stringify(next), false).catch(() => {});
      return next;
    });
    return ok;
  }, []);

  const buyItem = useCallback(
    (item) => {
      if (profile.points < item.price) return null;
      let next = { ...profile, points: profile.points - item.price };
      let reward = null;
      if (item.type === "theme") {
        if (!next.themes.includes(item.id)) next.themes = [...next.themes, item.id];
      } else if (item.type === "deck") {
        next.advancedUnlocked = true;
      } else if (item.type === "consumable") {
        next.hintTokens = (next.hintTokens || 0) + 3;
      } else if (item.type === "title") {
        const titles = next.titles || [];
        if (!titles.includes(item.id)) next.titles = [...titles, item.id];
        if (!next.equippedTitle) next.equippedTitle = item.id;
      } else if (item.type === "randombox") {
        reward = Math.floor(Math.random() * (item.max - item.min + 1)) + item.min;
        next.points += reward;
      } else if (item.type === "reward") {
        const redeemed = next.redeemed || {};
        next.redeemed = { ...redeemed, [item.id]: (redeemed[item.id] || 0) + 1 };
      }
      persist(next);
      return reward;
    },
    [profile, persist]
  );

  const applyTheme = useCallback(
    (themeId) => {
      persist({ ...profile, selectedTheme: themeId });
    },
    [profile, persist]
  );

  const applyTitle = useCallback(
    (titleId) => {
      persist({ ...profile, equippedTitle: titleId });
    },
    [profile, persist]
  );

  const resetProgress = useCallback(() => {
    persist(DEFAULT_PROFILE);
  }, [persist]);

  const handleShopTabClick = useCallback(() => {
    if (shopClickTimerRef.current) clearTimeout(shopClickTimerRef.current);
    shopClickCountRef.current += 1;
    if (shopClickCountRef.current >= 5) {
      shopClickCountRef.current = 0;
      setTab("nightmarket");
      return;
    }
    setTab("shop");
    shopClickTimerRef.current = setTimeout(() => {
      shopClickCountRef.current = 0;
    }, 650);
  }, []);

  if (!loaded) {
    return (
      <div style={styles.appRoot}>
        <style>{globalCss}</style>
        <div style={{ padding: 40, textAlign: "center", color: "#B9B2A0" }}>불러오는 중…</div>
      </div>
    );
  }

  return (
    <div style={styles.appRoot}>
      <style>{globalCss}</style>

      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={styles.logoBadge}>
            <FlaskConical size={20} color="#F3EFE3" />
          </div>
          <div>
            <div className="font-display" style={{ fontSize: 22, color: "#F3EFE3", lineHeight: 1.1 }}>
              앙금 암기실
            </div>
            <div style={{ fontSize: 11.5, color: "#8B8577", letterSpacing: 0.3, display: "flex", alignItems: "center", gap: 6 }}>
              화학 반응 침전물, 색깔로 기억하기
              {profile.equippedTitle && (
                <span style={styles.titleBadge}>
                  <Award size={11} color="#D9A441" />
                  {SHOP_ITEMS.find((i) => i.id === profile.equippedTitle)?.name}
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={styles.pointPill}>
          <Coins size={16} color="#D9A441" />
          <span style={{ fontWeight: 700, color: "#F0DBA6" }}>{profile.points.toLocaleString()}</span>
          <span style={{ fontSize: 11, color: "#8B8577" }}>P</span>
        </div>
      </header>

      <nav style={styles.tabBar}>
        <TabButton icon={BookOpen} label="암기카드" active={tab === "flashcards"} onClick={() => setTab("flashcards")} />
        <TabButton icon={Puzzle} label="메모리게임" active={tab === "memory"} onClick={() => setTab("memory")} />
        <TabButton icon={ShoppingBag} label="상점" active={tab === "shop"} onClick={handleShopTabClick} />
      </nav>

      <main style={styles.main}>
        {tab === "flashcards" && <FlashcardsTab advancedUnlocked={profile.advancedUnlocked} onGoShop={() => setTab("shop")} />}
        {tab === "memory" && (
          <MemoryGameTab
            profile={profile}
            addPoints={addPoints}
            spendHint={spendHint}
            onGoShop={() => setTab("shop")}
          />
        )}
        {tab === "shop" && (
          <ShopTab profile={profile} buyItem={buyItem} applyTheme={applyTheme} applyTitle={applyTitle} resetProgress={resetProgress} />
        )}
        {tab === "nightmarket" && (
          <NightMarketTab profile={profile} addPoints={addPoints} onExit={() => setTab("shop")} />
        )}
      </main>
    </div>
  );
}

function TabButton({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ ...styles.tabBtn, ...(active ? styles.tabBtnActive : {}) }}>
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* 탭 1: 암기 카드                                                       */
/* ------------------------------------------------------------------ */
function FlashcardsTab({ advancedUnlocked, onGoShop }) {
  const [filter, setFilter] = useState("all"); // all | basic | advanced

  const list = PRECIPITATES.filter((p) => filter === "all" || p.tier === filter);

  return (
    <div>
      <div style={styles.filterRow}>
        {[
          ["all", "전체"],
          ["basic", "기본"],
          ["advanced", "심화"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{ ...styles.filterBtn, ...(filter === key ? styles.filterBtnActive : {}) }}
          >
            {label}
          </button>
        ))}
        {!advancedUnlocked && (
          <button onClick={onGoShop} style={styles.unlockHint}>
            <Lock size={12} /> 심화 카드는 상점에서 잠금 해제
          </button>
        )}
      </div>

      <div style={styles.cardGrid}>
        {list.map((p) => (
          <FlashCard key={p.id} data={p} locked={p.tier === "advanced" && !advancedUnlocked} />
        ))}
      </div>
    </div>
  );
}

function FlashCard({ data, locked }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="flip-card"
      onClick={() => !locked && setFlipped((f) => !f)}
      style={{ cursor: locked ? "not-allowed" : "pointer" }}
    >
      <div className={`flip-inner ${flipped && !locked ? "flipped" : ""}`}>
        {/* 앞면: 화학식 */}
        <div className="flip-face paper-card" style={styles.flashFront}>
          <span className="punch-hole" />
          {locked ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.65 }}>
              <Lock size={22} color="#8B8577" />
              <span style={{ fontSize: 11, color: "#8B8577" }}>잠김</span>
            </div>
          ) : (
            <>
              <FormulaText formula={data.formula} className="font-mono-chem" />
              <span style={{ fontSize: 10.5, color: "#9B8F73", marginTop: 10 }}>탭해서 색깔 확인 →</span>
            </>
          )}
        </div>
        {/* 뒷면: 색깔 정보 */}
        <div className="flip-face flip-back paper-card" style={styles.flashBack}>
          <span className="punch-hole" />
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              background: data.hex,
              border: data.border ? "1.5px solid #C9C2AC" : "1.5px solid rgba(0,0,0,0.12)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              marginBottom: 8,
            }}
          />
          <div style={{ fontWeight: 700, fontSize: 14.5 }}>{data.color}</div>
          <div style={{ fontSize: 12, color: "#5B5747", marginTop: 2 }}>{data.name}</div>
          <div className="font-mono-chem" style={{ fontSize: 10.5, color: "#7A7461", marginTop: 4 }}>
            {data.ions}
          </div>
          <div style={{ fontSize: 10, color: "#8B8577", marginTop: 8, lineHeight: 1.4, textAlign: "center" }}>
            {data.tip}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 탭 2: 메모리 게임                                                     */
/* ------------------------------------------------------------------ */
function colorOf(precipitateId) {
  return PRECIPITATES.find((p) => p.id === precipitateId)?.color;
}

function MemoryGameTab({ profile, addPoints, spendHint, onGoShop }) {
  const [status, setStatus] = useState("idle"); // idle | playing | won
  const [pairCount, setPairCount] = useState(8);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [peeking, setPeeking] = useState(false);
  const [earned, setEarned] = useState(0);
  const timerRef = useRef(null);

  const pool = profile.advancedUnlocked ? PRECIPITATES : BASIC_LIST;

  useEffect(() => {
    if (status === "playing") {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [status]);

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [i, j] = flipped;
    const a = cards[i];
    const b = cards[j];
    if (a && b && a.kind !== b.kind && colorOf(a.precipitateId) === colorOf(b.precipitateId)) {
      const t = setTimeout(() => {
        setCards((prev) => prev.map((c, idx) => (idx === i || idx === j ? { ...c, matched: true } : c)));
        setMatchedCount((n) => n + 1);
        setFlipped([]);
      }, 380);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setCards((prev) => prev.map((c, idx) => (idx === i || idx === j ? { ...c, flipped: false } : c)));
        setFlipped([]);
      }, 850);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped]);

  useEffect(() => {
    if (status === "playing" && pairCount > 0 && matchedCount === pairCount) {
      clearInterval(timerRef.current);
      const score = Math.max(200, Math.round((100 + pairCount * 5 - moves * 4 - seconds * 0.5) * 10));
      setEarned(score);
      addPoints(score);
      setStatus("won");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedCount]);

  function startGame(n) {
    const chosen = shuffle(pool).slice(0, n);
    const built = shuffle(
      chosen.flatMap((p) => [
        { uid: `${p.id}-f`, precipitateId: p.id, kind: "formula", flipped: false, matched: false },
        { uid: `${p.id}-c`, precipitateId: p.id, kind: "color", flipped: false, matched: false },
      ])
    );
    setCards(built);
    setPairCount(n);
    setFlipped([]);
    setMatchedCount(0);
    setMoves(0);
    setSeconds(0);
    setEarned(0);
    setStatus("playing");
  }

  function handleClick(idx) {
    if (status !== "playing" || peeking) return;
    const c = cards[idx];
    if (!c || c.flipped || c.matched || flipped.length === 2) return;
    setCards((prev) => prev.map((cc, i) => (i === idx ? { ...cc, flipped: true } : cc)));
    setFlipped((prev) => [...prev, idx]);
    if (flipped.length === 1) setMoves((m) => m + 1);
  }

  function handleHint() {
    if (status !== "playing" || profile.hintTokens <= 0 || peeking) return;
    const ok = spendHint();
    if (!ok) return;
    setPeeking(true);
    setTimeout(() => setPeeking(false), 1400);
  }

  const themeClass = `cardback-${profile.selectedTheme || "default"}`;

  if (status === "idle") {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div className="paper-card" style={{ padding: "26px 22px", textAlign: "center" }}>
          <span className="punch-hole" />
          <Puzzle size={28} color="#20242B" style={{ marginBottom: 8 }} />
          <div className="font-display" style={{ fontSize: 19, marginBottom: 6 }}>
            앙금 짝 맞추기
          </div>
          <div style={{ fontSize: 12.5, color: "#5B5747", marginBottom: 18, lineHeight: 1.6 }}>
            화학식 카드와 색깔 카드의 짝을 맞춰보세요.
            <br />
            빠르고 적은 시도로 클리어할수록 포인트를 더 많이 받아요.
          </div>
          <div style={{ fontSize: 11.5, color: "#8B8577", marginBottom: 8 }}>난이도 선택</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              [6, "쉬움"],
              [8, "보통"],
              [10, "어려움"],
            ].map(([n, label]) => (
              <button key={n} onClick={() => startGame(n)} style={styles.difficultyBtn}>
                <div style={{ fontWeight: 700 }}>{n}쌍</div>
                <div style={{ fontSize: 10, color: "#8B8577" }}>{label}</div>
              </button>
            ))}
          </div>
          {!profile.advancedUnlocked && (
            <div style={{ marginTop: 14, fontSize: 10.5, color: "#8B8577" }}>
              상점에서 심화 카드팩을 열면 더 다양한 카드가 등장해요.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.gameStatRow}>
        <div style={styles.statChip}>
          <RotateCcw size={13} /> {moves}회
        </div>
        <div style={styles.statChip}>
          <Timer size={13} /> {formatTime(seconds)}
        </div>
        <button
          style={{ ...styles.statChip, cursor: profile.hintTokens > 0 ? "pointer" : "default", opacity: profile.hintTokens > 0 ? 1 : 0.5 }}
          onClick={handleHint}
        >
          <Eye size={13} /> 힌트 {profile.hintTokens}
        </button>
        <button style={styles.statChip} onClick={() => setStatus("idle")}>
          <X size={13} /> 그만하기
        </button>
      </div>

      <div style={styles.memoryGrid}>
        {cards.map((c, idx) => {
          const p = PRECIPITATES.find((x) => x.id === c.precipitateId);
          const isUp = c.flipped || c.matched || peeking;
          return (
            <div className="flip-card memory-cell" key={c.uid} onClick={() => handleClick(idx)}>
              <div className={`flip-inner ${isUp ? "flipped" : ""}`}>
                <div className={`flip-face cardback ${themeClass}`}>
                  <FlaskConical size={16} color="rgba(255,255,255,0.35)" />
                </div>
                <div
                  className="flip-face flip-back paper-card"
                  style={{
                    ...styles.memoryFace,
                    ...(c.matched ? { outline: "2px solid #6E9E7B" } : {}),
                  }}
                >
                  {c.kind === "formula" ? (
                    <FormulaText formula={p.formula} className="font-mono-chem" />
                  ) : (
                    <>
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: p.hex,
                          border: p.border ? "1.5px solid #C9C2AC" : "1.5px solid rgba(0,0,0,0.12)",
                          marginBottom: 4,
                        }}
                      />
                      <span style={{ fontSize: 10 }}>{p.color}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {status === "won" && (
        <div style={styles.modalOverlay}>
          <div className="paper-card" style={styles.modalCard}>
            <span className="punch-hole" />
            <Trophy size={30} color="#D9A441" />
            <div className="font-display" style={{ fontSize: 20, margin: "8px 0 4px" }}>
              클리어!
            </div>
            <div style={{ fontSize: 12, color: "#5B5747", marginBottom: 14 }}>
              {moves}회 시도 · {formatTime(seconds)} 만에 완료했어요.
            </div>
            <div style={styles.earnedBox}>
              <Sparkles size={16} color="#D9A441" />
              <span style={{ fontWeight: 700, color: "#8A5A16" }}>+{earned}P 획득!</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16, width: "100%" }}>
              <button style={{ ...styles.modalBtn, ...styles.modalBtnGhost }} onClick={() => setStatus("idle")}>
                다시하기
              </button>
              <button style={{ ...styles.modalBtn, ...styles.modalBtnSolid }} onClick={onGoShop}>
                상점 가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 탭 3: 상점                                                           */
/* ------------------------------------------------------------------ */
function ShopTab({ profile, buyItem, applyTheme, applyTitle, resetProgress }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [rollingBox, setRollingBox] = useState(null);

  const handleBuy = (item) => {
    const reward = buyItem(item);
    if (item.type === "randombox" && reward != null) {
      setRollingBox({ item, target: reward });
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={styles.shopBanner}>
        <Coins size={20} color="#D9A441" />
        <div>
          <div style={{ fontSize: 11, color: "#8B8577" }}>보유 포인트</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#F0DBA6" }}>{profile.points.toLocaleString()}P</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 11, color: "#8B8577", textAlign: "right" }}>
          힌트 토큰
          <div style={{ fontSize: 15, fontWeight: 700, color: "#F3EFE3" }}>{profile.hintTokens}개</div>
        </div>
      </div>

      {rollingBox && (
        <BoxRollModal item={rollingBox.item} target={rollingBox.target} onClose={() => setRollingBox(null)} />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {SHOP_ITEMS.map((item) => {
          const owned =
            item.type === "theme"
              ? profile.themes.includes(item.id)
              : item.type === "deck"
              ? profile.advancedUnlocked
              : item.type === "title"
              ? (profile.titles || []).includes(item.id)
              : false;
          const applied =
            (item.type === "theme" && profile.selectedTheme === item.id) ||
            (item.type === "title" && profile.equippedTitle === item.id);
          const affordable = profile.points >= item.price;
          const redeemedCount = (profile.redeemed || {})[item.id] || 0;

          return (
            <div key={item.id} className="paper-card" style={styles.shopItem}>
              <span className="punch-hole" />
              <div className={`swatch ${item.type === "theme" ? `cardback-${item.id}` : "swatch-plain"}`} style={styles.shopSwatch}>
                {item.type === "deck" && <BookOpen size={18} color="#7A7461" />}
                {item.type === "consumable" && <Eye size={18} color="#7A7461" />}
                {item.type === "title" && <Award size={18} color="#7A7461" />}
                {item.type === "randombox" && <Gift size={18} color="#7A7461" />}
                {item.type === "reward" && <Sparkles size={18} color="#7A7461" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: "#5B5747", marginTop: 2, lineHeight: 1.4 }}>{item.desc}</div>
                <div style={{ fontSize: 11, color: "#8A5A16", marginTop: 6, fontWeight: 700 }}>
                  {item.price.toLocaleString()}P
                  {item.type === "reward" && redeemedCount > 0 && (
                    <span style={{ color: "#6E9E7B", marginLeft: 6, fontWeight: 700 }}>· {redeemedCount}회 교환함</span>
                  )}
                </div>
              </div>
              <div>
                {item.type === "consumable" || item.type === "randombox" || item.type === "reward" ? (
                  <button
                    disabled={!affordable}
                    onClick={() => handleBuy(item)}
                    style={{ ...styles.buyBtn, ...(affordable ? {} : styles.buyBtnDisabled) }}
                  >
                    구매
                  </button>
                ) : owned ? (
                  item.type === "theme" || item.type === "title" ? (
                    <button
                      onClick={() => (item.type === "theme" ? applyTheme(item.id) : applyTitle(item.id))}
                      style={{ ...styles.buyBtn, ...(applied ? styles.buyBtnApplied : styles.buyBtnGhost) }}
                    >
                      {applied ? (
                        <>
                          <Check size={12} /> 적용됨
                        </>
                      ) : (
                        "적용하기"
                      )}
                    </button>
                  ) : (
                    <span style={styles.ownedTag}>
                      <Check size={12} /> 보유중
                    </span>
                  )
                ) : (
                  <button
                    disabled={!affordable}
                    onClick={() => handleBuy(item)}
                    style={{ ...styles.buyBtn, ...(affordable ? {} : styles.buyBtnDisabled) }}
                  >
                    구매
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 24, textAlign: "center" }}>
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)} style={styles.resetLink}>
            게임 데이터 초기화
          </button>
        ) : (
          <div style={{ fontSize: 11, color: "#8B8577" }}>
            정말 초기화할까요? 포인트와 보유 아이템이 모두 사라져요.{" "}
            <button
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
              }}
              style={{ ...styles.resetLink, color: "#B23A2E" }}
            >
              초기화
            </button>{" "}
            <button onClick={() => setConfirmReset(false)} style={styles.resetLink}>
              취소
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 미스터리 상자 슬롯머신 연출                                             */
/* ------------------------------------------------------------------ */
function BoxRollModal({ item, target, onClose }) {
  const [display, setDisplay] = useState(item.min);
  const [phase, setPhase] = useState("rolling"); // rolling | settled
  const timeoutRef = useRef(null);

  useEffect(() => {
    let step = 0;
    const totalSteps = 22;

    function tick() {
      step += 1;
      if (step >= totalSteps) {
        setDisplay(target);
        setPhase("settled");
        return;
      }
      const rnd = Math.floor(Math.random() * (item.max - item.min + 1)) + item.min;
      setDisplay(rnd);
      const progress = step / totalSteps;
      const delay = 35 + Math.pow(progress, 2) * 260; // 점점 느려지는 감속 곡선
      timeoutRef.current = setTimeout(tick, delay);
    }

    timeoutRef.current = setTimeout(tick, 35);
    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={styles.modalOverlay}>
      <div className="paper-card" style={styles.modalCard}>
        <span className="punch-hole" />
        <Gift size={26} color="#D9A441" style={{ marginBottom: 6 }} />
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "#5B5747" }}>{item.name}</div>
        <div
          className={`font-mono-chem ${phase === "rolling" ? "slot-rolling" : "slot-settle slot-glow"}`}
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: phase === "settled" ? "#8A5A16" : "#20242B",
            background: "#F6EACB",
            borderRadius: 12,
            padding: "12px 20px",
            minWidth: 170,
            textAlign: "center",
          }}
        >
          {display.toLocaleString()}P
        </div>
        <div style={{ fontSize: 11, color: "#8B8577", marginTop: 10, minHeight: 16 }}>
          {phase === "settled" ? "포인트를 획득했어요!" : "굴러가는 중…"}
        </div>
        {phase === "settled" && (
          <button
            style={{ ...styles.modalBtn, ...styles.modalBtnSolid, marginTop: 10, width: "100%" }}
            onClick={onClose}
          >
            확인
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 미스터리 야시장 - 블랙잭                                                */
/* ------------------------------------------------------------------ */
const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const CHIP_OPTIONS = [100, 500, 1000, 5000, 10000];

function buildShuffledDeck() {
  const deck = [];
  for (const s of SUITS) {
    for (const r of RANKS) deck.push({ rank: r, suit: s });
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function cardValue(rank) {
  if (rank === "A") return 11;
  if (rank === "J" || rank === "Q" || rank === "K") return 10;
  return Number(rank);
}

function handTotal(hand) {
  let total = hand.reduce((sum, c) => sum + cardValue(c.rank), 0);
  let aces = hand.filter((c) => c.rank === "A").length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

function isNaturalBlackjack(hand) {
  return hand.length === 2 && handTotal(hand) === 21;
}

function PlayingCard({ card, faceUp, delay = 0 }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!faceUp) {
      setRevealed(false);
      return;
    }
    const t = setTimeout(() => setRevealed(true), 90 + delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faceUp, delay, card]);

  const isRed = card && (card.suit === "♥" || card.suit === "♦");

  return (
    <div className="pcard-flip">
      <div className={`pcard-inner ${revealed ? "pcard-revealed" : ""}`}>
        <div className="pcard-face pcard-back-design">
          <span>?</span>
        </div>
        <div className="pcard-face pcard-front" style={{ color: isRed ? "#FF6B81" : "#F3EFE3" }}>
          {card && (
            <>
              <span>{card.rank}</span>
              <span style={{ fontSize: 15 }}>{card.suit}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function NightMarketTab({ profile, addPoints, onExit }) {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [bet, setBet] = useState(0);
  const [betInput, setBetInput] = useState(100);
  const [phase, setPhase] = useState("betting"); // betting | player | dealer | result
  const [revealDealer, setRevealDealer] = useState(false);
  const [message, setMessage] = useState("");
  const dealerTimerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(dealerTimerRef.current);
  }, []);

  function settle(finalPlayerHand, finalDealerHand, currentBet) {
    const pTotal = handTotal(finalPlayerHand);
    const dTotal = handTotal(finalDealerHand);
    const pBJ = isNaturalBlackjack(finalPlayerHand);
    const dBJ = isNaturalBlackjack(finalDealerHand);

    let payout = 0;
    let msg = "";

    if (pTotal > 21) {
      payout = 0;
      msg = `버스트! ${currentBet.toLocaleString()}P를 잃었어요.`;
    } else if (pBJ && dBJ) {
      payout = currentBet;
      msg = "둘 다 블랙잭! 무승부, 배팅 금액을 돌려받아요.";
    } else if (pBJ) {
      payout = Math.round(currentBet * 2.5);
      msg = `블랙잭! ${Math.round(currentBet * 1.5).toLocaleString()}P를 땄어요!`;
    } else if (dBJ) {
      payout = 0;
      msg = "딜러 블랙잭… 배팅 금액을 잃었어요.";
    } else if (dTotal > 21) {
      payout = currentBet * 2;
      msg = `딜러 버스트! ${currentBet.toLocaleString()}P를 땄어요!`;
    } else if (pTotal > dTotal) {
      payout = currentBet * 2;
      msg = `승리! ${currentBet.toLocaleString()}P를 땄어요!`;
    } else if (pTotal === dTotal) {
      payout = currentBet;
      msg = "무승부! 배팅 금액을 돌려받아요.";
    } else {
      payout = 0;
      msg = `패배… ${currentBet.toLocaleString()}P를 잃었어요.`;
    }

    if (payout > 0) addPoints(payout);
    setMessage(msg);
    setRevealDealer(true);
    setPhase("result");
  }

  function dealerAutoPlay(startDeck, startDealerHand, finalPlayerHand, currentBet) {
    setRevealDealer(true);
    let workingDeck = [...startDeck];
    let workingDealerHand = [...startDealerHand];

    function step() {
      const total = handTotal(workingDealerHand);
      if (total < 17) {
        const card = workingDeck.shift();
        workingDealerHand = [...workingDealerHand, card];
        setDealerHand(workingDealerHand);
        setDeck(workingDeck);
        dealerTimerRef.current = setTimeout(step, 550);
      } else {
        settle(finalPlayerHand, workingDealerHand, currentBet);
      }
    }
    dealerTimerRef.current = setTimeout(step, 550);
  }

  function startRound(amount) {
    const wager = Math.floor(amount);
    if (wager <= 0 || wager > profile.points || phase === "dealer") return;

    const freshDeck = buildShuffledDeck();
    const pHand = [freshDeck.shift(), freshDeck.shift()];
    const dHand = [freshDeck.shift(), freshDeck.shift()];

    addPoints(-wager);
    setBet(wager);
    setDeck(freshDeck);
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setRevealDealer(false);
    setMessage("");

    if (isNaturalBlackjack(pHand) || isNaturalBlackjack(dHand)) {
      setPhase("dealer");
      settle(pHand, dHand, wager);
    } else {
      setPhase("player");
    }
  }

  function hit() {
    if (phase !== "player") return;
    const workingDeck = [...deck];
    const card = workingDeck.shift();
    const newHand = [...playerHand, card];
    setDeck(workingDeck);
    setPlayerHand(newHand);
    if (handTotal(newHand) > 21) {
      setPhase("dealer");
      setRevealDealer(true);
      settle(newHand, dealerHand, bet);
    }
  }

  function stand() {
    if (phase !== "player") return;
    setPhase("dealer");
    dealerAutoPlay(deck, dealerHand, playerHand, bet);
  }

  function playAgain() {
    setPlayerHand([]);
    setDealerHand([]);
    setPhase("betting");
    setMessage("");
    setRevealDealer(false);
  }

  const pTotal = handTotal(playerHand);
  const dTotal = handTotal(dealerHand);

  return (
    <div style={styles.marketWrap}>
      <div style={styles.marketHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Moon size={18} color="#F0A9C2" />
          <span className="font-display" style={{ fontSize: 18, color: "#F6E4EF" }}>
            미스터리 야시장
          </span>
        </div>
        <button style={styles.marketExitBtn} onClick={onExit}>
          <X size={13} /> 나가기
        </button>
      </div>

      <div style={styles.marketPointRow}>
        <Coins size={15} color="#F0DBA6" />
        <span style={{ fontWeight: 700 }}>{profile.points.toLocaleString()}P</span>
      </div>

      <div className="paper-card" style={styles.tableCard}>
        <span className="punch-hole" />
        <div style={styles.dealerRow}>
          <div style={styles.seatLabel}>
            <Dice5 size={13} color="#8B8577" /> 딜러 {phase !== "betting" && revealDealer ? `· ${dTotal}` : ""}
          </div>
          <div style={styles.handRow}>
            {dealerHand.map((c, i) => (
              <PlayingCard key={i} card={c} faceUp={!(i === 1 && !revealDealer)} delay={Math.min(i, 3) * 140} />
            ))}
            {dealerHand.length === 0 && <div style={styles.emptySeatHint}>대기 중</div>}
          </div>
        </div>

        {message && (
          <div style={{ ...styles.resultBanner, ...(message.includes("잃었") || message.includes("패배") ? styles.resultLose : styles.resultWin) }}>
            {message}
          </div>
        )}

        <div style={styles.playerRow}>
          <div style={styles.seatLabel}>
            나 {phase !== "betting" ? `· ${pTotal}` : ""}
          </div>
          <div style={styles.handRow}>
            {playerHand.map((c, i) => (
              <PlayingCard key={i} card={c} faceUp delay={Math.min(i, 3) * 140} />
            ))}
            {playerHand.length === 0 && <div style={styles.emptySeatHint}>배팅하고 시작해보세요</div>}
          </div>
        </div>
      </div>

      {phase === "betting" && (
        <div style={styles.betPanel}>
          <div style={{ fontSize: 11.5, color: "#C9B8C7", marginBottom: 8 }}>배팅 금액</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            {CHIP_OPTIONS.map((c) => (
              <button
                key={c}
                disabled={c > profile.points}
                onClick={() => setBetInput(c)}
                style={{
                  ...styles.chipBtn,
                  ...(betInput === c ? styles.chipBtnActive : {}),
                  ...(c > profile.points ? styles.chipBtnDisabled : {}),
                }}
              >
                {c.toLocaleString()}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="number"
              value={betInput}
              min={1}
              max={Math.max(profile.points, 1)}
              onChange={(e) => setBetInput(Number(e.target.value))}
              style={styles.betInput}
            />
            <button
              style={{ ...styles.dealBtn, ...(betInput <= 0 || betInput > profile.points ? styles.dealBtnDisabled : {}) }}
              disabled={betInput <= 0 || betInput > profile.points || profile.points <= 0}
              onClick={() => startRound(betInput)}
            >
              딜 하기
            </button>
          </div>
          {profile.points <= 0 && <div style={styles.emptySeatHint}>포인트가 부족해요.</div>}
        </div>
      )}

      {phase === "player" && (
        <div style={styles.actionRow}>
          <button style={{ ...styles.dealBtn, flex: 1 }} onClick={hit}>
            히트
          </button>
          <button style={{ ...styles.dealBtn, ...styles.standBtn, flex: 1 }} onClick={stand}>
            스탠드
          </button>
        </div>
      )}

      {phase === "result" && (
        <div style={styles.actionRow}>
          <button style={{ ...styles.dealBtn, flex: 1 }} onClick={playAgain}>
            다시 하기
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 스타일                                                                */
/* ------------------------------------------------------------------ */
const styles = {
  appRoot: {
    minHeight: "100%",
    background: "#14181D",
    fontFamily: "'Noto Sans KR', sans-serif",
    color: "#F3EFE3",
    padding: "18px 16px 40px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: "#2A3038",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #3A4048",
  },
  pointPill: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#20262E",
    border: "1px solid #3A4048",
    borderRadius: 999,
    padding: "7px 14px",
  },
  titleBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 3,
    background: "rgba(217,164,65,0.15)",
    border: "1px solid rgba(217,164,65,0.4)",
    borderRadius: 999,
    padding: "1px 8px 1px 6px",
    color: "#D9A441",
    fontWeight: 700,
    fontSize: 10.5,
  },
  tabBar: {
    display: "flex",
    gap: 6,
    marginBottom: 20,
    background: "#1B2027",
    padding: 5,
    borderRadius: 12,
    border: "1px solid #2A3038",
  },
  tabBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "9px 8px",
    borderRadius: 9,
    background: "transparent",
    color: "#8B8577",
    fontSize: 12.5,
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
  },
  tabBtnActive: {
    background: "#F3EFE3",
    color: "#20242B",
  },
  main: { maxWidth: 760, margin: "0 auto" },
  filterRow: { display: "flex", gap: 8, marginBottom: 14, alignItems: "center", flexWrap: "wrap" },
  filterBtn: {
    padding: "6px 14px",
    borderRadius: 999,
    border: "1px solid #3A4048",
    background: "transparent",
    color: "#8B8577",
    fontSize: 11.5,
    cursor: "pointer",
  },
  filterBtnActive: { background: "#D9A441", color: "#20242B", border: "1px solid #D9A441", fontWeight: 700 },
  unlockHint: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 10.5,
    color: "#8B8577",
    background: "transparent",
    border: "1px dashed #3A4048",
    borderRadius: 999,
    padding: "5px 10px",
    cursor: "pointer",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(128px, 1fr))",
    gap: 12,
  },
  flashFront: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    fontSize: 19,
  },
  flashBack: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    padding: 10,
  },
  gameStatRow: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  statChip: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    background: "#20262E",
    border: "1px solid #3A4048",
    borderRadius: 999,
    padding: "6px 12px",
    fontSize: 11.5,
    color: "#DDD7C7",
  },
  memoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 10,
  },
  memoryFace: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    fontSize: 12.5,
    padding: 4,
    textAlign: "center",
  },
  difficultyBtn: {
    width: 74,
    padding: "10px 6px",
    borderRadius: 10,
    border: "1.5px solid #D9CBAE",
    background: "#FBF8EF",
    color: "#20242B",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(10,12,15,0.72)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 300,
    padding: "26px 22px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  earnedBox: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#F6EACB",
    borderRadius: 999,
    padding: "6px 16px",
  },
  modalBtn: { flex: 1, padding: "10px 0", borderRadius: 9, fontSize: 12.5, fontWeight: 700, cursor: "pointer", border: "none" },
  modalBtnGhost: { background: "transparent", border: "1.5px solid #C9C2AC", color: "#5B5747" },
  modalBtnSolid: { background: "#20242B", color: "#F3EFE3" },
  shopBanner: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#20262E",
    border: "1px solid #3A4048",
    borderRadius: 14,
    padding: "14px 16px",
    marginBottom: 16,
  },
  boxToast: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(217,164,65,0.12)",
    border: "1px solid rgba(217,164,65,0.45)",
    borderRadius: 10,
    padding: "10px 14px",
    marginBottom: 12,
    fontSize: 12.5,
    color: "#F3EFE3",
  },
  shopItem: { display: "flex", alignItems: "center", gap: 12, padding: 14 },
  shopSwatch: {
    width: 44,
    height: 44,
    borderRadius: 10,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(0,0,0,0.1)",
  },
  buyBtn: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "8px 14px",
    borderRadius: 999,
    border: "none",
    background: "#20242B",
    color: "#F3EFE3",
    fontSize: 11.5,
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  buyBtnDisabled: { background: "#D9D2BE", color: "#A39C87", cursor: "not-allowed" },
  buyBtnGhost: { background: "transparent", border: "1.5px solid #20242B", color: "#20242B" },
  buyBtnApplied: { background: "#6E9E7B", color: "#fff" },
  ownedTag: { display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#6E9E7B", fontWeight: 700 },
  resetLink: { background: "none", border: "none", color: "#8B8577", fontSize: 11, textDecoration: "underline", cursor: "pointer" },

  marketWrap: {
    background: "linear-gradient(180deg, #1E0F26 0%, #170A1F 100%)",
    borderRadius: 16,
    padding: "16px 14px 20px",
    border: "1px solid #3A2246",
  },
  marketHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  marketExitBtn: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#E9D9E4",
    fontSize: 11,
    fontWeight: 600,
    borderRadius: 999,
    padding: "5px 10px",
    cursor: "pointer",
  },
  marketPointRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: "#F6E4EF",
    marginBottom: 12,
  },
  tableCard: {
    background: "#241332",
    color: "#F6E4EF",
    borderRadius: 14,
    padding: "18px 14px",
    border: "1px solid #3A2246",
    boxShadow: "inset 0 0 30px rgba(240,169,194,0.06)",
    marginBottom: 14,
  },
  dealerRow: { marginBottom: 18 },
  playerRow: {},
  seatLabel: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: 11,
    color: "#C9B8C7",
    marginBottom: 8,
    fontWeight: 700,
  },
  handRow: { display: "flex", gap: 8, flexWrap: "wrap", minHeight: 56 },
  emptySeatHint: { fontSize: 11, color: "#7A6A78", padding: "16px 0" },
  resultBanner: {
    textAlign: "center",
    fontSize: 12.5,
    fontWeight: 700,
    borderRadius: 10,
    padding: "8px 10px",
    margin: "4px 0 14px",
  },
  resultWin: { background: "rgba(111,158,123,0.18)", color: "#9ED4A9", border: "1px solid rgba(111,158,123,0.4)" },
  resultLose: { background: "rgba(226,62,87,0.16)", color: "#FF8FA0", border: "1px solid rgba(226,62,87,0.4)" },
  betPanel: {
    background: "#241332",
    border: "1px solid #3A2246",
    borderRadius: 14,
    padding: 14,
  },
  chipBtn: {
    padding: "7px 12px",
    borderRadius: 999,
    border: "1px solid #4A2E5C",
    background: "#2E1A3D",
    color: "#E9D9E4",
    fontSize: 11.5,
    fontWeight: 700,
    cursor: "pointer",
  },
  chipBtnActive: { background: "#F0A9C2", color: "#241332", border: "1px solid #F0A9C2" },
  chipBtnDisabled: { opacity: 0.35, cursor: "not-allowed" },
  betInput: {
    flex: 1,
    background: "#2E1A3D",
    border: "1px solid #4A2E5C",
    borderRadius: 9,
    color: "#F6E4EF",
    fontSize: 13,
    padding: "9px 12px",
  },
  dealBtn: {
    padding: "10px 18px",
    borderRadius: 9,
    border: "none",
    background: "#F0A9C2",
    color: "#241332",
    fontWeight: 800,
    fontSize: 12.5,
    cursor: "pointer",
  },
  dealBtnDisabled: { opacity: 0.35, cursor: "not-allowed" },
  standBtn: { background: "#C9A6E0" },
  actionRow: { display: "flex", gap: 8, marginTop: 4 },
};

const globalCss = `
@import url('https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Noto+Sans+KR:wght@400;500;700&family=JetBrains+Mono:wght@500;700&display=swap');

.font-display { font-family: 'Gowun Batang', serif; }
.font-mono-chem { font-family: 'JetBrains Mono', monospace; font-weight: 700; }

.paper-card {
  background: #F3EFE3;
  color: #20242B;
  border-radius: 14px;
  box-shadow: 0 2px 0 rgba(0,0,0,0.12), 0 8px 18px rgba(0,0,0,0.28);
  position: relative;
}
.punch-hole {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #14181D;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.6);
}

.flip-card { perspective: 1000px; height: 150px; }
.memory-cell { height: auto; aspect-ratio: 1 / 1; cursor: pointer; }
.flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.5s cubic-bezier(.4,.2,.2,1);
  transform-style: preserve-3d;
}
.flip-inner.flipped { transform: rotateY(180deg); }
.flip-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 14px;
}
.flip-back { transform: rotateY(180deg); }

.cardback {
  display: flex;
  align-items: center;
  justify-content: center;
}
.cardback-default { background: repeating-linear-gradient(45deg, #1B2027, #1B2027 9px, #222933 9px, #222933 18px); border: 1px solid #2E353E; }
.cardback-pastel { background: linear-gradient(135deg, #F6D3E0, #D6E4F0); border: 1px solid #E7C9D8; }
.cardback-neon { background: #0B0E11; border: 1.5px solid #3FE08A; box-shadow: inset 0 0 10px rgba(63,224,138,0.35); }
.cardback-gold { background: linear-gradient(135deg, #F4D06F, #C98A2C, #F4D06F); border: 1px solid #B8862A; }

.swatch-plain { background: #EDE7D6; }

.slot-rolling { animation: slotShake 0.09s linear infinite; }
@keyframes slotShake {
  0% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-3px) scale(1.02); }
  100% { transform: translateY(0) scale(1); }
}
.slot-settle { animation: slotPop 0.5s cubic-bezier(.34,1.56,.64,1); }
@keyframes slotPop {
  0% { transform: scale(0.7); }
  55% { transform: scale(1.18); }
  100% { transform: scale(1); }
}
.slot-glow { animation: slotGlow 1.5s ease-in-out infinite; }
@keyframes slotGlow {
  0%, 100% { box-shadow: 0 0 0 rgba(217,164,65,0); }
  50% { box-shadow: 0 0 22px rgba(217,164,65,0.55); }
}

.pcard-flip {
  width: 42px;
  height: 56px;
  perspective: 500px;
  animation: pcardDeal 0.28s cubic-bezier(.2,.7,.3,1);
}
@keyframes pcardDeal {
  0% { transform: translateY(-14px) scale(0.85); opacity: 0; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}
.pcard-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.45s cubic-bezier(.4,.2,.2,1);
  transform-style: preserve-3d;
}
.pcard-inner.pcard-revealed { transform: rotateY(180deg); }
.pcard-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pcard-back-design {
  background: repeating-linear-gradient(45deg, #3A2246, #3A2246 6px, #4A2E5C 6px, #4A2E5C 12px);
  border: 1px solid #4A2E5C;
  color: #F0A9C2;
  font-weight: 800;
}
.pcard-front {
  transform: rotateY(180deg);
  background: #2E1A3D;
  border: 1px solid #4A2E5C;
  flex-direction: column;
  font-weight: 800;
  font-size: 14px;
  font-family: 'JetBrains Mono', monospace;
}
`;
