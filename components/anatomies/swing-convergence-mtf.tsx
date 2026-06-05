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
  PatternGrid,
} from "./blocks";

const TOC = [
  { num: "01", id: "definition", label: "Le setup" },
  { num: "02", id: "convergence", label: "Convergence" },
  { num: "03", id: "bougie-controle", label: "Bougie de contrôle" },
  { num: "04", id: "second-pb", label: "2ème point bas" },
  { num: "05", id: "scenarios", label: "3 scénarios" },
  { num: "06", id: "gestion", label: "Gestion 25/25" },
  { num: "07", id: "filtres", label: "Filtres" },
  { num: "08", id: "pieges", label: "Pièges" },
  { num: "09", id: "checklist", label: "Checklist" },
  { num: "10", id: "backtest", label: "Backtest" },
];

/* La bougie de contrôle : une impulsive de grand corps suivie de bougies à petit
   corps qui consolident autour de ses extrêmes, puis cassure confirmée (chapitre 03). */
const FIG_BC: ChartConfig = {
  candles: [
    { o: 46, h: 50, l: 44, c: 48 },
    { o: 48, h: 51, l: 45, c: 47 },
    { o: 48, h: 78, l: 47, c: 74, highlight: true },
    { o: 74, h: 77, l: 66, c: 69 },
    { o: 69, h: 75, l: 66, c: 72 },
    { o: 72, h: 78, l: 68, c: 70 },
    { o: 70, h: 76, l: 67, c: 73 },
    { o: 73, h: 77, l: 69, c: 71 },
    { o: 71, h: 90, l: 70, c: 88, highlight: true },
    { o: 88, h: 96, l: 86, c: 94 },
  ],
  levels: [
    { y: 78, color: "bull", label: "HIGH BC" },
    { y: 47, color: "bear", label: "LOW BC" },
  ],
  annotations: [{ x: 2, y: 84, label: "BC" }],
};

/* Zoom sur la structure 1er PB / 2ème PB et le placement du stop (chapitre 04). */
const FIG_2PB: ChartConfig = {
  candles: [
    { o: 60, h: 62, l: 54, c: 55 },
    { o: 55, h: 57, l: 48, c: 51 },
    { o: 51, h: 58, l: 50, c: 56 },
    { o: 56, h: 57, l: 45, c: 46 },
    { o: 46, h: 48, l: 42, c: 44, highlight: true },
    { o: 44, h: 56, l: 43, c: 55, highlight: true },
    { o: 55, h: 64, l: 54, c: 62 },
  ],
  levels: [{ y: 48, color: "info", label: "1er PB" }],
  markers: [
    { x: 5, y: 55, type: "entry", label: "ENTRY", dir: "right" },
    { x: 5, y: 38, type: "sl", label: "SL", dir: "right" },
  ],
  annotations: [{ x: 4, y: 37, label: "2e PB" }],
};

/* Trois trajectoires possibles après l'entrée sur le 2ème point bas (chapitre 05). */
const FIG_SCEN_CLEAN: ChartConfig = {
  candles: [
    { o: 50, h: 52, l: 44, c: 46 },
    { o: 46, h: 48, l: 40, c: 43, highlight: true },
    { o: 43, h: 54, l: 42, c: 52, highlight: true },
    { o: 52, h: 62, l: 51, c: 60 },
    { o: 60, h: 70, l: 59, c: 68 },
    { o: 68, h: 78, l: 67, c: 76 },
  ],
  levels: [{ y: 40, color: "info", label: "2e PB" }],
};
const FIG_SCEN_RETEST: ChartConfig = {
  candles: [
    { o: 50, h: 52, l: 44, c: 46 },
    { o: 46, h: 48, l: 40, c: 43, highlight: true },
    { o: 43, h: 54, l: 42, c: 52, highlight: true },
    { o: 52, h: 55, l: 46, c: 47 },
    { o: 47, h: 56, l: 45, c: 54, highlight: true },
    { o: 54, h: 66, l: 53, c: 64 },
  ],
  levels: [{ y: 40, color: "info", label: "2e PB" }],
};
const FIG_SCEN_FAILED: ChartConfig = {
  candles: [
    { o: 50, h: 52, l: 44, c: 46 },
    { o: 46, h: 48, l: 40, c: 43, highlight: true },
    { o: 43, h: 50, l: 42, c: 48, highlight: true },
    { o: 48, h: 49, l: 40, c: 41 },
    { o: 41, h: 42, l: 32, c: 34, highlight: true },
    { o: 34, h: 36, l: 26, c: 28 },
  ],
  levels: [{ y: 40, color: "bear", label: "2e PB" }],
};

