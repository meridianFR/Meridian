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
  Figure,
  ScenarioGrid,
} from "./blocks";

const TOC = [
  { num: "01", id: "definition", label: "Définition" },
  { num: "02", id: "phases", label: "Les 4 phases" },
  { num: "03", id: "qualifier", label: "Range valide" },
  { num: "04", id: "candle", label: "Bougie de cassure" },
  { num: "05", id: "scenarios", label: "3 scénarios" },
  { num: "06", id: "management", label: "Gestion" },
  { num: "07", id: "filters", label: "Filtres" },
  { num: "08", id: "traps", label: "Pièges" },
  { num: "09", id: "checklist", label: "Checklist" },
  { num: "10", id: "backtest", label: "Backtest" },
];

/* Bougies décortiquant la compression de volatilité avant la cassure (chapitre 02). */
const FIG_COMPRESSION: ChartConfig = {
  candles: [
    { o: 56, h: 73, l: 54, c: 70 },
    { o: 70, h: 74, l: 60, c: 62 },
    { o: 62, h: 72, l: 59, c: 70 },
    { o: 70, h: 73, l: 64, c: 65 },
    { o: 65, h: 71, l: 62, c: 69 },
    { o: 69, h: 71, l: 65, c: 66 },
    { o: 66, h: 69, l: 64, c: 67 },
    { o: 67, h: 69, l: 65, c: 66 },
    { o: 66, h: 92, l: 65, c: 89, highlight: true },
    { o: 89, h: 95, l: 86, c: 93 },
  ],
  zones: [{ y1: 74, y2: 59, color: "neutral", label: "Compression" }],
  levels: [
    { y: 74, color: "bear", label: "RÉSIST." },
    { y: 59, color: "bull", label: "SUPPORT" },
  ],
};

/* Gros plan sur la bougie de cassure et ses proportions (chapitre 04). */
const FIG_BREAK_CANDLE: ChartConfig = {
  candles: [
    { o: 64, h: 69, l: 62, c: 66 },
    { o: 66, h: 70, l: 64, c: 65 },
    { o: 65, h: 69, l: 63, c: 67 },
    { o: 67, h: 70, l: 65, c: 68 },
    { o: 68, h: 95, l: 67, c: 90, highlight: true },
    { o: 90, h: 97, l: 87, c: 94 },
  ],
  levels: [{ y: 70, color: "bear", label: "BORNE" }],
  markers: [
    { x: 4, y: 90, type: "tp", label: "CLÔTURE NETTE", dir: "left" },
    { x: 4, y: 68, type: "entry", label: "CORPS > 60%", dir: "left" },
  ],
};

/* Trois trajectoires possibles après la cassure (chapitre 05). */
const FIG_SCEN_CLEAN: ChartConfig = {
  candles: [
    { o: 60, h: 66, l: 57, c: 64 },
    { o: 64, h: 67, l: 60, c: 62 },
    { o: 62, h: 68, l: 60, c: 66 },
    { o: 66, h: 85, l: 65, c: 82, highlight: true },
    { o: 82, h: 91, l: 80, c: 89 },
    { o: 89, h: 96, l: 86, c: 94 },
  ],
  levels: [{ y: 68, color: "info", label: "BORNE" }],
};
const FIG_SCEN_PULLBACK: ChartConfig = {
  candles: [
    { o: 60, h: 66, l: 57, c: 64 },
    { o: 64, h: 68, l: 61, c: 66 },
    { o: 66, h: 85, l: 65, c: 82, highlight: true },
    { o: 82, h: 84, l: 70, c: 71 },
    { o: 71, h: 79, l: 69, c: 77, highlight: true },
    { o: 77, h: 92, l: 75, c: 90 },
  ],
  levels: [{ y: 69, color: "info", label: "BORNE" }],
};
const FIG_SCEN_FAILED: ChartConfig = {
  candles: [
    { o: 60, h: 66, l: 57, c: 64 },
    { o: 64, h: 68, l: 61, c: 66 },
    { o: 66, h: 83, l: 65, c: 80, highlight: true },
    { o: 80, h: 81, l: 66, c: 67 },
    { o: 67, h: 69, l: 57, c: 59, highlight: true },
    { o: 59, h: 61, l: 51, c: 53 },
  ],
  levels: [{ y: 68, color: "info", label: "BORNE" }],
};

