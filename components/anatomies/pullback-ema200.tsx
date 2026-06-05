import { getStrategyBySlug, type ChartConfig } from "@/lib/strategies";
import {
  AnatomyHero,
  AnatomyTOC,
  Chapter,
  ChapterHeader,
  SubTitle,
  MiniTitle,
  P,
  Muted,
  List,
  Box,
  Criteria,
  Phases,
  TradeTable,
  ChecklistDetailed,
  JournalGrid,
  PositionTracker,
  PatternGrid,
  Figure,
  ScenarioGrid,
} from "./blocks";

const TOC = [
  { num: "01", id: "definition", label: "Définition" },
  { num: "02", id: "phases", label: "Les 4 phases" },
  { num: "03", id: "qualifier", label: "Tendance valide" },
  { num: "04", id: "candle", label: "Bougie de rejet" },
  { num: "05", id: "scenarios", label: "3 scénarios" },
  { num: "06", id: "management", label: "Gestion" },
  { num: "07", id: "filters", label: "Filtres" },
  { num: "08", id: "traps", label: "Pièges" },
  { num: "09", id: "checklist", label: "Checklist" },
  { num: "10", id: "backtest", label: "Backtest" },
];

/* Séquence impulsion → correction → contact EMA200 → rejet (chapitre 02). */
const FIG_PB_PHASES: ChartConfig = {
  candles: [
    { o: 30, h: 36, l: 28, c: 35 },
    { o: 35, h: 44, l: 34, c: 43 },
    { o: 43, h: 52, l: 42, c: 50 },
    { o: 50, h: 58, l: 49, c: 56 },
    { o: 56, h: 60, l: 50, c: 52 },
    { o: 52, h: 55, l: 46, c: 48 },
    { o: 48, h: 51, l: 44, c: 47, highlight: true },
    { o: 47, h: 61, l: 45, c: 59, highlight: true },
    { o: 59, h: 71, l: 57, c: 69 },
    { o: 69, h: 79, l: 67, c: 77 },
  ],
  lines: [{ x1: 0, x2: 9, y1: 31, y2: 56, color: "premium", style: "dashed" }],
  annotations: [{ x: 4, y: 40, label: "— EMA200 —" }],
};

/* Gros plan sur une bougie de rejet (pin bar) au contact de l'EMA200 (chapitre 04). */
const FIG_PB_REJET: ChartConfig = {
  candles: [
    { o: 62, h: 65, l: 56, c: 58 },
    { o: 58, h: 60, l: 51, c: 53 },
    { o: 53, h: 56, l: 44, c: 54, highlight: true },
    { o: 54, h: 67, l: 52, c: 65, highlight: true },
    { o: 65, h: 74, l: 63, c: 72 },
  ],
  lines: [{ x1: 0, x2: 4, y1: 51, y2: 56, color: "premium", style: "dashed" }],
  markers: [{ x: 2, y: 44, type: "sl", label: "MÈCHE DE REJET", dir: "bottom" }],
  annotations: [{ x: 0, y: 63, label: "EMA200" }],
};

/* Trois trajectoires possibles après la bougie de rejet (chapitre 05). */
const FIG_PB_SCEN_FRANCHE: ChartConfig = {
  candles: [
    { o: 62, h: 64, l: 54, c: 56 },
    { o: 56, h: 58, l: 49, c: 52, highlight: true },
    { o: 52, h: 64, l: 51, c: 62, highlight: true },
    { o: 62, h: 72, l: 60, c: 70 },
    { o: 70, h: 80, l: 68, c: 78 },
  ],
  lines: [{ x1: 0, x2: 4, y1: 50, y2: 57, color: "premium", style: "dashed" }],
};
const FIG_PB_SCEN_DOUBLE: ChartConfig = {
  candles: [
    { o: 60, h: 62, l: 52, c: 54 },
    { o: 54, h: 63, l: 50, c: 61, highlight: true },
    { o: 61, h: 64, l: 53, c: 55 },
    { o: 55, h: 67, l: 52, c: 65, highlight: true },
    { o: 65, h: 77, l: 63, c: 75 },
  ],
  lines: [{ x1: 0, x2: 4, y1: 50, y2: 57, color: "premium", style: "dashed" }],
};
const FIG_PB_SCEN_ECHEC: ChartConfig = {
  candles: [
    { o: 62, h: 64, l: 54, c: 56 },
    { o: 56, h: 60, l: 50, c: 52, highlight: true },
    { o: 52, h: 54, l: 43, c: 45, highlight: true },
    { o: 45, h: 47, l: 37, c: 39 },
    { o: 39, h: 41, l: 32, c: 34 },
  ],
  lines: [{ x1: 0, x2: 4, y1: 50, y2: 55, color: "premium", style: "dashed" }],
};