export function SwingConvergenceMTFAnatomy() {
  const s = getStrategyBySlug("swing-convergence-mtf")!;

  return (
    <>
      <AnatomyHero
        module={3}
        title="Swing Convergence :"
        em="l'anatomie d'un pullback en convergence."
        lead="Décomposition en 10 chapitres d'une méthode de swing trend-following multi-timeframe. Comment aligner Weekly, Daily et H1 en un score de convergence, lire les niveaux clés avec la bougie de contrôle, qualifier le 2ème point bas qui déclenche l'entrée, placer le stop au bon endroit, et gérer la sortie 25/25/trailing — sans jamais s'appuyer sur une statistique inventée."
        meta={[
          { value: "M15 → Weekly", label: "Timeframes" },
          { value: "FX · Indices · Matières", label: "Marchés" },
          { value: "Tendance", label: "Régime" },
          { value: "4 / 5", label: "Complexité" },
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
            title="Un seul setup, exécuté mille fois."
            lead="Cette méthode ne cherche pas dix configurations. Elle en exploite une seule — le pullback sur 2ème point bas dans une tendance dont toutes les unités de temps convergent — et refuse systématiquement tout ce qui n'est pas exactement ça. L'asymétrie vient de cette sélectivité."
          />

          <SubTitle>La définition opérationnelle</SubTitle>
          <P>
            Le marché est en tendance haussière validée sur les{" "}
            <strong className="text-white">unités de temps hautes</strong> (Weekly, Daily, H1). Il corrige
            brièvement en M15 sur une <strong className="text-white">zone neutre</strong> — une zone où le
            mouvement marque une pause : moyenne mobile, ancien support, niveau structurel. Un{" "}
            <strong className="text-white">premier point bas</strong> se forme, le marché rebondit
            partiellement, puis revient former un <strong className="text-white">second point bas</strong>{" "}
            (le plus récent chronologiquement). On entre à la confirmation du rebond, stop sous ce 2ème point
            bas — jamais sous le 1er.
          </P>

          <Figure
            config={s.chart}
            id="sc-fig-1"
            caption={
              <>
                Impulsion, puis pullback M15 vers la <span className="text-[#c9a96e]">zone neutre</span> : un
                1er point bas, un léger rebond, puis le 2ème point bas absorbé. L'
                <span className="text-white">entrée</span> se fait sur la reprise, le{" "}
                <span className="text-risk">stop</span> sous le 2ème PB, vers le{" "}
                <span className="text-edge">TP</span>.
              </>
            }
          />

          <List
            items={[
              <><strong className="text-white">Convergence d'abord</strong> : sans alignement Weekly + Daily, on ne regarde même pas le M15. Le contexte commande, le timing suit.</>,
              <><strong className="text-white">Zone neutre</strong> : la correction doit revenir sur une zone qui a un sens (moyenne mobile dynamique, ancien support), pas dans le vide.</>,
              <><strong className="text-white">Deux points bas</strong> : le marché teste, rebondit, re-teste. C'est ce double mouvement qui matérialise l'absorption des vendeurs.</>,
              <><strong className="text-white">Stop structurel</strong> : sous le 2ème PB. Si ce niveau cède, l'hypothèse de reprise est fausse — on sort, sans débattre.</>,
            ]}
          />

          <Box variant="note" label="L'idée centrale">
            On ne capture pas le début d'une tendance, on capture sa{" "}
            <strong className="text-white">reprise après respiration</strong>. Le pullback sur 2ème point bas
            est le moment où le risque est le plus faible (stop serré, sous une structure claire) pour un
            potentiel aligné avec la tendance de fond. Encore faut-il que{" "}
            <strong className="text-white">toutes les unités de temps soient d'accord</strong> — c'est l'objet
            du chapitre suivant.
          </Box>
        </Chapter>

        {/* CHAPITRE 02 */}
        <Chapter>
          <ChapterHeader
            num="02"
            id="convergence"
            title="La convergence multi-timeframe et son score."
            lead="La décision d'entrer est binaire, mais la taille de position est graduelle : elle est l'expression directe d'un score de convergence. Chaque unité de temps alignée rapporte des points ; en dessous d'un seuil, on ne trade pas."
          />

          <SubTitle>La hiérarchie : Weekly &gt; Daily &gt; H1 &gt; M15</SubTitle>
          <P>
            Chaque unité de temps a un rôle précis. Le <strong className="text-white">Weekly</strong> donne le
            biais majeur sur plusieurs mois. Le <strong className="text-white">Daily</strong> est le veto : un
            trade contre le Daily ne se prend pas, jamais. La <strong className="text-white">H1</strong>{" "}
            confirme l'impulsion intermédiaire. Le <strong className="text-white">M15</strong> n'est qu'un
            outil de <em>timing</em> — il déclenche l'entrée, il ne décide pas du sens.
          </P>

          <Phases
            phases={[
              { num: "+3 pts", name: "Weekly", desc: "Bougie de contrôle hebdo dans le sens du trade. Cale la tendance majeure sur plusieurs mois." },
              { num: "+3 pts", name: "Daily", desc: "Bougie de contrôle journalière alignée. C'est le veto : contre le Daily, aucun trade, aucune exception." },
              { num: "+2 pts", name: "H1", desc: "Confirme l'impulsion intermédiaire et la zone de pullback potentielle sur les UT inférieures." },
              { num: "+2 pts", name: "M15", desc: "Signal d'exécution : 2ème point bas et bougie d'absorption sur la zone neutre." },
            ]}
          />

          <Box variant="danger" label="Veto — annule tout le score">
            Trois conditions annulent l'entrée quel que soit le score :{" "}
            <strong className="text-white">une news majeure dans moins d'une heure</strong>, une{" "}
            <strong className="text-white">heure creuse</strong> sans stop élargi, ou un{" "}
            <strong className="text-white">fort décalage récent</strong> (le marché a déjà couru). Un veto
            actif = SKIP, même à 9/10.
          </Box>

          <SubTitle>Le score pilote la taille</SubTitle>
          <Muted>
            La taille n'est jamais fixe. Plus le contexte est clair, plus l'engagement est fort — et
            inversement. En dessous de 6/10, on conserve le capital : pas de trade.
          </Muted>

          <TradeTable
            rows={[
              { etape: "< 6/10", action: "Skip — pas de trade", critere: "Convergence insuffisante ou veto actif", niveau: "—", niveauColor: "bear" },
              { etape: "6–7/10", action: "Taille réduite (~50%), vigilance accrue", critere: "Convergence partielle", niveau: "Petite", niveauColor: "info" },
              { etape: "8–9/10", action: "Taille standard, gestion classique", critere: "Bonne convergence", niveau: "Standard", niveauColor: "bull" },
              { etape: "10/10", action: "Conviction + plan de renforcement préparé", critere: "Tout aligné, opportunité rare", niveau: "Max", niveauColor: "gold" },
            ]}
          />

          <Box variant="note" label="Impulsion vs correction">
            La tendance avance par alternance de jambes <strong className="text-white">impulsives</strong> et{" "}
            <strong className="text-white">correctives</strong>. On engage la taille pleine sur les phases
            impulsives ; en phase corrective, le levier reste limité et la vigilance maximale. Confondre une
            correction avec une reprise est l'erreur la plus coûteuse de la méthode.
          </Box>
        </Chapter>

        {/* CHAPITRE 03 */}
        <Chapter>
          <ChapterHeader
            num="03"
            id="bougie-controle"
            title="La bougie de contrôle : lire les niveaux clés."
            lead="Avant de parler d'entrée, il faut savoir où sont les vrais niveaux. La bougie de contrôle est l'outil qui les matérialise : sans elle, pas de biais, pas de score, pas de trade."
          />

          <P>
            Une <strong className="text-white">bougie de contrôle (BC)</strong> est un point d'ancrage :
            une bougie <strong className="text-white">impulsive</strong> (grand corps, amplitude nettement
            supérieure aux précédentes) suivie d'une série de{" "}
            <strong className="text-white">bougies à petit corps</strong> qui consolident autour de ses
            niveaux. Ses extrêmes — le <strong className="text-white">high</strong> et le{" "}
            <strong className="text-white">low</strong> — deviennent les niveaux que le marché devra franchir,
            avec confirmation, pour redevenir impulsif.
          </P>

          <Figure
            config={FIG_BC}
            id="sc-fig-bc"
            caption={
              <>
                La <span className="text-[#c9a96e]">BC</span> est la grande bougie impulsive. Les petites
                bougies qui suivent consolident entre son <span className="text-edge">high</span> et son{" "}
                <span className="text-risk">low</span> : tant qu'aucun extrême n'est franchi proprement, le
                marché est en pause directionnelle. La cassure confirmée du high relance l'impulsion.
              </>
            }
          />

          <SubTitle>Identifier une BC</SubTitle>
          <List
            items={[
              <>Une <strong className="text-white">grosse bougie</strong> qui casse le range des 3-4 précédentes, au corps nettement plus grand que la moyenne récente.</>,
              <>Elle est <strong className="text-white">suivie de bougies à petit corps</strong> qui consolident et oscillent autour de ses niveaux pendant plusieurs bougies.</>,
              <>Elle est <strong className="text-white">visible sur toutes les UT</strong> — c'est ce qui en fait un repère robuste, du Weekly au M15.</>,
            ]}
          />

          <Muted>
            À chaque revue de marché, trois questions : où est la BC active sur cette UT ? Le prix est-il dans
            son range ou a-t-il franchi un extrême avec confirmation ? L'orientation actuelle coïncide-t-elle
            avec la tendance dominante ? Si le marché « fait du surplace » entre les extrêmes sans direction,
            on reste à l'écart.
          </Muted>

          <Criteria
            goodTitle="Cassure (BO / BD) confirmée"
            badTitle="Cassure avortée (piège)"
            good={[
              "Volume net en expansion sur la cassure de l'extrême",
              "Le prix reste un certain temps au-delà du niveau",
              "Plusieurs bougies confirment au-delà de l'extrême",
              "Cassure alignée avec la tendance dominante HTF",
            ]}
            bad={[
              "Cassure sur faible volume — souvent un coup de mèche isolé",
              "Le prix dépasse l'extrême puis revient dans le range",
              "Cassure contre la tendance majeure",
              "BC très longue : les fausses cassures y sont fréquentes",
            ]}
          />

          <Box variant="warn" label="Le BO avorté">
            Le prix casse le high de la BC, déclenche les stops et les ordres de cassure… puis{" "}
            <strong className="text-white">retombe dans le range</strong>. C'est le piège classique des
            impatients. La parade est simple : exiger une{" "}
            <strong className="text-white">clôture confirmée au-delà de l'extrême</strong>, avec volume et
            durée, avant de considérer la cassure comme réelle.
          </Box>
        </Chapter>

        {/* CHAPITRE 04 */}
        <Chapter>
          <ChapterHeader
            num="04"
            id="second-pb"
            title="Anatomie du 2ème point bas."
            lead="Le 2ème point bas est le déclencheur du trade — et la référence du stop. La grande majorité des erreurs d'exécution viennent d'un placement de stop incorrect. Voici la mécanique exacte."
          />

          <SubTitle>La structure en deux temps</SubTitle>
          <List
            ordered
            items={[
              <>Le marché monte (<strong className="text-white">impulsion</strong>), puis corrige légèrement en M15.</>,
              <>Il forme un <strong className="text-white">1er point bas</strong> sur la zone neutre.</>,
              <>Léger rebond, puis nouvelle baisse.</>,
              <>Formation d'un <strong className="text-white">2ème point bas</strong> (le plus récent), qui est absorbé par les acheteurs.</>,
              <>Une <strong className="text-white">bougie d'absorption</strong> ou un rebond confirmé clôture → signal d'entrée.</>,
            ]}
          />

          <Figure
            config={FIG_2PB}
            id="sc-fig-2pb"
            caption={
              <>
                Le pullback se construit en deux temps : un <span className="text-white">1er point bas</span>,
                un rebond, puis le <span className="text-risk">2ème point bas</span>. L'entrée se fait sur la
                bougie d'absorption ; le <span className="text-risk">stop</span> se place{" "}
                <strong className="text-white">sous ce 2ème point bas</strong>, pas sous le 1er.
              </>
            }
          />

          <SubTitle>Deux configurations, une seule règle de stop</SubTitle>
          <PatternGrid
            patterns={[
              {
                name: "Config A · 2ème PB ≥ 1er PB",
                desc: (
                  <>
                    Double creux classique : le 2ème point bas tient au niveau du 1er ou juste au-dessus.
                    Signal d'absorption net. Stop sous le 2ème.
                  </>
                ),
              },
              {
                name: "Config B · 2ème PB < 1er PB",
                desc: (
                  <>
                    Le 2ème perce légèrement le niveau du 1er, déclenche des stops, puis rebondit (bear-trap).
                    Stop sous le 2ème, qui est ici le plus bas.
                  </>
                ),
              },
            ]}
          />

          <Box variant="danger" label="Règle de stop — non négociable">
            Peu importe que le 2ème point bas soit plus haut, égal ou plus bas que le 1er : le stop se place{" "}
            <strong className="text-white">toujours sous le 2ème (le plus récent chronologiquement)</strong>.
            C'est lui qui matérialise la dernière tentative de baisse absorbée. S'il cède après l'entrée, le
            setup est invalidé — sortie immédiate, <strong className="text-white">sans élargir le stop « pour
            donner de l'air »</strong>.
          </Box>
        </Chapter>

        {/* CHAPITRE 05 */}
        <Chapter>
          <ChapterHeader
            num="05"
            id="scenarios"
            title="Trois trajectoires après l'entrée."
            lead="Une fois entré sur le 2ème point bas, le marché suit l'un de trois scénarios. Les distinguer en temps réel permet d'ajuster la gestion plutôt que de subir."
          />

          <ScenarioGrid
            scenarios={[
              {
                tag: "Scénario A",
                tone: "good",
                config: FIG_SCEN_CLEAN,
                id: "sc-scen-a",
                title: "Reprise immédiate",
                desc: "La bougie d'absorption enchaîne directement. Le mouvement se développe et atteint vite TP1 puis TP2.",
              },
              {
                tag: "Scénario B",
                tone: "warn",
                config: FIG_SCEN_RETEST,
                id: "sc-scen-b",
                title: "Retest puis reprise",
                desc: "Le prix revient tester la zone d'entrée, la tient au-dessus du 2ème PB, puis repart. Le trade reste valide tant que le 2ème PB n'est pas cassé.",
              },
              {
                tag: "Scénario C",
                tone: "danger",
                config: FIG_SCEN_FAILED,
                id: "sc-scen-c",
                title: "2ème PB cassé",
                desc: "Le prix repasse sous le 2ème point bas. La structure du pullback est rompue : c'est le stop, on sort sans tenir l'espoir.",
              },
            ]}
          />

          <SubTitle>Scénario A — Reprise immédiate</SubTitle>
          <Muted>
            La bougie d'absorption est suivie de plusieurs bougies dans le sens de la tendance sans pullback
            significatif. Scénario idéal : la gestion 25/25/trailing du chapitre suivant se déroule sans
            friction.
          </Muted>

          <SubTitle>Scénario B — Retest de la zone d'entrée</SubTitle>
          <Muted>
            Après l'entrée, le prix revient tester la zone, la rejette au-dessus du 2ème point bas, puis
            reprend. C'est inconfortable mais sain : tant que le 2ème PB tient, l'hypothèse reste valide.
          </Muted>

          <SubTitle>Scénario C — Cassure du 2ème point bas</SubTitle>
          <Muted>
            Le prix clôture sous le 2ème point bas. L'absorption a échoué, les vendeurs reprennent la main.
            Signal d'invalidation : sortie au stop, jamais d'argumentation rétroactive.
          </Muted>

          <Box variant="danger" label="Règle d'invalidation">
            La cassure franche du 2ème point bas invalide le trade,{" "}
            <strong className="text-white">indépendamment de tout autre signal</strong>. Le stop est technique,
            placé sur la plateforme — jamais « mental ».
          </Box>
        </Chapter>

        {/* CHAPITRE 06 */}
        <Chapter>
          <ChapterHeader
            num="06"
            id="gestion"
            title="Gérer la sortie : 25 / 25 / trailing."
            lead="L'entrée n'est qu'un quart du trade. La sortie progressive est ce qui transforme une bonne lecture en résultat asymétrique : on sécurise tôt, on laisse courir le solde."
          />

          <TradeTable
            rows={[
              { etape: "Entrée", action: "Long à la clôture de la bougie d'absorption du 2ème PB", critere: "Convergence ≥ 6/10, aucun veto", niveau: "Close absorption", niveauColor: "info" },
              { etape: "Stop Loss", action: "Sous le 2ème point bas (le plus récent)", critere: "Référence structurelle d'invalidation", niveau: "Sous 2e PB", niveauColor: "bear" },
              { etape: "TP1 · +1R", action: "Sortir 25% de la position", critere: "Distance = risque initial atteinte", niveau: "Entry + 1R", niveauColor: "bull" },
              { etape: "Break-even", action: "Stop des 75% restants remonté à l'entrée", critere: "Dès que TP1 est touché", niveau: "Entry", niveauColor: "gold" },
              { etape: "TP2 · +2R", action: "Sortir 25% supplémentaires", critere: "Distance = 2× le risque initial", niveau: "Entry + 2R", niveauColor: "bull" },
              { etape: "Stop → +1R", action: "Stop des 50% restants remonté au niveau de TP1", critere: "Dès que TP2 est touché", niveau: "Entry + 1R", niveauColor: "gold" },
              { etape: "Runner", action: "Laisser courir les 50% en trailing", critere: "Sortie sur retournement d'oscillateur ou objectif majeur", niveau: "Trailing", niveauColor: "gold" },
            ]}
          />

          <Box variant="note" label="Pourquoi 25 / 25 / trailing">
            Sortir 25% à +1R et 25% à +2R, puis remonter le stop à chaque palier, garantit qu'après TP2 le
            trade verrouille un gain minimum même si le runner revient au stop. C'est cette mécanique — et non
            une prédiction — qui crée l'asymétrie :{" "}
            <strong className="text-white">petites pertes contrôlées, gains qui respirent</strong>. À valider
            sur tes propres données.
          </Box>

          <MiniTitle>Le runner · trailing par oscillateur</MiniTitle>
          <Muted>
            Les 50% restants n'ont plus de TP fixe : on laisse les indicateurs décider de la sortie. On remonte
            manuellement le stop sous chaque creux mineur à chaque nouveau plus-haut. Signaux de sortie du
            runner : oscillateur lent qui croise à la baisse en zone de surachat, momentum qui retombe sous son
            seuil après un pic, cassure de la moyenne mobile rapide en H1, ou figure de retournement nette.
          </Muted>

          <MiniTitle>Renforcement progressif (avancé)</MiniTitle>
          <Criteria
            goodTitle="Conditions pour renforcer"
            badTitle="À ne jamais faire"
            good={[
              "Le trade est déjà gagnant (jamais sur une position perdante)",
              "Marché impulsif, Daily et H1 dans le même sens",
              "Signal d'entrée évident sur l'unité de temps de timing",
              "Le stop principal est déjà au-dessus du prix de revient",
              "L'ajout est de taille inférieure à la position initiale",
            ]}
            bad={[
              "Renforcer une position qui perd",
              "Descendre le stop « pour donner de l'air »",
              "Renforcer en marché correctif ou indécis",
              "Augmenter la taille initiale au lieu de renforcer proprement",
              "Ne jamais prendre de partiels et tout rendre au final",
            ]}
          />
        </Chapter>

        {/* CHAPITRE 07 */}
        <Chapter>
          <ChapterHeader
            num="07"
            id="filtres"
            title="Filtres : décalage, sessions, news."
            lead="La logique de base se suffit rarement à elle-même. Ces filtres éliminent les contextes où le setup, même bien dessiné, a une probabilité dégradée."
          />

          <MiniTitle>Filtre 1 · Fort décalage (anti-FOMO)</MiniTitle>
          <Muted>
            Si le marché a déjà couru — typiquement un mouvement supérieur à environ 3× l'ATR depuis le dernier
            creux — entrer sur le pullback est risqué : on achète tard une jambe étendue. La parade : attendre
            une nouvelle base de consolidation. C'est le filtre qui protège le mieux contre l'entrée
            émotionnelle.
          </Muted>

          <MiniTitle>Filtre 2 · Heures de session</MiniTitle>
          <Muted>
            Toutes les heures ne se valent pas. Les fenêtres de forte liquidité (chevauchement des grandes
            sessions) offrent des mouvements plus propres. Les heures creuses rendent les stops plus
            vulnérables aux mèches sans direction.
          </Muted>

          <Criteria
            goodTitle="Fenêtres à privilégier"
            badTitle="Fenêtres à éviter (ou stop élargi)"
            good={[
              "Chevauchement des grandes sessions : prime time, taille normale",
              "Sessions principales du marché concerné : bonne liquidité",
              "Mouvements directionnels, mèches lisibles",
            ]}
            bad={[
              "Heures creuses : pas de trade, ou stop élargi obligatoire",
              "Liquidité fantôme : ATR anormalement bas",
              "Veille de week-end pour une position swing par défaut",
            ]}
          />

          <MiniTitle>Filtre 3 · Fenêtre de news</MiniTitle>
          <Muted>
            Pas d'entrée dans les minutes précédant une publication macro majeure. Si une news majeure tombe en
            cours de position : sécuriser au moins la moitié si déjà en gain, couper sinon.
          </Muted>

          <Box variant="warn" label="Objectiver les concepts">
            « Zone neutre » et « fort décalage » restent à l'œil tant qu'on ne les outille pas. Une moyenne
            mobile rend la zone neutre <strong className="text-white">visible</strong> (support dynamique du
            pullback) ; l'ATR rend le décalage <strong className="text-white">mesurable</strong> (en multiples
            de volatilité). Transformer le subjectif en règle binaire, c'est retirer l'émotion de la décision.
          </Box>
        </Chapter>

        {/* CHAPITRE 08 */}
        <Chapter>
          <ChapterHeader
            num="08"
            id="pieges"
            title="Les six pièges classiques."
            lead="La plupart des pertes sur cette méthode viennent de configurations identifiables. Les refuser activement est aussi important que reconnaître les bons setups."
          />

          <MiniTitle>Piège 1 · Stop sous le 1er point bas</MiniTitle>
          <Muted>
            L'erreur d'exécution la plus fréquente. Le stop doit être sous le 2ème PB (le plus récent), pas sous
            le 1er. Mal placé, il invalide le trade trop tôt ou trop tard et fausse tout le calcul de R.
          </Muted>

          <MiniTitle>Piège 2 · Fort décalage ignoré</MiniTitle>
          <Muted>
            Entrer sur un pullback après un mouvement déjà étendu, par peur de « rater le train ». Le marché a
            consommé son carburant : la probabilité d'une reprise immédiate chute. Attendre une nouvelle base.
          </Muted>

          <MiniTitle>Piège 3 · Cassure de zone neutre prise pour un pullback</MiniTitle>
          <Muted>
            Une correction qui casse franchement la moyenne mobile et le 1er point bas n'est plus un pullback :
            c'est un retournement potentiel. Le pullback suppose que la zone neutre <em>tient</em>.
          </Muted>

          <MiniTitle>Piège 4 · Trade contre le Daily</MiniTitle>
          <Muted>
            Le signal M15 est séduisant, mais le Daily est contraire. C'est un veto absolu : une seule unité de
            temps qui contredit le biais suffit à annuler le trade.
          </Muted>

          <MiniTitle>Piège 5 · Renforcer une position perdante</MiniTitle>
          <Muted>
            Ajouter à une position qui perd pour « moyenner ». C'est l'inverse de la méthode : on ne renforce
            que les trades déjà gagnants, en marché impulsif, avec un stop déjà sécurisé.
          </Muted>

          <MiniTitle>Piège 6 · Élargir le stop / position over-weekend</MiniTitle>
          <Muted>
            Élargir le stop en cours de trade « pour respirer » transforme une perte contrôlée en perte subie.
            De même, garder une position swing au-dessus du week-end par défaut, sans conviction forte, expose
            aux gaps d'ouverture : par défaut, sécuriser au moins la moitié le vendredi.
          </Muted>
        </Chapter>

        {/* CHAPITRE 09 */}
        <Chapter>
          <ChapterHeader
            num="09"
            id="checklist"
            title="Checklist d'exécution : les 10 points."
            lead="À valider avant chaque entrée. Si une seule case n'est pas cochée, on revoit le sizing à la baisse — ou on passe son tour. Aucun trade ne se prend sur un « à peu près »."
          />

          <ChecklistDetailed
            items={[
              { q: "Le Weekly va-t-il dans mon sens ?", d: "Bougie de contrôle hebdo alignée avec la direction du trade. Sinon : SKIP — le contexte majeur prime." },
              { q: "Le Daily va-t-il dans mon sens ?", d: "Bougie de contrôle journalière alignée. C'est le veto principal : Daily contraire = pas de trade, aucune exception." },
              { q: "La H1 confirme-t-elle l'impulsion ?", d: "Structure ou bougie de contrôle H1 en faveur du sens. Sinon : attendre que la H1 se replace." },
              { q: "Y a-t-il eu un fort décalage récent ?", d: "Mesurer le dernier mouvement en multiples d'ATR. Au-delà de ~3× ATR depuis le dernier creux : SKIP (anti-FOMO)." },
              { q: "Suis-je sur un pullback en zone neutre ?", d: "La correction M15 revient sur une zone qui a un sens (moyenne mobile, ancien support). Sinon : attendre." },
              { q: "Le 2ème point bas tient-il ?", d: "Structure en deux points bas confirmée, dernier point bas absorbé. Si le 2ème PB casse : SKIP, la structure est rompue." },
              { q: "Mon stop est-il sous le 2ème PB ?", d: "Placement technique sous le 2ème point bas, jamais sous le 1er. Si mal placé : ajuster avant d'entrer." },
              { q: "Mon TP1 vaut-il au moins 1R ?", d: "TP1 ≥ 1R, calculé exactement, pas approximé. En dessous : ne pas prendre le trade." },
              { q: "Suis-je en heure creuse ?", d: "Hors fenêtre de liquidité : stop élargi obligatoire, ou pas de trade." },
              { q: "Une news majeure dans l'heure ?", d: "Vérifier le calendrier économique. News rouge imminente : SKIP." },
            ]}
          />

          <Box variant="good" label="Du score à la taille">
            10/10 → conviction + plan de renforcement. 8-9/10 → taille standard. 6-7/10 → taille réduite,
            vigilance accrue. <strong className="text-white">En dessous de 6/10 → SKIP</strong> : la
            conservation du capital prime sur l'envie de trader.
          </Box>
        </Chapter>

        {/* CHAPITRE 10 */}
        <Chapter>
          <ChapterHeader
            num="10"
            id="backtest"
            title="Méthodologie de backtest rigoureux."
            lead="Aucune statistique de performance n'est avancée dans ce module. Voici comment générer tes propres chiffres sur ton marché, ton timeframe et ta période — la seule façon honnête de juger la méthode."
          />

          <SubTitle>Protocole en 7 étapes</SubTitle>
          <List
            ordered
            items={[
              <><strong className="text-white">Sélection</strong> — un instrument tendanciel, sur 12 à 24 mois d'historique minimum, avec les 4 UT disponibles (W / D / H1 / M15).</>,
              <><strong className="text-white">Marquage des contextes</strong> — repérer toutes les fenêtres où Weekly et Daily sont alignés (le reste du temps, la méthode ne s'applique pas).</>,
              <><strong className="text-white">Identification des pullbacks</strong> — dans ces fenêtres, marquer chaque pullback M15 sur zone neutre avec structure en 2ème point bas.</>,
              <><strong className="text-white">Calcul du score</strong> — pour chacun, noter le score de convergence (W/D/H1/M15) et l'éventuel veto (décalage, session, news).</>,
              <><strong className="text-white">Simulation du trade</strong> — entrée, stop sous le 2ème PB, TP1 (1R), TP2 (2R), runner. Noter quel niveau est touché en premier et le R final avec la sortie 25/25/trailing.</>,
              <><strong className="text-white">Calcul des métriques</strong> — winrate, expectancy, profit factor, drawdown max — détaillés <strong className="text-white">par tranche de score</strong> pour vérifier que le score discrimine bien.</>,
              <><strong className="text-white">Robustesse</strong> — répéter sur 2 autres régimes de marché distincts. La méthode doit rester positive sur les 3.</>,
            ]}
          />

          <Box variant="note" label="Sample size critique">
            <strong className="text-white">
              Aucune conclusion statistique n'est valide en dessous de 100 trades simulés.
            </strong>{" "}
            Cette méthode étant sélective, atteindre ce volume demande une période longue ou plusieurs
            instruments similaires. Tant que l'échantillon est trop petit, on ne conclut pas.
          </Box>

          <SubTitle>Template de journal de trade</SubTitle>
          <Muted>
            À tenir pour chaque trade simulé (puis réel). Colonnes minimales pour reconstruire les métriques
            agrégées et vérifier que le score de convergence prédit réellement la performance.
          </Muted>

          <JournalGrid
            cells={[
              { key: "Date / Heure", placeholder: "YYYY-MM-DD HH:MM" },
              { key: "Instrument · session", placeholder: "Catégorie · prime time ?" },
              { key: "Score convergence", placeholder: "N / 10" },
              { key: "Veto actif ?", placeholder: "Décalage / news / heure" },
              { key: "Décalage (× ATR)", placeholder: "X.X × ATR" },
              { key: "Config 2ème PB", placeholder: "A (≥) / B (<)" },
              { key: "Prix d'entrée", placeholder: "X.XXXX" },
              { key: "Stop (sous 2e PB)", placeholder: "X.XXXX" },
              { key: "TP1 / TP2", placeholder: "+1R / +2R" },
              { key: "Taille (selon score)", placeholder: "Petite / Std / Conviction" },
              { key: "Résultat (R)", placeholder: "+X.XX R / −1.00 R" },
              { key: "1 leçon", placeholder: "Une phrase max" },
            ]}
          />

          <Box variant="good" label="Objectif final">
            À l'issue du protocole : un fichier de 100+ trades sur ton marché, avec expectancy mesurée{" "}
            <strong className="text-white">par tranche de score</strong>.{" "}
            <strong className="text-white">
              Si l'expectancy est positive et croît avec le score sur 3 régimes distincts, la méthode est
              tradable
            </strong>{" "}
            — et le score de convergence est un vrai filtre. Sinon, tu as économisé un capital réel.
          </Box>
        </Chapter>
      </article>
    </>
  );
}