export function BreakoutRangeAnatomy() {
  const s = getStrategyBySlug("breakout-range")!;

  return (
    <>
      <AnatomyHero
        module={1}
        title="Breakout de Range :"
        em="l'anatomie d'une cassure exploitable."
        lead="Décomposition en 10 chapitres d'une des configurations les plus universelles du trading manuel. Comment identifier un range valide, lire la compression de volatilité, qualifier la bougie de cassure, gérer le trade jusqu'à sa sortie — et surtout, comment vérifier la pertinence de la stratégie sur ton marché plutôt que de croire à des chiffres inventés."
        meta={[
          { value: "15m → 4H", label: "Timeframes cibles" },
          { value: "Crypto · FX · Indices", label: "Marchés" },
          { value: "Breakout", label: "Régime" },
          { value: "2 / 5", label: "Complexité" },
          { value: "Moyenne", label: "Fréquence" },
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
            title="Qu'est-ce qu'un range exploitable ?"
            lead="Un range est une zone de prix où l'offre et la demande s'équilibrent temporairement. La majorité des ranges ne sont pas exploitables — il faut savoir distinguer les vraies zones de compression des simples consolidations passagères."
          />
          <SubTitle>La définition opérationnelle</SubTitle>
          <P>
            Un range exploitable est défini par <strong className="text-white">quatre éléments mesurables</strong> :
            une borne supérieure (résistance), une borne inférieure (support), une amplitude stable
            dans le temps, et un minimum de touches alternées sur les bornes. La présence simultanée
            de ces quatre éléments est ce qui distingue un range tradable d'une simple consolidation
            en milieu de tendance.
          </P>

          <Figure
            config={s.chart}
            id="br-fig-1"
            caption={
              <>
                Un range exploitable : deux bornes nettes (<span className="text-risk">résistance</span>{" "}
                et <span className="text-edge">support</span>), des touches alternées, puis la bougie de
                cassure qui libère le mouvement vers le <span className="text-edge">TP</span>.
              </>
            }
          />

          <List
            items={[
              <><strong className="text-white">Borne supérieure</strong> : un niveau de résistance touché au moins deux fois, avec rejet visible (mèche, retour).</>,
              <><strong className="text-white">Borne inférieure</strong> : un niveau de support touché au moins deux fois, avec rejet visible également.</>,
              <><strong className="text-white">Amplitude stable</strong> : la largeur du range ne s'étend pas significativement au fil du temps — sinon c'est un mouvement de volatilité, pas un range.</>,
              <><strong className="text-white">Touches alternées</strong> : un minimum de 4 touches au total (2 par borne), idéalement en alternance, pour caractériser un véritable équilibre.</>,
            ]}
          />

          <Box variant="note" label="Principe">
            Plus un range est testé sans se rompre, plus la cassure éventuelle libère d'énergie.
            Les ranges très matures (5+ touches sur chaque borne) produisent statistiquement{" "}
            <strong className="text-white">des cassures plus impulsives</strong> — c'est l'idée centrale
            de cette stratégie, qu'il faudra <strong className="text-white">vérifier sur tes données</strong>.
          </Box>
        </Chapter>

        {/* CHAPITRE 02 */}
        <Chapter>
          <ChapterHeader
            num="02"
            id="phases"
            title="Les quatre phases d'un breakout."
            lead="Tout breakout exploitable passe par une séquence ordonnée de quatre phases. Lire cette séquence en temps réel, c'est anticiper la cassure plutôt que la subir."
          />

          <Phases
            phases={[
              { num: "01", name: "Formation", desc: "Le prix oscille entre deux bornes, formant un range visible. Minimum deux touches sur chaque borne pour qu'on puisse parler de range." },
              { num: "02", name: "Compression", desc: "L'ATR diminue, les bougies rétrécissent, le range se resserre. C'est la phase d'absorption d'ordres — la plus importante." },
              { num: "03", name: "Tension", desc: "Les dernières bougies collent à une borne sans la casser. Pression sur les stops, équilibre à son maximum." },
              { num: "04", name: "Décharge", desc: "Bougie impulsive avec corps marqué et volume en expansion. L'équilibre se rompt — déclencheur du trade." },
            ]}
          />

          <Figure
            config={FIG_COMPRESSION}
            id="br-fig-2"
            caption={
              <>
                Lis la séquence sur les bougies : leur amplitude se contracte au fil du temps
                (phases 1 à 3, zone de <span className="text-white">compression</span>) jusqu'à la
                bougie de décharge qui rompt la borne supérieure (phase 4).
              </>
            }
          />

          <Box variant="warn" label="Important">
            Les phases 1 et 2 peuvent durer longtemps (plusieurs jours sur 1H, plusieurs semaines sur D1).
            La patience d'attendre la phase 4 confirmée est ce qui distingue un trader de breakout d'un
            trader de fausses cassures.
          </Box>
        </Chapter>

        {/* CHAPITRE 03 */}
        <Chapter>
          <ChapterHeader
            num="03"
            id="qualifier"
            title="Qualifier un range : bonnes vs mauvaises configurations."
            lead="Tous les ranges ne se valent pas. Voici les critères qui séparent un range tradable d'une consolidation à éviter — entraîne ton œil à les reconnaître avant d'agir."
          />

          <Criteria
            goodTitle="Range exploitable"
            badTitle="À éviter"
            good={[
              "Bornes touchées 3-5 fois avec rejets nets",
              "ATR en contraction sur 10+ bougies",
              "Largeur ≥ 2× ATR pour permettre RR ≥ 2:1",
              "Pas de news macro programmée pendant la fenêtre",
              "Contexte HTF neutre ou aligné avec la cassure attendue",
              "Volume globalement décroissant pendant la compression",
            ]}
            bad={[
              "Range trop large : risk-reward défavorable",
              "Range trop étroit : signal trop faible, bruit dominant",
              "Une seule touche par borne (pas encore un range)",
              "Range en milieu de tendance forte (probable continuation)",
              "Bornes mal définies, plusieurs niveaux flous",
              "Volatilité en expansion (l'inverse de ce qu'on cherche)",
            ]}
          />
        </Chapter>

        {/* CHAPITRE 04 */}
        <Chapter>
          <ChapterHeader
            num="04"
            id="candle"
            title="Anatomie de la bougie de cassure."
            lead="La bougie qui casse le range est le déclencheur du trade. Sa qualité détermine la probabilité que le mouvement se prolonge. Voici les cinq critères à mesurer."
          />

          <List
            ordered
            items={[
              <>
                <strong className="text-white">Corps significatif</strong> — le corps doit représenter
                au minimum <strong className="text-white">60% du range total</strong> (high − low).
                Une bougie avec petit corps et longues mèches signale une indécision, pas une rupture.
              </>,
              <>
                <strong className="text-white">Clôture nette au-delà du niveau</strong> — la clôture
                doit dépasser la borne d'au moins <strong className="text-white">0.3× ATR</strong>.
                Une clôture juste au-dessus est trop fragile.
              </>,
              <>
                <strong className="text-white">Mèche opposée courte</strong> — la mèche du côté opposé
                à la cassure doit être <strong className="text-white">inférieure à 25%</strong> du corps.
                Une mèche opposée longue trahit une absorption en cours.
              </>,
              <>
                <strong className="text-white">Volume en expansion</strong> — volume au minimum{" "}
                <strong className="text-white">1.5× la moyenne mobile 20</strong>. Sans volume,
                l'institutionnel n'y participe pas — probablement un piège.
              </>,
              <>
                <strong className="text-white">Taille relative</strong> — la bougie doit être plus
                grande que la majorité de la phase de compression. Idéalement{" "}
                <strong className="text-white">1.5× la taille moyenne</strong> des 20 dernières bougies.
              </>,
            ]}
          />

          <Figure
            config={FIG_BREAK_CANDLE}
            id="br-fig-4"
            caption={
              <>
                La bougie de cassure idéale : un <span className="text-white">corps long</span> qui
                représente plus de 60% de son range, une <span className="text-edge">clôture nette</span>{" "}
                au-delà de la borne, et une mèche opposée minimale. C'est cette signature qu'il faut
                attendre.
              </>
            }
          />

          <Box variant="good" label="Bougie idéale">
            Corps représentant 70-80% du range, clôture franche au-delà du niveau, mèche opposée minimale,
            volume au moins 1.8× la moyenne, taille 1.5-2× la moyenne des bougies récentes.{" "}
            <strong className="text-white">
              Toutes ces conditions ne sont presque jamais réunies simultanément
            </strong>{" "}
            — la patience consiste à attendre les configurations qui s'en approchent le plus.
          </Box>
        </Chapter>

        {/* CHAPITRE 05 */}
        <Chapter>
          <ChapterHeader
            num="05"
            id="scenarios"
            title="Trois scénarios post-cassure."
            lead="Une fois la cassure validée, le marché suit l'un de trois scénarios. Savoir les distinguer permet d'ajuster sa gestion en temps réel plutôt que de subir."
          />

          <ScenarioGrid
            scenarios={[
              {
                tag: "Scénario A",
                tone: "good",
                config: FIG_SCEN_CLEAN,
                id: "br-scen-a",
                title: "Cassure clean",
                desc: "La bougie de cassure enchaîne directement, sans pullback. Le mouvement se développe et atteint vite le premier objectif.",
              },
              {
                tag: "Scénario B",
                tone: "warn",
                config: FIG_SCEN_PULLBACK,
                id: "br-scen-b",
                title: "Cassure + pullback",
                desc: "Le prix revient tester la borne cassée (devenue support), la rejette, puis repart. Deuxième entrée possible pour qui a raté la cassure.",
              },
              {
                tag: "Scénario C",
                tone: "danger",
                config: FIG_SCEN_FAILED,
                id: "br-scen-c",
                title: "Failed breakout",
                desc: "Le prix repasse franchement dans le range et clôture sous la borne. Signal d'invalidation : sortir, ne jamais tenir l'espoir.",
              },
            ]}
          />

          <SubTitle>Scénario A — Cassure clean (continuation immédiate)</SubTitle>
          <Muted>
            La bougie de cassure est suivie de 2-3 bougies dans la même direction sans pullback
            significatif. Scénario idéal : le mouvement se développe et atteint rapidement TP1.
          </Muted>

          <SubTitle>Scénario B — Cassure + pullback (test de la borne cassée)</SubTitle>
          <Muted>
            Après la cassure, le prix revient tester la borne (devenue support). Le test est rejeté,
            puis le mouvement reprend. Deuxième opportunité d'entrée pour ceux qui ont raté la cassure
            initiale.
          </Muted>

          <SubTitle>Scénario C — Failed breakout (à éviter / sortir)</SubTitle>
          <Muted>
            Après la cassure, le prix retourne franchement dans le range et clôture en-dessous de la
            borne. Signal d'invalidation : sortir au break-even ou au stop, ne jamais tenir l'espoir.
          </Muted>

          <Box variant="danger" label="Règle d'invalidation">
            Si le prix clôture à l'intérieur du range dans les{" "}
            <strong className="text-white">2-3 bougies suivant la cassure</strong>, le trade est invalidé.
            Sortie immédiate, indépendamment du SL technique.{" "}
            <strong className="text-white">Ne jamais argumenter avec une invalidation rapide.</strong>
          </Box>
        </Chapter>

        {/* CHAPITRE 06 */}
        <Chapter>
          <ChapterHeader
            num="06"
            id="management"
            title="Gérer le trade jusqu'à sa sortie."
            lead="L'entrée n'est qu'un quart du trade. La gestion du SL, du TP, du break-even et du trailing représente l'autre 75% du résultat final. Voici un protocole exécutable."
          />

          <TradeTable
            rows={[
              { etape: "Entrée", action: "Long à la clôture de la bougie de cassure", critere: "Conditions chapitre 04 validées", niveau: "Close cassure", niveauColor: "info" },
              { etape: "Stop Loss", action: "Sous la borne opposée du range, OU 1.5× ATR sous l'entrée", critere: "Le plus large des deux pour donner de l'air", niveau: "Borne basse −0.2× ATR", niveauColor: "bear" },
              { etape: "TP1", action: "Sortir 50% de la position", critere: "RR = 1:1 atteint", niveau: "Entry + 1× risk", niveauColor: "bull" },
              { etape: "Break-even", action: "Stop déplacé au prix d'entrée sur les 50% restants", critere: "Dès que TP1 est touché", niveau: "Entry", niveauColor: "gold" },
              { etape: "TP2", action: "Sortir le solde, OU activer trailing", critere: "RR = 2:1 atteint (projection range)", niveau: "Entry + 2× risk", niveauColor: "bull" },
              { etape: "Trailing", action: "Stop suiveur sous chaque swing low en H1", critere: "Si momentum continue après TP2", niveau: "Dernier swing low", niveauColor: "gold" },
            ]}
          />

          <Box variant="note" label="Pourquoi le partial fill au TP1">
            Sortir la moitié à RR 1:1 garantit que même si le reste touche le break-even, le trade reste
            profitable. C'est ce qui transforme un winrate de 50% en stratégie positive (cf. expectancy =
            WR × avg_win − (1−WR) × avg_loss).{" "}
            <strong className="text-white">À valider via backtest sur ton marché spécifique.</strong>
          </Box>
        </Chapter>

        {/* CHAPITRE 07 */}
        <Chapter>
          <ChapterHeader
            num="07"
            id="filters"
            title="Filtres avancés pour réduire le bruit."
            lead="Les cassures fausses sont la principale source de pertes. Ces quatre filtres, ajoutés à la logique de base, permettent d'éliminer une partie significative des signaux dégradés."
          />

          <MiniTitle>Filtre 1 · Contexte HTF</MiniTitle>
          <Muted>
            Aligner la cassure avec la tendance du timeframe immédiatement supérieur. Cassure haussière
            en 1H seulement si le 4H est haussier ou neutre. Ce filtre seul élimine typiquement les
            cassures contre la tendance majeure.
          </Muted>

          <MiniTitle>Filtre 2 · VWAP de session</MiniTitle>
          <Muted>
            Pour les marchés à session (indices, actions), trader les cassures haussières seulement
            au-dessus du VWAP de la journée, et inversement. Le VWAP représente le prix moyen pondéré
            que les institutions cherchent à défendre.
          </Muted>

          <MiniTitle>Filtre 3 · Volume profile</MiniTitle>
          <Muted>
            Vérifier qu'il n'y a pas de nœud de volume majeur (HVN) à proximité immédiate du niveau
            cassé. Un HVN agit comme un obstacle. Une zone à faible volume (LVN) favorise au contraire
            les mouvements rapides.
          </Muted>

          <MiniTitle>Filtre 4 · Fenêtre temporelle</MiniTitle>
          <Muted>
            Éviter les cassures dans les 30 minutes précédant une news macro majeure (FOMC, NFP, CPI).
            Privilégier les ouvertures de session active (London 08:00 GMT, New York 13:30 GMT).
          </Muted>

          <Box variant="warn" label="Attention">
            Empiler trop de filtres réduit drastiquement le nombre de signaux.{" "}
            <strong className="text-white">Ne pas dépasser 2-3 filtres</strong> au-delà de la logique
            de base, sinon le sample size devient trop petit pour conclure en backtest.
          </Box>
        </Chapter>

        {/* CHAPITRE 08 */}
        <Chapter>
          <ChapterHeader
            num="08"
            id="traps"
            title="Les cinq pièges classiques."
            lead="La majorité des pertes sur cette stratégie viennent de configurations identifiables. Apprendre à les refuser activement est aussi important qu'identifier les bons setups."
          />

          <MiniTitle>Piège 1 · Mèche only</MiniTitle>
          <Muted>
            Une bougie qui perce le niveau avec une mèche mais clôture dans le range. Techniquement une
            "cassure" mais aucune des conditions de validité n'est remplie. Refus systématique.
          </Muted>

          <MiniTitle>Piège 2 · Cassure pré-news</MiniTitle>
          <Muted>
            Cassure intervenant 5-30 minutes avant une publication macro. La volatilité algorithmique de
            pré-news produit des faux signaux fréquents que le contexte économique balaie en quelques
            minutes.
          </Muted>

          <MiniTitle>Piège 3 · Range en milieu de tendance</MiniTitle>
          <Muted>
            Ce qui ressemble à un range au sein d'une tendance forte est probablement une consolidation
            continuation. Le breakout dans le sens de la tendance majeure n'est pas un vrai breakout de
            range mais une continuation classique.
          </Muted>

          <MiniTitle>Piège 4 · Range trop étroit</MiniTitle>
          <Muted>
            Range dont la largeur est inférieure à 1× ATR. Rapport signal/bruit défavorable : le moindre
            swing du marché traverse le range. Pas exploitable.
          </Muted>

          <MiniTitle>Piège 5 · Cassure tardive</MiniTitle>
          <Muted>
            Entrer 2-3 bougies après la cassure initiale, alors que le mouvement est déjà étendu. Le SL
            doit être plus large pour rester sous la borne, ruinant le RR. Si tu as raté la cassure,
            attendre le pullback ou laisser passer.
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
              { q: "Le range est-il défini avec ≥ 4 touches alternées sur les bornes ?", d: "Compter les touches sur les 50 dernières bougies. Minimum absolu : 2 par borne. Optimal : 3-5 par borne." },
              { q: "L'ATR est-il en contraction sur les 5-10 dernières bougies ?", d: "Tracer l'ATR(14). Sa pente doit être descendante. Un ATR plat ou montant invalide le contexte de compression." },
              { q: "Le volume confirme-t-il la cassure (≥ 1.5× SMA 20) ?", d: "Le volume de la bougie de cassure doit excéder la moyenne mobile 20. Sans confirmation volume, refuser le signal." },
              { q: "La bougie de cassure a-t-elle un corps > 60% de son range ?", d: "Mesurer |close − open| ÷ (high − low). Doit être > 0.6. Une bougie avec petit corps et longues mèches est rejetée." },
              { q: "La clôture est-elle nette au-delà de la borne (≥ 0.3× ATR au-delà) ?", d: "La clôture ne doit pas être seulement \"au-dessus\" mais franchement au-delà. 0.3× ATR = clôture clean." },
              { q: "Le RR projeté est-il ≥ 2:1 vers l'objectif théorique ?", d: "Calcul = (TP − Entry) ÷ (Entry − SL). Doit être ≥ 2.0. Sinon, le ratio espérance/risque rend le trade non profitable même à 50% de winrate." },
              { q: "Aucune news macro programmée dans la fenêtre suivante ?", d: "Vérifier le calendrier économique (Forex Factory, Investing). Pas de news rouge dans les 60 prochaines minutes." },
              { q: "Le contexte HTF est-il aligné ou neutre ?", d: "Regarder le TF supérieur (4H si on trade 1H). La tendance doit être alignée avec la direction de cassure, ou au moins neutre." },
            ]}
          />
        </Chapter>

        {/* CHAPITRE 10 */}
        <Chapter>
          <ChapterHeader
            num="10"
            id="backtest"
            title="Méthodologie de backtest rigoureux."
            lead="Aucune statistique de performance n'est avancée dans ce module. Voici comment générer tes propres chiffres sur ton marché, ton timeframe, ta période — la seule façon honnête de juger une stratégie."
          />

          <SubTitle>Protocole en 7 étapes</SubTitle>
          <List
            ordered
            items={[
              <><strong className="text-white">Sélection de l'instrument et du TF</strong> — choisir 1 instrument + 1 TF + une période d'au minimum 12 mois (24 idéalement).</>,
              <><strong className="text-white">Identification des ranges</strong> — passer en revue tout l'historique et marquer manuellement chaque range valide selon les critères du chapitre 03. Objectif : 30-50 ranges identifiés minimum.</>,
              <><strong className="text-white">Marquage des cassures</strong> — pour chaque range, noter la cassure si elle a lieu, et marquer la bougie déclenchante.</>,
              <><strong className="text-white">Application des critères du chapitre 04</strong> — vérifier les 5 critères. Garder uniquement celles qui valident au moins 4 critères sur 5.</>,
              <><strong className="text-white">Simulation du trade</strong> — calculer entry, SL, TP1 (RR 1:1), TP2 (RR 2:1) selon le chapitre 06. Noter si TP1, TP2 ou SL est touché en premier.</>,
              <><strong className="text-white">Calcul des métriques</strong> — winrate, profit factor, expectancy, drawdown max, série max de pertes. Détailler par direction et par contexte.</>,
              <><strong className="text-white">Test de robustesse</strong> — répéter l'exercice sur 2 autres régimes de marché distincts. La stratégie doit rester positive sur les 3 régimes.</>,
            ]}
          />

          <Box variant="note" label="Sample size critique">
            <strong className="text-white">
              Aucune conclusion statistique n'est valide en-dessous de 100 trades simulés.
            </strong>{" "}
            Si tu obtiens seulement 30 trades sur ton échantillon, ne tire aucune conclusion — élargis la
            période, ajoute un instrument similaire, ou réduis la sélectivité des filtres.
          </Box>

          <SubTitle>Template de journal de trade</SubTitle>
          <Muted>
            À tenir manuellement ou en spreadsheet pour chaque trade simulé. Colonnes minimales pour
            reconstruire les métriques agrégées.
          </Muted>

          <JournalGrid
            cells={[
              { key: "Date / Heure", placeholder: "YYYY-MM-DD HH:MM" },
              { key: "Instrument · TF", placeholder: "Ex: BTCUSDT · 1H" },
              { key: "Direction", placeholder: "LONG / SHORT" },
              { key: "Largeur du range", placeholder: "X.X × ATR" },
              { key: "Nombre de touches", placeholder: "N (haut) / N (bas)" },
              { key: "Critères bougie validés", placeholder: "N / 5" },
              { key: "Prix d'entrée", placeholder: "X.XXXX" },
              { key: "SL", placeholder: "X.XXXX" },
              { key: "TP1 / TP2", placeholder: "X.XXXX / X.XXXX" },
              { key: "Risque (% capital)", placeholder: "X.X%" },
              { key: "Résultat (R)", placeholder: "+X.XX R / −1.00 R" },
              { key: "Notes contextuelles", placeholder: "Session, news, HTF" },
            ]}
          />

          <Box variant="good" label="Objectif final">
            À l'issue du protocole : un fichier de 100+ trades sur ton marché, avec winrate, expectancy et
            profit factor mesurés.{" "}
            <strong className="text-white">
              Si l'expectancy est positive sur 3 régimes distincts, tu as une stratégie tradable.
            </strong>{" "}
            Sinon, tu as économisé un capital réel.
          </Box>
        </Chapter>
      </article>
    </>
  );
}