export function PullbackEMA200Anatomy() {
  const s = getStrategyBySlug("pullback-ema200")!;

  return (
    <>
      <AnatomyHero
        module={2}
        title="Pullback EMA200 en Tendance :"
        em="monter dans un train déjà lancé."
        lead="Décomposition en 10 chapitres d'une des stratégies trend-following les plus robustes du trading manuel. Comment qualifier une vraie tendance, lire la pente de l'EMA200, identifier la bougie de rejet, gérer le trade jusqu'à sa sortie — et surtout, comment éviter le piège récurrent qui transforme cette stratégie en machine à perdre : confondre un pullback sain avec un retournement de tendance."
        meta={[
          { value: "1H → Daily", label: "Timeframes cibles" },
          { value: "Actions · Indices · Crypto", label: "Marchés" },
          { value: "Tendance", label: "Régime" },
          { value: "3 / 5", label: "Complexité" },
          { value: "Faible", label: "Fréquence" },
        ]}
      />

      <div className="max-w-wrap mx-auto px-5 sm:px-8">
        <AnatomyTOC items={TOC} />
      </div>

      <article className="max-w-wrap mx-auto px-5 sm:px-8 py-8">

        {/* CHAPITRE 01 */}
        <Chapter>
          <ChapterHeader
            num="01"
            id="definition"
            title="Qu'est-ce qu'un pullback exploitable ?"
            lead="Un pullback est un retour de prix temporaire à contre-tendance, en direction d'un repère structurel. Tous les pullbacks ne se valent pas — la majorité ne sont que du bruit. Cette stratégie ne s'intéresse qu'à une catégorie précise : les pullbacks vers une moyenne mobile structurelle, l'EMA200, dans un marché tendanciel mature."
          />
          <SubTitle>La définition opérationnelle</SubTitle>
          <P>
            Un pullback EMA200 exploitable est défini par{" "}
            <strong className="text-white">quatre éléments mesurables</strong> : une structure de
            tendance lisible (HH/HL pour le long, LH/LL pour le short), une EMA200 clairement pentée
            dans la même direction, un retour du prix au contact ou à proximité immédiate de l'EMA200,
            et une bougie de rejet qui confirme la reprise du momentum dominant.
          </P>

          <Figure
            config={s.chart}
            id="pb-fig-1"
            caption={
              <>
                Une tendance haussière mature : le prix s'éloigne de l'
                <span className="text-[#c9a96e]">EMA200</span>, y revient en correction, puis une
                bougie de rejet relance le mouvement — <span className="text-white">entrée</span>,{" "}
                <span className="text-risk">stop</span> sous le plus bas, <span className="text-edge">objectif</span>{" "}
                sur le swing suivant.
              </>
            }
          />

          <List
            items={[
              <><strong className="text-white">Structure tendancielle</strong> : succession ininterrompue de sommets et creux plus hauts (haussier) ou plus bas (baissier) sur le HTF.</>,
              <><strong className="text-white">EMA200 pentée</strong> : la moyenne mobile exponentielle 200 périodes doit afficher une pente nette, mesurable, depuis au moins 30-50 bougies.</>,
              <><strong className="text-white">Contact ou proximité</strong> : le prix vient toucher l'EMA200 ou s'en approcher (typiquement à moins de 0.5× ATR) avant le rebond.</>,
              <><strong className="text-white">Bougie de rejet</strong> : pin bar, engulfing ou doji long-wick qui confirme que les acheteurs (vendeurs en short) défendent activement le niveau.</>,
            ]}
          />

          <Box variant="note" label="Pourquoi l'EMA200 en particulier">
            L'EMA200 est l'une des moyennes mobiles les plus utilisées au monde : traders particuliers,
            systèmes algorithmiques, fonds quantitatifs s'y réfèrent comme niveau psychologique
            structurel. Cette concentration d'attention{" "}
            <strong className="text-white">fabrique elle-même un effet support/résistance</strong> : les
            ordres se concentrent autour de ce niveau.{" "}
            <strong className="text-white">
              Phénomène observable, mais edge statistique à valider sur tes marchés.
            </strong>
          </Box>
        </Chapter>

        {/* CHAPITRE 02 */}
        <Chapter>
          <ChapterHeader
            num="02"
            id="phases"
            title="Les quatre phases d'un pullback en tendance."
            lead="Tout pullback exploitable suit une séquence ordonnée de quatre phases. Lire cette séquence en temps réel, c'est attendre la bonne phase pour entrer plutôt que d'anticiper trop tôt."
          />

          <Phases
            phases={[
              { num: "01", name: "Impulsion", desc: "Le prix s'éloigne franchement de l'EMA200 dans le sens de la tendance. Nouveau swing high/low. L'EMA s'incline davantage." },
              { num: "02", name: "Correction", desc: "Le momentum s'essouffle. Le prix entame une jambe de retour vers l'EMA200, souvent en plusieurs bougies." },
              { num: "03", name: "Contact", desc: "Le prix entre en contact avec l'EMA200 ou la pénètre légèrement. Phase d'indécision, dojis ou bougies à corps réduit." },
              { num: "04", name: "Rejet", desc: "Bougie de retournement franche : pin bar, engulfing, doji à longue mèche. Le prix repart dans le sens de la tendance — déclencheur." },
            ]}
          />

          <Figure
            config={FIG_PB_PHASES}
            id="pb-fig-2"
            caption={
              <>
                Les quatre phases enchaînées : l'impulsion éloigne le prix de l'
                <span className="text-[#c9a96e]">EMA200</span>, la correction le ramène, le contact
                teste la moyenne, puis la bougie de rejet (mise en évidence) confirme la reprise.
              </>
            }
          />

          <Box variant="warn" label="Important">
            Les phases 2 et 3 peuvent prendre plusieurs bougies, parfois plusieurs jours sur Daily.{" "}
            <strong className="text-white">Ne jamais anticiper la phase 4</strong> en entrant pendant la
            correction : tant que la bougie de rejet n'est pas clôturée, on n'a aucune preuve que les
            acheteurs défendent l'EMA200.
          </Box>
        </Chapter>

        {/* CHAPITRE 03 */}
        <Chapter>
          <ChapterHeader
            num="03"
            id="qualifier"
            title="Qualifier une tendance valide : bonnes vs mauvaises configurations."
            lead="Toutes les tendances ne se valent pas. La même stratégie produit des résultats radicalement opposés selon la qualité du contexte. Voici les critères qui séparent une tendance tradable d'une tendance à éviter."
          />

          <Criteria
            goodTitle="Tendance exploitable"
            badTitle="À éviter"
            good={[
              "EMA200 pentée nettement depuis 30-50 bougies minimum",
              "Structure HH/HL ou LH/LL ininterrompue sur le HTF",
              "Prix resté du bon côté de l'EMA depuis plusieurs semaines",
              "Pullbacks précédents respectés (l'EMA200 a déjà tenu 1-2 fois)",
              "HTF supérieur aligné (ex : D1 haussier si on trade H4)",
              "Volatilité globale stable, pas en explosion ni effondrement",
            ]}
            bad={[
              "EMA200 plate ou en transition (changement de pente récent)",
              "Structure brouillée : alternance de HH/LL sans hiérarchie",
              "Croisement récent du prix avec l'EMA200 (moins de 20 bougies)",
              "Divergence majeure RSI/MACD signalant l'épuisement",
              "HTF supérieur en contradiction avec le trade",
              "Contexte macro extrême (news majeure imminente, crise)",
            ]}
          />

          <Box variant="note" label="Mesurer la pente de l'EMA200">
            Méthode simple : comparer la valeur actuelle de l'EMA200 à sa valeur 20 bougies plus tôt. Si
            la variation représente <strong className="text-white">plus de 1× ATR</strong>, la pente est
            nette. En-dessous, l'EMA est considérée comme plate et la stratégie ne s'applique pas. Cette
            mesure est facile à automatiser et{" "}
            <strong className="text-white">filtre à elle seule une grande partie des faux setups.</strong>
          </Box>
        </Chapter>

        {/* CHAPITRE 04 */}
        <Chapter>
          <ChapterHeader
            num="04"
            id="candle"
            title="Anatomie de la bougie de rejet."
            lead="La bougie qui marque le rejet de l'EMA200 est le déclencheur du trade. Trois familles de patterns sont valides : la pin bar, l'engulfing et le doji long-wick. Chacune raconte la même histoire : les acteurs dominants ont repris le contrôle au niveau de l'EMA."
          />

          <PatternGrid
            patterns={[
              {
                name: "Pin bar (marteau / étoile)",
                desc: (
                  <>
                    Mèche du côté de l'EMA{" "}
                    <strong className="text-white">au moins 2× plus longue</strong> que le corps, petit
                    corps dans le sens de la tendance, mèche opposée courte. Pattern de rejet le plus
                    net visuellement.
                  </>
                ),
              },
              {
                name: "Engulfing (englobante)",
                desc: (
                  <>
                    Bougie dans le sens de la tendance dont le corps{" "}
                    <strong className="text-white">englobe entièrement</strong> celui de la précédente.
                    Plus l'englobante est grande, plus le signal est fort.
                  </>
                ),
              },
              {
                name: "Doji long-wick",
                desc: (
                  <>
                    Corps minuscule, longue mèche du côté de l'EMA. Indécision résolue par un retour
                    rapide.{" "}
                    <strong className="text-white">Moins fiable seul</strong> : à confirmer par la
                    bougie suivante.
                  </>
                ),
              },
            ]}
          />

          <Figure
            config={FIG_PB_REJET}
            id="pb-fig-4"
            caption={
              <>
                Une pin bar de rejet : la <span className="text-risk">mèche</span> transperce l'
                <span className="text-[#c9a96e]">EMA200</span> puis le prix referme nettement au-dessus.
                La mèche fait plus de 50% de la hauteur et la clôture repart dans le sens de la tendance.
              </>
            }
          />

          <SubTitle>Les 4 critères communs à valider</SubTitle>
          <List
            ordered
            items={[
              <>
                <strong className="text-white">Position à l'EMA</strong> — la mèche doit avoir touché ou
                dépassé légèrement l'EMA200. Une bougie qui rejette à 1.5 ATR de l'EMA n'est pas un
                pullback EMA200.
              </>,
              <>
                <strong className="text-white">Mèche significative</strong> — la mèche du côté de l'EMA
                doit représenter au minimum{" "}
                <strong className="text-white">50% de la hauteur totale</strong> de la bougie.
              </>,
              <>
                <strong className="text-white">Clôture dans le sens de la tendance</strong> — la
                clôture doit se situer dans la moitié haute (long) ou basse (short) du range. Clôture
                neutre = doji ambigu.
              </>,
              <>
                <strong className="text-white">Contexte de phase 3</strong> — la bougie de rejet doit
                suivre une correction visible (au moins 3-5 bougies dans le sens contre-tendance). Une
                "bougie de rejet" sans pullback préalable n'a aucune signification.
              </>,
            ]}
          />

          <Box variant="good" label="Configuration idéale">
            Pin bar dont la mèche touche précisément l'EMA200, corps de 30-40% de la hauteur totale,
            mèche opposée minimale, apparition juste après 3-5 bougies de correction nette.{" "}
            <strong className="text-white">Cette configuration apparaît rarement</strong>, mais c'est
            elle qui produit les meilleurs trades.
          </Box>
        </Chapter>

        {/* CHAPITRE 05 */}
        <Chapter>
          <ChapterHeader
            num="05"
            id="scenarios"
            title="Trois scénarios post-rejet."
            lead="Une fois la bougie de rejet validée, le marché suit l'un de trois scénarios. Savoir les distinguer permet d'ajuster sa gestion en temps réel plutôt que de subir un drawdown évitable."
          />

          <ScenarioGrid
            scenarios={[
              {
                tag: "Scénario A",
                tone: "good",
                config: FIG_PB_SCEN_FRANCHE,
                id: "pb-scen-a",
                title: "Reprise franche",
                desc: "Le rejet enchaîne 2-3 bougies dans le sens de la tendance, sans retour vers l'EMA. Le swing précédent est atteint vite.",
              },
              {
                tag: "Scénario B",
                tone: "warn",
                config: FIG_PB_SCEN_DOUBLE,
                id: "pb-scen-b",
                title: "Double test de l'EMA",
                desc: "Le prix revient toucher l'EMA200 une seconde fois. Ce second rejet nettoie les indécis : la reprise est souvent plus puissante.",
              },
              {
                tag: "Scénario C",
                tone: "danger",
                config: FIG_PB_SCEN_ECHEC,
                id: "pb-scen-c",
                title: "Échec (cassure)",
                desc: "Le prix clôture franchement de l'autre côté de l'EMA200. Invalidation structurelle : la tendance se retourne peut-être. Sortie.",
              },
            ]}
          />

          <SubTitle>Scénario A — Reprise franche (continuation directe)</SubTitle>
          <Muted>
            La bougie de rejet est suivie de 2-3 bougies dans le sens de la tendance, sans retour vers
            l'EMA200. Le précédent swing high (ou low) est rapidement atteint. Scénario idéal : TP1
            touché vite, position partiellement sortie, le reste laisse courir.
          </Muted>

          <SubTitle>Scénario B — Double test de l'EMA (V-shape)</SubTitle>
          <Muted>
            Après le premier rejet, le prix consolide, puis revient toucher l'EMA200 une seconde fois.
            Si ce second test est rejeté, la reprise est généralement plus puissante : les indécis ont
            été nettoyés.{" "}
            <strong className="text-white">Souvent le meilleur RR de la séquence.</strong>
          </Muted>

          <SubTitle>Scénario C — Échec (clôture de l'autre côté)</SubTitle>
          <Muted>
            La bougie suivant le rejet, ou les 2-3 suivantes, clôturent{" "}
            <strong className="text-white">franchement de l'autre côté de l'EMA200</strong>. Signal
            d'invalidation structurel : la tendance vient peut-être de se retourner. Sortie immédiate.
          </Muted>

          <Box variant="danger" label="Règle d'invalidation">
            Si le prix clôture{" "}
            <strong className="text-white">
              de l'autre côté de l'EMA200 dans les 2-3 bougies
            </strong>{" "}
            suivant l'entrée, le trade est invalidé. Sortie immédiate, indépendamment du SL.{" "}
            <strong className="text-white">
              Une cassure structurelle de l'EMA200 est une information qu'il faut respecter.
            </strong>
          </Box>
        </Chapter>

        {/* CHAPITRE 06 */}
        <Chapter>
          <ChapterHeader
            num="06"
            id="management"
            title="Gérer le trade jusqu'à sa sortie."
            lead="L'entrée n'est qu'un quart du trade. La gestion du SL, des objectifs partiels et du trailing représente l'autre 75% du résultat final. Protocole exécutable, conçu pour capter les extensions tout en protégeant le capital."
          />

          <TradeTable
            rows={[
              { etape: "Entrée", action: "Long à la clôture de la bougie de rejet", critere: "Critères chapitre 04 validés (≥ 3 sur 4)", niveau: "Close bougie rejet", niveauColor: "info" },
              { etape: "Variante", action: "Cassure du high de la bougie de rejet", critere: "Confirmation supplémentaire, signal plus tardif", niveau: "High rejet + 1 tick", niveauColor: "info" },
              { etape: "Stop Loss", action: "Sous le low de la bougie de rejet, OU EMA200 − 0.5× ATR", critere: "Le plus large des deux", niveau: "Low rejet − 0.2× ATR", niveauColor: "bear" },
              { etape: "TP1", action: "Sortir 50% au précédent swing high", critere: "Niveau structurel naturel", niveau: "Swing high récent", niveauColor: "bull" },
              { etape: "Break-even", action: "Stop déplacé au prix d'entrée sur les 50% restants", critere: "Dès que TP1 est touché", niveau: "Entry", niveauColor: "gold" },
              { etape: "TP2", action: "Sortir le solde, OU activer trailing", critere: "Extension Fibonacci 1.618× de la dernière jambe", niveau: "Fib 1.618", niveauColor: "bull" },
              { etape: "Trailing", action: "Stop suiveur sous chaque nouveau HL formé", critere: "Si momentum continue après TP2", niveau: "Dernier higher low", niveauColor: "gold" },
            ]}
          />

          <Box variant="note" label="Pourquoi sortir 50% au swing high précédent">
            Le swing high précédent est le premier vrai obstacle structurel après l'entrée : la majorité
            des extensions s'y heurtent au moins temporairement. Sortir la moitié garantit un trade
            profitable même si le marché y rejette.{" "}
            <strong className="text-white">À valider via backtest sur ton marché spécifique.</strong>
          </Box>
        </Chapter>

        {/* CHAPITRE 07 */}
        <Chapter>
          <ChapterHeader
            num="07"
            id="filters"
            title="Filtres avancés pour augmenter l'edge."
            lead="La logique de base produit des signaux exploitables, mais avec un winrate intermédiaire. Ces quatre filtres, appliqués en surcouche, permettent de sélectionner les meilleures configurations — au prix d'une fréquence réduite."
          />

          <MiniTitle>Filtre 1 · Position dans la tendance (early / mid / late)</MiniTitle>
          <Muted>
            Classer chaque touche de l'EMA200 selon la maturité de la tendance : première touche après
            le démarrage = <strong className="text-white">early</strong>, touche intermédiaire ={" "}
            <strong className="text-white">mid</strong>, touche tardive après plusieurs cycles ={" "}
            <strong className="text-white">late</strong>. Les premières ont historiquement un meilleur
            edge.
          </Muted>

          <PositionTracker
            cells={[
              {
                tag: "EARLY",
                title: (
                  <>
                    1<sup>re</sup> – 2<sup>e</sup> touche
                  </>
                ),
                desc: "Tendance fraîche, EMA200 vient de pencher franchement. Pullback rare, edge maximal. Cible prioritaire.",
              },
              {
                tag: "MID",
                title: (
                  <>
                    3<sup>e</sup> – 4<sup>e</sup> touche
                  </>
                ),
                desc: "Tendance mature, structure encore propre. Edge correct, signaux moins impulsifs. Trader avec filtre HTF aligné.",
              },
              {
                tag: "LATE",
                title: (
                  <>
                    5<sup>e</sup> touche+
                  </>
                ),
                desc: "Tendance fatiguée, risque accru de retournement. Edge dégradé. Idéalement à ignorer.",
              },
            ]}
          />

          <MiniTitle>Filtre 2 · Reset RSI hors zone extrême</MiniTitle>
          <Muted>
            Vérifier que le RSI(14), au moment du contact EMA200, est revenu hors des zones extrêmes
            (typiquement entre 40 et 55 pour un pullback haussier). Un RSI qui reste collé en zone
            extrême signale que la correction n'est pas terminée.
          </Muted>

          <MiniTitle>Filtre 3 · Alignement HTF</MiniTitle>
          <Muted>
            Aligner le trade avec la tendance du timeframe immédiatement supérieur. Pullback haussier
            sur H4 seulement si le D1 est haussier ou neutre. Ce filtre seul élimine typiquement les
            pullbacks contre la macro-tendance.
          </Muted>

          <MiniTitle>Filtre 4 · Distance prix/EMA avant correction</MiniTitle>
          <Muted>
            Le pullback est plus fiable si le prix s'était significativement éloigné de l'EMA200 avant
            la correction (au moins 2× ATR). Une tendance qui colle à l'EMA200 sans la quitter est
            généralement faible.
          </Muted>

          <Box variant="warn" label="Attention au sur-filtrage">
            Empiler tous les filtres réduit drastiquement la fréquence des signaux.{" "}
            <strong className="text-white">Ne pas dépasser 2-3 filtres</strong> au-delà de la logique
            de base, sinon le sample size annuel devient si petit qu'aucune conclusion statistique
            n'est possible.
          </Box>
        </Chapter>

        {/* CHAPITRE 08 */}
        <Chapter>
          <ChapterHeader
            num="08"
            id="traps"
            title="Les cinq pièges classiques."
            lead="La majorité des pertes sur cette stratégie viennent de configurations identifiables qui ressemblent à un setup valide mais ne le sont pas. Apprendre à les refuser activement est aussi important que d'identifier les bons setups."
          />

          <MiniTitle>Piège 1 · Confondre fin de tendance avec pullback</MiniTitle>
          <Muted>
            Le piège n°1 — celui qui détruit la stratégie. Quand une tendance s'épuise, les premières
            cassures de l'EMA200 ressemblent à des pullbacks. La différence : la pente de l'EMA200
            commence à <strong className="text-white">s'aplatir</strong> et la structure HH/HL se brise
            (formation d'un LH). Si ces deux signaux sont présents, c'est{" "}
            <strong className="text-white">une fin de tendance</strong>, pas un pullback.
          </Muted>

          <MiniTitle>Piège 2 · Entrer avant la bougie de rejet</MiniTitle>
          <Muted>
            Anticiper le rebond pendant que le prix touche encore l'EMA200. Tant que la bougie n'est pas{" "}
            <strong className="text-white">clôturée</strong>, on ne sait pas si c'est un rejet ou une
            cassure.
          </Muted>

          <MiniTitle>Piège 3 · Whipsaw autour de l'EMA</MiniTitle>
          <Muted>
            Sur les TF basses (1H ou moins), le prix oscille fréquemment autour de l'EMA200 en marché
            instable. Chaque mèche ressemble à un rejet. Solution :{" "}
            <strong className="text-white">privilégier H4 et Daily</strong>.
          </Muted>

          <MiniTitle>Piège 4 · Trader EMA200 plate</MiniTitle>
          <Muted>
            Une EMA200 horizontale signale un marché en range, pas en tendance. Toute la logique de la
            stratégie s'effondre. Refus systématique.
          </Muted>

          <MiniTitle>Piège 5 · Trader contre HTF</MiniTitle>
          <Muted>
            Pullback haussier en H4 alors que le D1 est en tendance baissière franche. Setup
            techniquement valide sur la TF traitée, mais contexte macro pousse contre. Pire winrate
            historique.
          </Muted>
        </Chapter>

        {/* CHAPITRE 09 */}
        <Chapter>
          <ChapterHeader
            num="09"
            id="checklist"
            title="Checklist d'exécution exhaustive."
            lead="À appliquer mentalement (ou sur papier) avant chaque entrée. Aucun trade n'est pris si l'un des items est marqué NON sans justification écrite."
          />

          <ChecklistDetailed
            items={[
              { q: "L'EMA200 est-elle clairement pentée (variation ≥ 1× ATR sur 20 bougies) ?", d: "Mesurer la différence entre EMA200(actuelle) et EMA200(il y a 20 bougies). Cette différence en valeur absolue doit dépasser 1× ATR(14). En-dessous, l'EMA est plate et le setup est invalide." },
              { q: "La structure HH/HL ou LH/LL est-elle confirmée sur le HTF ?", d: "Identifier les 3-5 derniers swings. Pour un long : chaque high doit être plus haut que le précédent, chaque low aussi. Toute alternance casse la qualification." },
              { q: "Le prix a-t-il vraiment touché ou pénétré l'EMA200 ?", d: "La mèche de la bougie de rejet doit avoir traversé l'EMA200, ou s'en être approchée à moins de 0.5× ATR. Un \"rejet\" à 1.5 ATR de l'EMA n'en est pas un." },
              { q: "La bougie de rejet remplit-elle au moins 3 des 4 critères du chapitre 04 ?", d: "Position EMA + mèche significative (≥50% de la hauteur) + clôture dans la moitié favorable + contexte de phase 3 (pullback préalable visible)." },
              { q: "Le RSI a-t-il reset hors zone extrême ?", d: "RSI(14) au moment du contact EMA200 doit être entre 40 et 55 pour un long. Hors de ces zones : pullback pas mûr ou tendance épuisée." },
              { q: "Le HTF supérieur est-il aligné ou neutre ?", d: "Regarder le TF immédiatement supérieur (D1 si on trade H4). La tendance doit être alignée ou au minimum neutre. Si le HTF est franchement contre : pas de trade." },
              { q: "Le RR projeté vers le swing high/low précédent est-il ≥ 1.5 ?", d: "Calcul = (swing précédent − entry) ÷ (entry − SL). Doit être ≥ 1.5 pour que le TP1 partial fill ait du sens." },
              { q: "La maturité de la tendance est-elle early ou mid (pas late) ?", d: "Compter le nombre de touches significatives précédentes de l'EMA200 dans la tendance actuelle. Si c'est la 5e touche ou plus, redoubler de prudence ou skip." },
            ]}
          />
        </Chapter>

        {/* CHAPITRE 10 */}
        <Chapter>
          <ChapterHeader
            num="10"
            id="backtest"
            title="Méthodologie de backtest rigoureux."
            lead="Aucune statistique de performance n'est avancée dans ce module. Voici comment générer tes propres chiffres sur ton marché, ton timeframe, ta période."
          />

          <SubTitle>Protocole en 7 étapes</SubTitle>
          <List
            ordered
            items={[
              <><strong className="text-white">Sélection de l'instrument et du TF</strong> — choisir 1 instrument tendanciel + 1 TF (H4 ou D1 conseillé) + une période d'au minimum 24 mois.</>,
              <><strong className="text-white">Identification des phases de tendance</strong> — marquer les zones où l'EMA200 est nettement pentée. Objectif : 4-8 phases identifiées.</>,
              <><strong className="text-white">Marquage des touches EMA200</strong> — pour chaque phase, lister toutes les touches significatives. Catégoriser en early / mid / late.</>,
              <><strong className="text-white">Application des critères du chapitre 04</strong> — vérifier les 4 critères. Garder uniquement les touches qui valident au moins 3 sur 4.</>,
              <><strong className="text-white">Simulation du trade</strong> — calculer entry (clôture rejet), SL (low rejet − 0.2 ATR), TP1 (swing précédent), TP2 (Fib 1.618).</>,
              <><strong className="text-white">Calcul des métriques par catégorie</strong> — winrate, profit factor, expectancy, drawdown max. Détailler par catégorie early/mid/late pour valider l'hypothèse du chapitre 07.</>,
              <><strong className="text-white">Test de robustesse</strong> — répéter sur 2 autres instruments tendanciels distincts. La stratégie doit rester positive sur les 3 instruments.</>,
            ]}
          />

          <Box variant="note" label="Sample size critique">
            <strong className="text-white">
              Aucune conclusion statistique n'est valide en-dessous de 60 trades simulés.
            </strong>{" "}
            Cette stratégie a une fréquence faible — 5 à 15 trades par an par instrument. Pour atteindre
            60 trades, prévoir minimum 24 mois sur 3 instruments différents.
          </Box>

          <SubTitle>Template de journal de trade</SubTitle>
          <Muted>
            Colonnes spécifiques à cette stratégie (numéro de touche, catégorie de maturité)
            indispensables pour valider l'hypothèse early/mid/late.
          </Muted>

          <JournalGrid
            cells={[
              { key: "Date / Heure", placeholder: "YYYY-MM-DD HH:MM" },
              { key: "Instrument · TF", placeholder: "Ex: BTCUSDT · H4" },
              { key: "Direction", placeholder: "LONG / SHORT" },
              { key: "N° de touche", placeholder: "N (1, 2, 3...)" },
              { key: "Catégorie maturité", placeholder: "EARLY / MID / LATE" },
              { key: "Pattern de rejet", placeholder: "PIN / ENGULF / DOJI" },
              { key: "Critères bougie validés", placeholder: "N / 4" },
              { key: "RSI au contact", placeholder: "XX" },
              { key: "HTF aligné ?", placeholder: "OUI / NEUTRE / NON" },
              { key: "Pente EMA200 / 20 bougies", placeholder: "X.X × ATR" },
              { key: "Prix d'entrée", placeholder: "X.XXXX" },
              { key: "SL", placeholder: "X.XXXX" },
              { key: "TP1 / TP2", placeholder: "X.XXXX / X.XXXX" },
              { key: "Risque (% capital)", placeholder: "X.X%" },
              { key: "Scénario observé", placeholder: "A / B / C" },
              { key: "Résultat (R)", placeholder: "+X.XX R / −1.00 R" },
            ]}
          />

          <Box variant="good" label="Objectif final">
            À l'issue du protocole : un fichier de 60+ trades sur tes marchés, avec winrate, expectancy
            et profit factor mesurés{" "}
            <strong className="text-white">par catégorie (early/mid/late)</strong>. Si l'expectancy est
            positive sur early et mid, même si elle est nulle ou négative sur late, tu as une stratégie
            tradable : il suffit alors d'exclure les setups late.
          </Box>
        </Chapter>
      </article>
    </>
  );
}
