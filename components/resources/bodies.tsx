// Contenu long-form de l'Académie Meridian — registre par locale puis slug.
// PILLAR_BODIES : guides piliers. ARTICLE_BODIES : articles (reçoivent l'objet
// Article pour câbler Toc / ToolCTA / LeadMagnetCTA depuis la donnée unique).
// Voix Meridian : sobre, tutoiement, zéro promesse de gain (périmètre AMF).
//
// Multilingue : on conserve un corps complet par langue (prose riche avec liens
// internes + emphases → modules par langue plutôt que des centaines de clés
// t.rich). Les liens <A> sont localisés automatiquement (blocks.tsx → i18n/navigation).

import type { ReactNode } from "react";
import type { Article, Locale } from "@/lib/resources";
import {
  A,
  ArticleSection,
  Callout,
  KeyTakeaway,
  Lead,
  LeadMagnetCTA,
  LI,
  OL,
  P,
  Toc,
  ToolCTA,
  UL,
} from "./blocks";

function asLocale(locale: string): Locale {
  return locale === "en" || locale === "pt" ? locale : "fr";
}

// ════════════════════════════════════════════════════════════════
// PILIERS
// ════════════════════════════════════════════════════════════════

const PILLAR_BODIES_FR: Record<string, ReactNode> = {
  "gestion-du-risque": (
    <>
      <Lead>
        En trading, tu ne contrôles ni la direction du marché, ni le moment où il va tourner. Tu
        contrôles une seule chose : combien tu perds quand tu as tort. La gestion du risque, c'est
        l'art de transformer cette unique variable en avantage durable.
      </Lead>

      <Toc
        items={[
          { id: "levier", label: "Le risque, ton seul vrai levier" },
          { id: "decisions", label: "Les trois décisions de risque" },
          { id: "regle", label: "La règle du risque fixe" },
          { id: "drawdown", label: "La mathématique du drawdown" },
        ]}
      />

      <ArticleSection id="levier" title="Le risque, ton seul vrai levier">
        <P>
          La plupart des traders cherchent le meilleur point d'entrée. Ceux qui durent cherchent
          d'abord la bonne taille de perte. Ce n'est pas de la prudence : c'est de l'arithmétique.
          Une stratégie même médiocre peut survivre avec un risque maîtrisé ; une excellente
          stratégie se fait détruire par un seul trade surdimensionné.
        </P>
        <P>
          Ton espérance de gain dépend de quatre nombres : ton taux de réussite, ton gain moyen, ta
          perte moyenne, et ta taille de position. Les deux derniers, tu les fixes <em>avant</em> le
          trade. C'est là que se joue l'essentiel — pas dans la prédiction.
        </P>
        <Callout variant="note" title="Process avant prédiction">
          Tu n'as pas besoin d'avoir raison souvent. Tu as besoin de perdre petit quand tu as tort,
          et de laisser courir quand tu as raison. La gestion du risque rend ça mécanique.
        </Callout>
      </ArticleSection>

      <ArticleSection id="decisions" title="Les trois décisions de risque">
        <P>Avant d'entrer, trois questions — dans cet ordre, jamais l'inverse :</P>
        <OL>
          <LI>
            <strong>Combien je risque ?</strong> Un montant fixe, exprimé en pourcentage de ton
            capital (souvent cité entre 0,5 % et 2 % par trade). C'est ta décision la plus
            importante, et elle se prend à froid.
          </LI>
          <LI>
            <strong>Où est mon invalidation ?</strong> Le niveau où ton idée de trade est fausse —
            ton stop loss. Il se place selon le marché, pas selon ce que tu es prêt à perdre.
          </LI>
          <LI>
            <strong>Quelle taille ?</strong> Elle se <em>déduit</em> des deux premières. Jamais
            l'inverse. C'est tout l'objet de l'article{" "}
            <A href="/ressources/gestion-du-risque/calculer-sa-taille-de-position">
              comment calculer sa taille de position
            </A>
            .
          </LI>
        </OL>
        <P>
          Le ratio entre ce que tu risques et ce que tu vises — le{" "}
          <A href="/ressources/gestion-du-risque/ratio-risque-rendement">ratio risque/rendement</A> —
          n'a de sens qu'une fois ces trois décisions posées.
        </P>
      </ArticleSection>

      <ArticleSection id="regle" title="La règle du risque fixe">
        <P>
          Risquer un pourcentage <em>fixe</em> de ton capital à chaque trade a deux vertus. D'abord,
          c'est anti-ruine : en perdant toujours la même fraction, tu ne peux pas être effacé par
          une mauvaise série. Ensuite, c'est auto-correcteur : ton risque baisse en valeur absolue
          quand ton capital baisse, et remonte quand il croît.
        </P>
        <Callout variant="warn" title="Le piège mortel">
          Augmenter sa taille après une perte pour « se refaire » (martingale, moyenne à la baisse)
          est la façon la plus rapide de transformer une mauvaise journée en compte vide. Le risque
          fixe interdit ce réflexe.
        </Callout>
      </ArticleSection>

      <ArticleSection id="drawdown" title="La mathématique du drawdown">
        <P>
          Une perte et le gain nécessaire pour la combler ne sont pas symétriques. Plus tu creuses,
          plus la remontée est disproportionnée :
        </P>
        <UL>
          <LI>Une perte de <strong>10 %</strong> exige <strong>+11 %</strong> pour revenir à l'équilibre.</LI>
          <LI>Une perte de <strong>25 %</strong> exige <strong>+33 %</strong>.</LI>
          <LI>Une perte de <strong>50 %</strong> exige <strong>+100 %</strong> — il faut doubler.</LI>
        </UL>
        <P>
          Cette asymétrie est toute la raison d'être de la gestion du risque : borner les pertes
          n'est pas défensif, c'est ce qui garde la remontée atteignable.
        </P>
        <KeyTakeaway>
          Le risque est la seule variable que tu fixes à l'avance. Décide <strong>combien</strong>{" "}
          avant <strong>où</strong>, déduis la <strong>taille</strong>, garde-la fixe, et protège-toi
          du drawdown profond. Le reste — l'entrée, le marché — est secondaire.
        </KeyTakeaway>
      </ArticleSection>
    </>
  ),

  "journal-de-trading": (
    <>
      <Lead>
        Trade ce que tu mesures. Un journal de trading n'est pas une corvée administrative : c'est
        l'instrument qui transforme une succession de trades en connaissance de toi-même — tes vrais
        setups gagnants, tes fuites récurrentes, et l'edge que tu crois avoir.
      </Lead>

      <Toc
        items={[
          { id: "pourquoi", label: "Pourquoi un journal change tout" },
          { id: "quoi-noter", label: "Quoi noter : l'essentiel" },
          { id: "methode", label: "Du tableur à la revue" },
          { id: "outil", label: "Quand passer à un outil dédié" },
        ]}
      />

      <ArticleSection id="pourquoi" title="Pourquoi un journal change tout">
        <P>
          Sans journal, tu trades de mémoire. Or la mémoire d'un trader est biaisée : elle surpondère
          le dernier trade, oublie les pertes « pas de chance » et embellit les gains « bien joués ».
          Le journal remet les faits à leur place. Il répond à des questions que tu ne peux pas
          trancher autrement :
        </P>
        <UL>
          <LI>Quels setups te rapportent réellement — et lesquels te coûtent ?</LI>
          <LI>À quelles heures, sur quels instruments, es-tu profitable ou destructeur ?</LI>
          <LI>Quelle erreur revient encore et encore sous des formes différentes ?</LI>
        </UL>
        <P>
          On développe ce point dans{" "}
          <A href="/ressources/journal-de-trading/pourquoi-tenir-un-journal-de-trading">
            pourquoi tenir un journal de trading
          </A>
          .
        </P>
      </ArticleSection>

      <ArticleSection id="quoi-noter" title="Quoi noter : l'essentiel">
        <P>
          Un journal trop lourd ne se tient pas. Vise le strict utile : de quoi calculer tes stats{" "}
          <em>et</em> comprendre ton comportement.
        </P>
        <UL>
          <LI>Le factuel : date/heure, instrument, sens, entrée, stop, objectif, taille, résultat en R.</LI>
          <LI>Le décisif : le motif d'entrée (pourquoi ce trade) et l'émotion ressentie.</LI>
        </UL>
        <P>
          La méthode complète, champ par champ, est détaillée dans{" "}
          <A href="/ressources/journal-de-trading/comment-tenir-un-journal-de-trading">
            comment tenir un journal de trading
          </A>
          .
        </P>
      </ArticleSection>

      <ArticleSection id="methode" title="Du tableur à la revue">
        <P>
          Noter ne suffit pas — un tableur jamais relu est un tableur mort. La valeur naît de la
          revue : une note courte juste après chaque trade, puis une synthèse hebdomadaire où tu
          cherches <em>un</em> pattern à corriger pour la semaine suivante. Une décision, pas dix.
        </P>
        <Callout variant="note" title="Le rythme qui tient">
          Saisie immédiate (30 secondes), revue le week-end (20 minutes). C'est la régularité, pas
          l'exhaustivité, qui fait progresser.
        </Callout>
      </ArticleSection>

      <ArticleSection id="outil" title="Quand passer à un outil dédié">
        <P>
          Le tableur est parfait pour commencer. Il montre ses limites quand le volume monte : saisie
          fastidieuse, calculs de stats à maintenir à la main, patterns comportementaux invisibles
          dans une grille de chiffres. C'est précisément là qu'un outil qui importe tes trades et
          calcule tout seul reprend la main.
        </P>
        <KeyTakeaway>
          Un journal n'a de valeur que relu. Note l'essentiel, fais ta revue chaque semaine, vise{" "}
          <strong>une correction</strong> à la fois. Le tableur d'abord ; l'outil dédié quand le
          volume le justifie.
        </KeyTakeaway>
      </ArticleSection>
    </>
  ),
};

const PILLAR_BODIES_EN: Record<string, ReactNode> = {
  "gestion-du-risque": (
    <>
      <Lead>
        In trading, you control neither the market's direction nor the moment it turns. You control
        one thing only: how much you lose when you're wrong. Risk management is the art of turning
        that single variable into a durable edge.
      </Lead>

      <Toc
        items={[
          { id: "levier", label: "Risk, your only real lever" },
          { id: "decisions", label: "The three risk decisions" },
          { id: "regle", label: "The fixed-risk rule" },
          { id: "drawdown", label: "The mathematics of drawdown" },
        ]}
      />

      <ArticleSection id="levier" title="Risk, your only real lever">
        <P>
          Most traders look for the best entry point. Those who last look first for the right loss
          size. That's not caution: it's arithmetic. Even a mediocre strategy can survive with
          controlled risk; an excellent strategy gets destroyed by a single oversized trade.
        </P>
        <P>
          Your expectancy depends on four numbers: your win rate, your average win, your average
          loss, and your position size. The last two you set <em>before</em> the trade. That's where
          the essential is decided — not in prediction.
        </P>
        <Callout variant="note" title="Process before prediction">
          You don't need to be right often. You need to lose small when you're wrong, and let it run
          when you're right. Risk management makes that mechanical.
        </Callout>
      </ArticleSection>

      <ArticleSection id="decisions" title="The three risk decisions">
        <P>Before entering, three questions — in this order, never the reverse:</P>
        <OL>
          <LI>
            <strong>How much do I risk?</strong> A fixed amount, expressed as a percentage of your
            capital (often quoted between 0.5% and 2% per trade). It's your most important decision,
            and it's made when you're calm.
          </LI>
          <LI>
            <strong>Where is my invalidation?</strong> The level where your trade idea is wrong —
            your stop loss. It's placed according to the market, not according to what you're willing
            to lose.
          </LI>
          <LI>
            <strong>What size?</strong> It's <em>derived</em> from the first two. Never the reverse.
            That's the whole point of the article{" "}
            <A href="/ressources/gestion-du-risque/calculer-sa-taille-de-position">
              how to calculate your position size
            </A>
            .
          </LI>
        </OL>
        <P>
          The ratio between what you risk and what you aim for — the{" "}
          <A href="/ressources/gestion-du-risque/ratio-risque-rendement">risk/reward ratio</A> — only
          makes sense once these three decisions are set.
        </P>
      </ArticleSection>

      <ArticleSection id="regle" title="The fixed-risk rule">
        <P>
          Risking a <em>fixed</em> percentage of your capital on every trade has two virtues. First,
          it's anti-ruin: by always losing the same fraction, you can't be wiped out by a bad streak.
          Second, it's self-correcting: your risk drops in absolute terms when your capital drops,
          and rises when it grows.
        </P>
        <Callout variant="warn" title="The deadly trap">
          Increasing your size after a loss to “win it back” (martingale, averaging down) is the
          fastest way to turn a bad day into an empty account. Fixed risk forbids that reflex.
        </Callout>
      </ArticleSection>

      <ArticleSection id="drawdown" title="The mathematics of drawdown">
        <P>
          A loss and the gain needed to recover it are not symmetrical. The deeper you dig, the more
          disproportionate the climb back:
        </P>
        <UL>
          <LI>A <strong>10%</strong> loss requires <strong>+11%</strong> to break even.</LI>
          <LI>A <strong>25%</strong> loss requires <strong>+33%</strong>.</LI>
          <LI>A <strong>50%</strong> loss requires <strong>+100%</strong> — you have to double.</LI>
        </UL>
        <P>
          This asymmetry is the entire reason risk management exists: capping losses isn't
          defensive, it's what keeps the recovery reachable.
        </P>
        <KeyTakeaway>
          Risk is the only variable you set in advance. Decide <strong>how much</strong> before{" "}
          <strong>where</strong>, derive the <strong>size</strong>, keep it fixed, and protect
          yourself from deep drawdown. The rest — the entry, the market — is secondary.
        </KeyTakeaway>
      </ArticleSection>
    </>
  ),

  "journal-de-trading": (
    <>
      <Lead>
        Trade what you measure. A trading journal isn't administrative drudgery: it's the instrument
        that turns a succession of trades into knowledge of yourself — your real winning setups, your
        recurring leaks, and the edge you think you have.
      </Lead>

      <Toc
        items={[
          { id: "pourquoi", label: "Why a journal changes everything" },
          { id: "quoi-noter", label: "What to record: the essentials" },
          { id: "methode", label: "From spreadsheet to review" },
          { id: "outil", label: "When to move to a dedicated tool" },
        ]}
      />

      <ArticleSection id="pourquoi" title="Why a journal changes everything">
        <P>
          Without a journal, you trade from memory. But a trader's memory is biased: it overweights
          the last trade, forgets the “bad luck” losses and embellishes the “well-played” wins. The
          journal puts the facts back in their place. It answers questions you can't settle any other
          way:
        </P>
        <UL>
          <LI>Which setups actually pay you — and which ones cost you?</LI>
          <LI>At what hours, on which instruments, are you profitable or destructive?</LI>
          <LI>Which mistake comes back again and again in different forms?</LI>
        </UL>
        <P>
          We develop this point in{" "}
          <A href="/ressources/journal-de-trading/pourquoi-tenir-un-journal-de-trading">
            why keep a trading journal
          </A>
          .
        </P>
      </ArticleSection>

      <ArticleSection id="quoi-noter" title="What to record: the essentials">
        <P>
          A journal that's too heavy doesn't get kept. Aim for the strict essentials: enough to
          compute your stats <em>and</em> understand your behaviour.
        </P>
        <UL>
          <LI>The factual: date/time, instrument, direction, entry, stop, target, size, result in R.</LI>
          <LI>The decisive: the entry reason (why this trade) and the emotion felt.</LI>
        </UL>
        <P>
          The complete method, field by field, is detailed in{" "}
          <A href="/ressources/journal-de-trading/comment-tenir-un-journal-de-trading">
            how to keep a trading journal
          </A>
          .
        </P>
      </ArticleSection>

      <ArticleSection id="methode" title="From spreadsheet to review">
        <P>
          Recording isn't enough — a spreadsheet never reread is a dead spreadsheet. Value is born
          from the review: a short note right after each trade, then a weekly summary where you look
          for <em>one</em> pattern to correct for the following week. One decision, not ten.
        </P>
        <Callout variant="note" title="The rhythm that sticks">
          Immediate entry (30 seconds), review on the weekend (20 minutes). It's regularity, not
          exhaustiveness, that drives progress.
        </Callout>
      </ArticleSection>

      <ArticleSection id="outil" title="When to move to a dedicated tool">
        <P>
          The spreadsheet is perfect to start. It shows its limits as volume rises: tedious data
          entry, stats calculations to maintain by hand, behavioural patterns invisible in a grid of
          numbers. That's precisely where a tool that imports your trades and computes everything on
          its own takes over.
        </P>
        <KeyTakeaway>
          A journal only has value when reread. Record the essentials, do your review every week, aim
          for <strong>one correction</strong> at a time. Spreadsheet first; the dedicated tool when
          volume justifies it.
        </KeyTakeaway>
      </ArticleSection>
    </>
  ),
};

const PILLAR_BODIES_PT: Record<string, ReactNode> = {
  "gestion-du-risque": (
    <>
      <Lead>
        Em trading, não controlas nem a direção do mercado, nem o momento em que ele vira. Controlas
        uma só coisa: quanto perdes quando estás errado. A gestão de risco é a arte de transformar
        essa única variável numa vantagem duradoura.
      </Lead>

      <Toc
        items={[
          { id: "levier", label: "O risco, a tua única alavanca real" },
          { id: "decisions", label: "As três decisões de risco" },
          { id: "regle", label: "A regra do risco fixo" },
          { id: "drawdown", label: "A matemática do drawdown" },
        ]}
      />

      <ArticleSection id="levier" title="O risco, a tua única alavanca real">
        <P>
          A maioria dos traders procura o melhor ponto de entrada. Os que duram procuram primeiro o
          tamanho de perda certo. Não é prudência: é aritmética. Uma estratégia até medíocre pode
          sobreviver com risco controlado; uma excelente estratégia é destruída por um único trade
          sobredimensionado.
        </P>
        <P>
          A tua esperança de ganho depende de quatro números: a tua taxa de acerto, o teu ganho
          médio, a tua perda média, e o teu tamanho de posição. Os dois últimos, fixa-los{" "}
          <em>antes</em> do trade. É aí que se joga o essencial — não na previsão.
        </P>
        <Callout variant="note" title="Processo antes de previsão">
          Não precisas de ter razão muitas vezes. Precisas de perder pouco quando estás errado, e de
          deixar correr quando tens razão. A gestão de risco torna isso mecânico.
        </Callout>
      </ArticleSection>

      <ArticleSection id="decisions" title="As três decisões de risco">
        <P>Antes de entrar, três perguntas — por esta ordem, nunca ao contrário:</P>
        <OL>
          <LI>
            <strong>Quanto arrisco?</strong> Um montante fixo, expresso em percentagem do teu capital
            (frequentemente citado entre 0,5% e 2% por trade). É a tua decisão mais importante, e
            toma-se a frio.
          </LI>
          <LI>
            <strong>Onde está a minha invalidação?</strong> O nível onde a tua ideia de trade está
            errada — o teu stop loss. Coloca-se conforme o mercado, não conforme o que estás disposto
            a perder.
          </LI>
          <LI>
            <strong>Que tamanho?</strong> <em>Deduz-se</em> das duas primeiras. Nunca ao contrário. É
            todo o objeto do artigo{" "}
            <A href="/ressources/gestion-du-risque/calculer-sa-taille-de-position">
              como calcular o tamanho de posição
            </A>
            .
          </LI>
        </OL>
        <P>
          O rácio entre o que arriscas e o que visas — o{" "}
          <A href="/ressources/gestion-du-risque/ratio-risque-rendement">rácio risco/retorno</A> — só
          faz sentido depois de tomadas estas três decisões.
        </P>
      </ArticleSection>

      <ArticleSection id="regle" title="A regra do risco fixo">
        <P>
          Arriscar uma percentagem <em>fixa</em> do teu capital em cada trade tem duas virtudes.
          Primeiro, é anti-ruína: perdendo sempre a mesma fração, não podes ser eliminado por uma má
          série. Depois, é autocorretor: o teu risco baixa em valor absoluto quando o teu capital
          baixa, e sobe quando ele cresce.
        </P>
        <Callout variant="warn" title="A armadilha mortal">
          Aumentar o tamanho após uma perda para «recuperar» (martingale, fazer média em baixa) é a
          forma mais rápida de transformar um mau dia numa conta vazia. O risco fixo proíbe esse
          reflexo.
        </Callout>
      </ArticleSection>

      <ArticleSection id="drawdown" title="A matemática do drawdown">
        <P>
          Uma perda e o ganho necessário para a compensar não são simétricos. Quanto mais cavas, mais
          desproporcionada é a recuperação:
        </P>
        <UL>
          <LI>Uma perda de <strong>10%</strong> exige <strong>+11%</strong> para voltar ao equilíbrio.</LI>
          <LI>Uma perda de <strong>25%</strong> exige <strong>+33%</strong>.</LI>
          <LI>Uma perda de <strong>50%</strong> exige <strong>+100%</strong> — é preciso duplicar.</LI>
        </UL>
        <P>
          Esta assimetria é toda a razão de ser da gestão de risco: limitar as perdas não é
          defensivo, é o que mantém a recuperação alcançável.
        </P>
        <KeyTakeaway>
          O risco é a única variável que fixas antecipadamente. Decide <strong>quanto</strong> antes
          de <strong>onde</strong>, deduz o <strong>tamanho</strong>, mantém-no fixo, e protege-te do
          drawdown profundo. O resto — a entrada, o mercado — é secundário.
        </KeyTakeaway>
      </ArticleSection>
    </>
  ),

  "journal-de-trading": (
    <>
      <Lead>
        Faz trading do que medes. Um diário de trading não é uma tarefa administrativa: é o
        instrumento que transforma uma sucessão de trades em conhecimento de ti próprio — os teus
        verdadeiros setups vencedores, as tuas fugas recorrentes, e a edge que julgas ter.
      </Lead>

      <Toc
        items={[
          { id: "pourquoi", label: "Porque um diário muda tudo" },
          { id: "quoi-noter", label: "O que registar: o essencial" },
          { id: "methode", label: "Da folha de cálculo à revisão" },
          { id: "outil", label: "Quando passar a uma ferramenta dedicada" },
        ]}
      />

      <ArticleSection id="pourquoi" title="Porque um diário muda tudo">
        <P>
          Sem diário, fazes trading de memória. Ora a memória de um trader é enviesada: sobrevaloriza
          o último trade, esquece as perdas «sem sorte» e embeleza os ganhos «bem jogados». O diário
          repõe os factos no lugar. Responde a perguntas que não consegues decidir de outra forma:
        </P>
        <UL>
          <LI>Que setups te rendem realmente — e quais te custam?</LI>
          <LI>A que horas, em que instrumentos, és rentável ou destrutivo?</LI>
          <LI>Que erro volta uma e outra vez sob formas diferentes?</LI>
        </UL>
        <P>
          Desenvolvemos este ponto em{" "}
          <A href="/ressources/journal-de-trading/pourquoi-tenir-un-journal-de-trading">
            porquê manter um diário de trading
          </A>
          .
        </P>
      </ArticleSection>

      <ArticleSection id="quoi-noter" title="O que registar: o essencial">
        <P>
          Um diário demasiado pesado não se mantém. Aponta ao estritamente útil: o suficiente para
          calcular as tuas estatísticas <em>e</em> compreender o teu comportamento.
        </P>
        <UL>
          <LI>O factual: data/hora, instrumento, sentido, entrada, stop, objetivo, tamanho, resultado em R.</LI>
          <LI>O decisivo: o motivo de entrada (porquê este trade) e a emoção sentida.</LI>
        </UL>
        <P>
          O método completo, campo a campo, está detalhado em{" "}
          <A href="/ressources/journal-de-trading/comment-tenir-un-journal-de-trading">
            como manter um diário de trading
          </A>
          .
        </P>
      </ArticleSection>

      <ArticleSection id="methode" title="Da folha de cálculo à revisão">
        <P>
          Registar não basta — uma folha de cálculo nunca relida é uma folha morta. O valor nasce da
          revisão: uma nota curta logo após cada trade, depois uma síntese semanal onde procuras{" "}
          <em>um</em> padrão a corrigir para a semana seguinte. Uma decisão, não dez.
        </P>
        <Callout variant="note" title="O ritmo que se mantém">
          Registo imediato (30 segundos), revisão ao fim de semana (20 minutos). É a regularidade,
          não a exaustividade, que faz progredir.
        </Callout>
      </ArticleSection>

      <ArticleSection id="outil" title="Quando passar a uma ferramenta dedicada">
        <P>
          A folha de cálculo é perfeita para começar. Mostra os seus limites quando o volume sobe:
          registo fastidioso, cálculos de estatísticas para manter à mão, padrões comportamentais
          invisíveis numa grelha de números. É precisamente aí que uma ferramenta que importa os teus
          trades e calcula tudo sozinha assume o controlo.
        </P>
        <KeyTakeaway>
          Um diário só tem valor quando relido. Regista o essencial, faz a tua revisão todas as
          semanas, aponta a <strong>uma correção</strong> de cada vez. A folha de cálculo primeiro; a
          ferramenta dedicada quando o volume o justifica.
        </KeyTakeaway>
      </ArticleSection>
    </>
  ),
};

const PILLAR_BODIES_BY_LOCALE: Record<Locale, Record<string, ReactNode>> = {
  fr: PILLAR_BODIES_FR,
  en: PILLAR_BODIES_EN,
  pt: PILLAR_BODIES_PT,
};

export function getPillarBody(locale: string, slug: string): ReactNode {
  return PILLAR_BODIES_BY_LOCALE[asLocale(locale)][slug];
}

// ════════════════════════════════════════════════════════════════
// ARTICLES
// ════════════════════════════════════════════════════════════════

const ARTICLE_BODIES_FR: Record<string, (article: Article) => ReactNode> = {
  "calculer-sa-taille-de-position": (article) => (
    <>
      <Lead>
        La taille de position n'est pas une intuition, c'est un calcul. Elle se déduit de trois
        nombres que tu connais avant d'entrer : ton capital, le risque que tu acceptes, et la
        distance de ton stop. Voici la méthode, puis un exemple chiffré.
      </Lead>

      <Toc items={article.toc} />

      <ArticleSection id="principe" title="Le principe : partir du risque, pas du gain">
        <P>
          L'erreur de débutant : choisir « 1 lot » par habitude, puis placer un stop. Tu laisses
          alors le hasard décider de ta perte. La bonne logique est inverse : tu fixes d'abord{" "}
          combien tu acceptes de perdre, puis tu en déduis la taille qui respecte cette limite.
        </P>
        <P>
          Ce risque, exprime-le en pourcentage de ton capital — c'est le cœur de la{" "}
          <A href="/ressources/gestion-du-risque">gestion du risque</A>. Mettons 1 %. Sur 10 000 €,
          tu acceptes donc de perdre 100 € si le stop est touché. Ni plus, ni moins.
        </P>
      </ArticleSection>

      <ArticleSection id="formule" title="La formule de la taille de position">
        <P>La taille découle d'une division simple :</P>
        <Callout variant="key" title="La formule">
          <strong>Taille = Risque (€) ÷ (distance du stop × valeur du point)</strong>
        </Callout>
        <P>
          Le « risque en € » est ta limite (100 € dans l'exemple). La « distance du stop » est
          l'écart entre ton entrée et ton stop, mesuré en points/pips. La « valeur du point » dépend
          de l'instrument et de l'unité de position. Le résultat te donne la taille à passer.
        </P>
        {article.tool && <ToolCTA tool={article.tool} />}
      </ArticleSection>

      <ArticleSection id="exemple" title="Un exemple chiffré, étape par étape">
        <OL>
          <LI>Capital : 10 000 €. Risque choisi : 1 % → <strong>100 €</strong>.</LI>
          <LI>Entrée et stop distants de <strong>50 points</strong>.</LI>
          <LI>Valeur du point pour 1 unité de position : <strong>1 €</strong>.</LI>
          <LI>Taille = 100 ÷ (50 × 1) = <strong>2 unités</strong>.</LI>
        </OL>
        <P>
          Si tu rapproches ton stop à 25 points, la taille double (4 unités) pour un risque
          identique de 100 €. Si tu l'élargis à 100 points, elle tombe à 1 unité. Le risque, lui, ne
          bouge jamais : c'est tout l'intérêt.
        </P>
      </ArticleSection>

      <ArticleSection id="pieges" title="Les pièges classiques">
        <UL>
          <LI>
            <strong>Choisir la taille avant le stop.</strong> C'est revenir à risquer au hasard.
          </LI>
          <LI>
            <strong>Élargir le stop pour « garder » une grosse taille.</strong> Tu casses ta propre
            règle de risque.
          </LI>
          <LI>
            <strong>Confondre taille et levier.</strong> Le levier autorise une grosse position ; il
            ne dit rien de ce que tu risques. Seul le stop le dit.
          </LI>
          <LI>
            <strong>Oublier la valeur du point</strong> qui change d'un instrument à l'autre — d'où
            l'intérêt d'un calculateur.
          </LI>
        </UL>
        {article.leadMagnet && <LeadMagnetCTA magnet={article.leadMagnet} />}
        <KeyTakeaway>
          Fixe ton risque, place ton stop selon le marché, <strong>déduis</strong> la taille. La
          position s'ajuste à ta limite de perte — jamais l'inverse.
        </KeyTakeaway>
      </ArticleSection>
    </>
  ),

  "ratio-risque-rendement": (article) => (
    <>
      <Lead>
        Le ratio risque/rendement compare ce que tu risques à ce que tu vises. C'est un repère utile
        — mais lu seul, il ne dit rien de ta rentabilité. Voici comment le calculer, et pourquoi il
        ne vaut qu'associé à ton taux de réussite.
      </Lead>

      <Toc items={article.toc} />

      <ArticleSection id="definition" title="Définition du ratio risque/rendement">
        <P>
          Le ratio risque/rendement (ou <em>risk reward</em>, RR) exprime combien tu vises gagner
          pour chaque unité risquée. Un ratio de 2:1 signifie que tu vises deux fois ta perte
          potentielle : tu risques 50 € pour viser 100 €.
        </P>
      </ArticleSection>

      <ArticleSection id="calcul" title="Comment le calculer">
        <Callout variant="key" title="La formule">
          <strong>RR = (objectif − entrée) ÷ (entrée − stop)</strong> &nbsp;(pour un achat)
        </Callout>
        <P>
          Tu entres à 100, stop à 95, objectif à 110 : tu risques 5 pour viser 10, soit un ratio de
          2:1. Le calcul se fait toujours <em>avant</em> d'entrer — c'est un critère de sélection du
          trade, pas une justification après coup.
        </P>
        {article.tool && <ToolCTA tool={article.tool} />}
      </ArticleSection>

      <ArticleSection id="winrate" title="Le ratio ne suffit pas : le couple avec le win rate">
        <P>
          Un ratio élevé n'est pas synonyme de rentabilité. Ce qui compte, c'est ton{" "}
          taux de réussite minimal pour être à l'équilibre, qui dépend directement du ratio :
        </P>
        <UL>
          <LI>Ratio <strong>1:1</strong> → il te faut gagner plus de <strong>50 %</strong> du temps.</LI>
          <LI>Ratio <strong>2:1</strong> → seuil d'équilibre à <strong>33 %</strong>.</LI>
          <LI>Ratio <strong>3:1</strong> → seuil d'équilibre à <strong>25 %</strong>.</LI>
        </UL>
        <P>
          Viser plus loin (ratio élevé) fait généralement <em>baisser</em> ton taux de réussite : tu
          touches ton objectif moins souvent. L'objectif n'est donc pas un ratio impressionnant,
          mais une <strong>espérance de gain positive</strong> — le produit des deux.
        </P>
      </ArticleSection>

      <ArticleSection id="usage" title="Bien l'utiliser dans son plan">
        <P>
          Fixe un ratio minimal acceptable dans ton plan (par exemple : pas de trade sous 1,5:1), et
          tiens-le. Surtout, ne déplace pas ton objectif ou ton stop en cours de route pour
          « améliorer » le ratio affiché : tu mentirais à tes propres statistiques.
        </P>
        <KeyTakeaway>
          Le ratio risque/rendement est un filtre, pas une garantie. Il ne se lit jamais sans ton
          taux de réussite. Mesure les deux dans ton{" "}
          <A href="/ressources/journal-de-trading">journal de trading</A> pour piloter ta vraie
          espérance.
        </KeyTakeaway>
      </ArticleSection>
    </>
  ),

  "pourquoi-tenir-un-journal-de-trading": (article) => (
    <>
      <Lead>
        Sans journal, tu trades à l'aveugle : tu accumules des trades sans jamais voir ce qu'ils
        disent de toi. Un journal de trading n'est pas de la paperasse — c'est ce qui sépare le
        trader qui progresse de celui qui répète les mêmes erreurs pendant des années.
      </Lead>

      <Toc items={article.toc} />

      <ArticleSection id="aveugle" title="Trader sans journal, c'est trader à l'aveugle">
        <P>
          Tu peux exécuter cent trades et n'en tirer aucune leçon si tu ne les enregistres pas.
          L'expérience seule ne suffit pas : sans trace écrite, chaque trade s'efface, et tu
          recommences à zéro à chaque session. Le journal donne une mémoire à ta pratique.
        </P>
      </ArticleSection>

      <ArticleSection id="revele" title="Ce qu'un journal révèle vraiment">
        <P>Au bout de quelques dizaines de trades, des évidences apparaissent :</P>
        <UL>
          <LI>Le setup que tu crois bon mais qui, chiffres en main, te coûte de l'argent.</LI>
          <LI>L'heure de la journée où tu prends tes pires décisions.</LI>
          <LI>L'instrument sur lequel tu surperformes — et celui que tu devrais éviter.</LI>
          <LI>L'erreur récurrente déguisée : entrer trop tôt, sortir trop vite, déplacer son stop.</LI>
        </UL>
      </ArticleSection>

      <ArticleSection id="memoire" title="La mémoire ment, les données non">
        <P>
          Le cerveau d'un trader est un mauvais témoin : il retient le dernier trade plus que les
          cent précédents (biais de récence) et cherche ce qui confirme ce qu'il croit déjà (biais
          de confirmation). Le journal neutralise ces biais en opposant des faits à tes impressions.
          C'est inconfortable — et c'est exactement pour ça que c'est utile.
        </P>
        {article.leadMagnet && <LeadMagnetCTA magnet={article.leadMagnet} />}
      </ArticleSection>

      <ArticleSection id="commencer" title="Par où commencer">
        <P>
          Commence simple, quitte à enrichir ensuite. L'important n'est pas l'outil parfait mais la
          régularité. Vise une trentaine de trades : c'est le seuil à partir duquel les tendances
          deviennent lisibles. La méthode pas à pas est détaillée dans{" "}
          <A href="/ressources/journal-de-trading/comment-tenir-un-journal-de-trading">
            comment tenir un journal de trading
          </A>
          .
        </P>
        <KeyTakeaway>
          Un journal transforme des trades dispersés en quelques leçons claires. Il ne te dira pas
          quoi acheter — il te dira <strong>qui tu es</strong> face au marché. C'est plus précieux.
        </KeyTakeaway>
      </ArticleSection>
    </>
  ),

  "comment-tenir-un-journal-de-trading": (article) => (
    <>
      <Lead>
        Tenir un journal qui sert vraiment tient en trois choses : noter les bons champs, le faire à
        un rythme tenable, et surtout le relire pour en tirer des décisions. Voici la méthode
        complète, du champ à remplir jusqu'à la revue hebdomadaire.
      </Lead>

      <Toc items={article.toc} />

      <ArticleSection id="champs" title="Les champs à noter (et ceux à oublier)">
        <P>
          Un journal surchargé ne se tient pas une semaine. Garde deux familles de champs : le
          factuel, pour les statistiques, et le qualitatif, pour le comportement.
        </P>
        <UL>
          <LI><strong>Factuel :</strong> date/heure, instrument, sens, entrée, stop, objectif, taille, résultat exprimé en R.</LI>
          <LI><strong>Qualitatif :</strong> le motif d'entrée (la raison réelle du trade) et l'émotion ressentie au moment d'agir.</LI>
        </UL>
        <P>
          Le reste — captures à outrance, dix colonnes d'indicateurs — est du bruit qui décourage la
          tenue. Raisonner en <A href="/ressources/gestion-du-risque">R plutôt qu'en euros</A> rend
          tes trades comparables entre eux.
        </P>
      </ArticleSection>

      <ArticleSection id="rituel" title="Le rituel : quand et comment journaliser">
        <P>
          Deux moments, deux durées. Une note <strong>immédiate</strong> juste après le trade, tant
          que la décision est fraîche (30 secondes). Puis une <strong>synthèse hebdomadaire</strong>,
          au calme, où tu regardes l'ensemble plutôt que chaque trade isolé.
        </P>
        {article.tool && <ToolCTA tool={article.tool} />}
      </ArticleSection>

      <ArticleSection id="revue" title="La revue : transformer les notes en décisions">
        <P>
          C'est l'étape que tout le monde saute, et c'est la seule qui fait progresser. Chaque
          semaine, cherche <strong>un</strong> pattern : l'erreur la plus coûteuse, le setup le plus
          fiable. Formule une seule règle pour la semaine suivante, et vérifie-la à la revue d'après.
          Une correction à la fois.
        </P>
        <Callout variant="note" title="Le test de la bonne revue">
          Si ta revue ne se termine pas par une décision concrète pour la semaine qui vient, elle
          n'a servi à rien. Note la décision, pas seulement le constat.
        </Callout>
      </ArticleSection>

      <ArticleSection id="outils" title="Tableur, Notion ou application dédiée">
        <P>
          Un tableur ou un template Notion suffisent largement pour démarrer et comprendre la
          mécanique. Tu passeras à un outil dédié quand la saisie deviendra une corvée et que tu
          voudras des statistiques et des patterns calculés sans effort — typiquement quand le
          volume de trades augmente.
        </P>
        {article.leadMagnet && <LeadMagnetCTA magnet={article.leadMagnet} />}
        <KeyTakeaway>
          Note l'essentiel, immédiatement. Fais ta revue chaque semaine et vise{" "}
          <strong>une décision</strong>. Commence au tableur ; passe à un outil dédié quand le volume
          le justifie.
        </KeyTakeaway>
      </ArticleSection>
    </>
  ),
};

const ARTICLE_BODIES_EN: Record<string, (article: Article) => ReactNode> = {
  "calculer-sa-taille-de-position": (article) => (
    <>
      <Lead>
        Position size isn't an intuition, it's a calculation. It's derived from three numbers you
        know before entering: your capital, the risk you accept, and your stop distance. Here's the
        method, then a worked example.
      </Lead>

      <Toc items={article.toc} />

      <ArticleSection id="principe" title="The principle: start from risk, not reward">
        <P>
          The beginner's mistake: pick “1 lot” out of habit, then place a stop. You then let chance
          decide your loss. The right logic is the reverse: you first set how much you accept to
          lose, then derive the size that respects that limit.
        </P>
        <P>
          Express that risk as a percentage of your capital — it's the heart of{" "}
          <A href="/ressources/gestion-du-risque">risk management</A>. Say 1%. On €10,000, you
          therefore accept to lose €100 if the stop is hit. No more, no less.
        </P>
      </ArticleSection>

      <ArticleSection id="formule" title="The position size formula">
        <P>The size follows from a simple division:</P>
        <Callout variant="key" title="The formula">
          <strong>Size = Risk (€) ÷ (stop distance × point value)</strong>
        </Callout>
        <P>
          The “risk in €” is your limit (€100 in the example). The “stop distance” is the gap between
          your entry and your stop, measured in points/pips. The “point value” depends on the
          instrument and the position unit. The result gives you the size to trade.
        </P>
        {article.tool && <ToolCTA tool={article.tool} />}
      </ArticleSection>

      <ArticleSection id="exemple" title="A worked example, step by step">
        <OL>
          <LI>Capital: €10,000. Chosen risk: 1% → <strong>€100</strong>.</LI>
          <LI>Entry and stop <strong>50 points</strong> apart.</LI>
          <LI>Point value for 1 position unit: <strong>€1</strong>.</LI>
          <LI>Size = 100 ÷ (50 × 1) = <strong>2 units</strong>.</LI>
        </OL>
        <P>
          If you move your stop closer to 25 points, the size doubles (4 units) for an identical risk
          of €100. If you widen it to 100 points, it drops to 1 unit. The risk itself never moves:
          that's the whole point.
        </P>
      </ArticleSection>

      <ArticleSection id="pieges" title="Classic pitfalls">
        <UL>
          <LI>
            <strong>Choosing the size before the stop.</strong> That's back to risking at random.
          </LI>
          <LI>
            <strong>Widening the stop to “keep” a big size.</strong> You break your own risk rule.
          </LI>
          <LI>
            <strong>Confusing size and leverage.</strong> Leverage allows a big position; it says
            nothing about what you risk. Only the stop says that.
          </LI>
          <LI>
            <strong>Forgetting the point value</strong> that changes from one instrument to another —
            hence the value of a calculator.
          </LI>
        </UL>
        {article.leadMagnet && <LeadMagnetCTA magnet={article.leadMagnet} />}
        <KeyTakeaway>
          Set your risk, place your stop according to the market, <strong>derive</strong> the size.
          The position adjusts to your loss limit — never the reverse.
        </KeyTakeaway>
      </ArticleSection>
    </>
  ),

  "ratio-risque-rendement": (article) => (
    <>
      <Lead>
        The risk/reward ratio compares what you risk to what you aim for. It's a useful marker — but
        read alone, it says nothing about your profitability. Here's how to calculate it, and why it
        only matters paired with your win rate.
      </Lead>

      <Toc items={article.toc} />

      <ArticleSection id="definition" title="Definition of the risk/reward ratio">
        <P>
          The risk/reward ratio (or <em>risk reward</em>, RR) expresses how much you aim to gain for
          each unit risked. A 2:1 ratio means you aim for twice your potential loss: you risk €50 to
          aim for €100.
        </P>
      </ArticleSection>

      <ArticleSection id="calcul" title="How to calculate it">
        <Callout variant="key" title="The formula">
          <strong>RR = (target − entry) ÷ (entry − stop)</strong> &nbsp;(for a buy)
        </Callout>
        <P>
          You enter at 100, stop at 95, target at 110: you risk 5 to aim for 10, i.e. a 2:1 ratio.
          The calculation is always done <em>before</em> entering — it's a trade-selection criterion,
          not an after-the-fact justification.
        </P>
        {article.tool && <ToolCTA tool={article.tool} />}
      </ArticleSection>

      <ArticleSection id="winrate" title="The ratio isn't enough: the pairing with win rate">
        <P>
          A high ratio isn't synonymous with profitability. What matters is your{" "}
          minimum win rate to break even, which depends directly on the ratio:
        </P>
        <UL>
          <LI>Ratio <strong>1:1</strong> → you need to win more than <strong>50%</strong> of the time.</LI>
          <LI>Ratio <strong>2:1</strong> → break-even threshold at <strong>33%</strong>.</LI>
          <LI>Ratio <strong>3:1</strong> → break-even threshold at <strong>25%</strong>.</LI>
        </UL>
        <P>
          Aiming further (high ratio) generally <em>lowers</em> your win rate: you hit your target
          less often. The goal isn't an impressive ratio, then, but a{" "}
          <strong>positive expectancy</strong> — the product of the two.
        </P>
      </ArticleSection>

      <ArticleSection id="usage" title="Using it well in your plan">
        <P>
          Set a minimum acceptable ratio in your plan (for example: no trade below 1.5:1), and stick
          to it. Above all, don't move your target or your stop mid-way to “improve” the displayed
          ratio: you'd be lying to your own statistics.
        </P>
        <KeyTakeaway>
          The risk/reward ratio is a filter, not a guarantee. It's never read without your win rate.
          Measure both in your{" "}
          <A href="/ressources/journal-de-trading">trading journal</A> to steer your real expectancy.
        </KeyTakeaway>
      </ArticleSection>
    </>
  ),

  "pourquoi-tenir-un-journal-de-trading": (article) => (
    <>
      <Lead>
        Without a journal, you trade blind: you pile up trades without ever seeing what they say
        about you. A trading journal isn't paperwork — it's what separates the trader who progresses
        from the one who repeats the same mistakes for years.
      </Lead>

      <Toc items={article.toc} />

      <ArticleSection id="aveugle" title="Trading without a journal is trading blind">
        <P>
          You can execute a hundred trades and draw no lesson from them if you don't record them.
          Experience alone isn't enough: without a written trace, each trade fades, and you start
          from scratch every session. The journal gives your practice a memory.
        </P>
      </ArticleSection>

      <ArticleSection id="revele" title="What a journal really reveals">
        <P>After a few dozen trades, some truths become obvious:</P>
        <UL>
          <LI>The setup you think is good but which, numbers in hand, costs you money.</LI>
          <LI>The time of day when you make your worst decisions.</LI>
          <LI>The instrument you outperform on — and the one you should avoid.</LI>
          <LI>The recurring mistake in disguise: entering too early, exiting too fast, moving your stop.</LI>
        </UL>
      </ArticleSection>

      <ArticleSection id="memoire" title="Memory lies, data doesn't">
        <P>
          A trader's brain is a poor witness: it retains the last trade more than the hundred before
          it (recency bias) and looks for what confirms what it already believes (confirmation bias).
          The journal neutralises these biases by setting facts against your impressions. It's
          uncomfortable — and that's exactly why it's useful.
        </P>
        {article.leadMagnet && <LeadMagnetCTA magnet={article.leadMagnet} />}
      </ArticleSection>

      <ArticleSection id="commencer" title="Where to start">
        <P>
          Start simple, enrich it later. What matters isn't the perfect tool but regularity. Aim for
          about thirty trades: that's the threshold from which trends become readable. The
          step-by-step method is detailed in{" "}
          <A href="/ressources/journal-de-trading/comment-tenir-un-journal-de-trading">
            how to keep a trading journal
          </A>
          .
        </P>
        <KeyTakeaway>
          A journal turns scattered trades into a few clear lessons. It won't tell you what to buy —
          it'll tell you <strong>who you are</strong> in front of the market. That's more valuable.
        </KeyTakeaway>
      </ArticleSection>
    </>
  ),

  "comment-tenir-un-journal-de-trading": (article) => (
    <>
      <Lead>
        Keeping a journal that truly helps comes down to three things: recording the right fields,
        doing it at a sustainable rhythm, and above all rereading it to draw decisions. Here's the
        complete method, from the field to fill in to the weekly review.
      </Lead>

      <Toc items={article.toc} />

      <ArticleSection id="champs" title="The fields to record (and the ones to forget)">
        <P>
          An overloaded journal doesn't last a week. Keep two families of fields: the factual, for
          statistics, and the qualitative, for behaviour.
        </P>
        <UL>
          <LI><strong>Factual:</strong> date/time, instrument, direction, entry, stop, target, size, result expressed in R.</LI>
          <LI><strong>Qualitative:</strong> the entry reason (the real reason for the trade) and the emotion felt at the moment of acting.</LI>
        </UL>
        <P>
          The rest — endless screenshots, ten columns of indicators — is noise that discourages
          keeping it. Thinking in <A href="/ressources/gestion-du-risque">R rather than euros</A>{" "}
          makes your trades comparable with one another.
        </P>
      </ArticleSection>

      <ArticleSection id="rituel" title="The ritual: when and how to journal">
        <P>
          Two moments, two durations. An <strong>immediate</strong> note right after the trade, while
          the decision is fresh (30 seconds). Then a <strong>weekly summary</strong>, calmly, where
          you look at the whole rather than each isolated trade.
        </P>
        {article.tool && <ToolCTA tool={article.tool} />}
      </ArticleSection>

      <ArticleSection id="revue" title="The review: turning notes into decisions">
        <P>
          It's the step everyone skips, and it's the only one that drives progress. Every week, look
          for <strong>one</strong> pattern: the costliest mistake, the most reliable setup. Formulate
          a single rule for the following week, and check it at the next review. One correction at a
          time.
        </P>
        <Callout variant="note" title="The test of a good review">
          If your review doesn't end with a concrete decision for the coming week, it served no
          purpose. Note the decision, not just the observation.
        </Callout>
      </ArticleSection>

      <ArticleSection id="outils" title="Spreadsheet, Notion or a dedicated app">
        <P>
          A spreadsheet or a Notion template are plenty to start and understand the mechanics. You'll
          move to a dedicated tool when data entry becomes a chore and you want statistics and
          patterns computed effortlessly — typically when trade volume rises.
        </P>
        {article.leadMagnet && <LeadMagnetCTA magnet={article.leadMagnet} />}
        <KeyTakeaway>
          Record the essentials, immediately. Do your review every week and aim for{" "}
          <strong>one decision</strong>. Start with the spreadsheet; move to a dedicated tool when
          volume justifies it.
        </KeyTakeaway>
      </ArticleSection>
    </>
  ),
};

const ARTICLE_BODIES_PT: Record<string, (article: Article) => ReactNode> = {
  "calculer-sa-taille-de-position": (article) => (
    <>
      <Lead>
        O tamanho de posição não é uma intuição, é um cálculo. Deduz-se de três números que conheces
        antes de entrar: o teu capital, o risco que aceitas, e a distância do teu stop. Eis o método,
        depois um exemplo com números.
      </Lead>

      <Toc items={article.toc} />

      <ArticleSection id="principe" title="O princípio: partir do risco, não do ganho">
        <P>
          O erro de principiante: escolher «1 lote» por hábito, depois colocar um stop. Deixas então
          o acaso decidir a tua perda. A lógica certa é a inversa: fixas primeiro quanto aceitas
          perder, depois deduzes o tamanho que respeita esse limite.
        </P>
        <P>
          Esse risco, exprime-o em percentagem do teu capital — é o coração da{" "}
          <A href="/ressources/gestion-du-risque">gestão de risco</A>. Digamos 1%. Em 10 000 €,
          aceitas portanto perder 100 € se o stop for atingido. Nem mais, nem menos.
        </P>
      </ArticleSection>

      <ArticleSection id="formule" title="A fórmula do tamanho de posição">
        <P>O tamanho resulta de uma divisão simples:</P>
        <Callout variant="key" title="A fórmula">
          <strong>Tamanho = Risco (€) ÷ (distância do stop × valor do ponto)</strong>
        </Callout>
        <P>
          O «risco em €» é o teu limite (100 € no exemplo). A «distância do stop» é o intervalo entre
          a tua entrada e o teu stop, medido em pontos/pips. O «valor do ponto» depende do
          instrumento e da unidade de posição. O resultado dá-te o tamanho a executar.
        </P>
        {article.tool && <ToolCTA tool={article.tool} />}
      </ArticleSection>

      <ArticleSection id="exemple" title="Um exemplo com números, passo a passo">
        <OL>
          <LI>Capital: 10 000 €. Risco escolhido: 1% → <strong>100 €</strong>.</LI>
          <LI>Entrada e stop distantes <strong>50 pontos</strong>.</LI>
          <LI>Valor do ponto para 1 unidade de posição: <strong>1 €</strong>.</LI>
          <LI>Tamanho = 100 ÷ (50 × 1) = <strong>2 unidades</strong>.</LI>
        </OL>
        <P>
          Se aproximares o teu stop a 25 pontos, o tamanho duplica (4 unidades) para um risco idêntico
          de 100 €. Se o alargares a 100 pontos, cai para 1 unidade. O risco, esse, nunca se mexe: é
          todo o interesse.
        </P>
      </ArticleSection>

      <ArticleSection id="pieges" title="As armadilhas clássicas">
        <UL>
          <LI>
            <strong>Escolher o tamanho antes do stop.</strong> É voltar a arriscar ao acaso.
          </LI>
          <LI>
            <strong>Alargar o stop para «manter» um tamanho grande.</strong> Quebras a tua própria
            regra de risco.
          </LI>
          <LI>
            <strong>Confundir tamanho e alavancagem.</strong> A alavancagem autoriza uma posição
            grande; não diz nada sobre o que arriscas. Só o stop o diz.
          </LI>
          <LI>
            <strong>Esquecer o valor do ponto</strong> que muda de um instrumento para outro — daí o
            interesse de uma calculadora.
          </LI>
        </UL>
        {article.leadMagnet && <LeadMagnetCTA magnet={article.leadMagnet} />}
        <KeyTakeaway>
          Fixa o teu risco, coloca o teu stop conforme o mercado, <strong>deduz</strong> o tamanho. A
          posição ajusta-se ao teu limite de perda — nunca ao contrário.
        </KeyTakeaway>
      </ArticleSection>
    </>
  ),

  "ratio-risque-rendement": (article) => (
    <>
      <Lead>
        O rácio risco/retorno compara o que arriscas com o que visas. É um marco útil — mas lido
        sozinho, não diz nada sobre a tua rentabilidade. Eis como o calcular, e porque só vale
        associado à tua taxa de acerto.
      </Lead>

      <Toc items={article.toc} />

      <ArticleSection id="definition" title="Definição do rácio risco/retorno">
        <P>
          O rácio risco/retorno (ou <em>risk reward</em>, RR) exprime quanto visas ganhar por cada
          unidade arriscada. Um rácio de 2:1 significa que visas o dobro da tua perda potencial:
          arriscas 50 € para visar 100 €.
        </P>
      </ArticleSection>

      <ArticleSection id="calcul" title="Como o calcular">
        <Callout variant="key" title="A fórmula">
          <strong>RR = (objetivo − entrada) ÷ (entrada − stop)</strong> &nbsp;(para uma compra)
        </Callout>
        <P>
          Entras a 100, stop a 95, objetivo a 110: arriscas 5 para visar 10, ou seja um rácio de 2:1.
          O cálculo faz-se sempre <em>antes</em> de entrar — é um critério de seleção do trade, não
          uma justificação a posteriori.
        </P>
        {article.tool && <ToolCTA tool={article.tool} />}
      </ArticleSection>

      <ArticleSection id="winrate" title="O rácio não basta: o par com a taxa de acerto">
        <P>
          Um rácio elevado não é sinónimo de rentabilidade. O que conta é a tua{" "}
          taxa de acerto mínima para estar em equilíbrio, que depende diretamente do rácio:
        </P>
        <UL>
          <LI>Rácio <strong>1:1</strong> → tens de ganhar mais de <strong>50%</strong> das vezes.</LI>
          <LI>Rácio <strong>2:1</strong> → limiar de equilíbrio a <strong>33%</strong>.</LI>
          <LI>Rácio <strong>3:1</strong> → limiar de equilíbrio a <strong>25%</strong>.</LI>
        </UL>
        <P>
          Visar mais longe (rácio elevado) faz geralmente <em>baixar</em> a tua taxa de acerto: atinges
          o teu objetivo menos vezes. O objetivo não é, portanto, um rácio impressionante, mas uma{" "}
          <strong>esperança de ganho positiva</strong> — o produto dos dois.
        </P>
      </ArticleSection>

      <ArticleSection id="usage" title="Usá-lo bem no teu plano">
        <P>
          Fixa um rácio mínimo aceitável no teu plano (por exemplo: nenhum trade abaixo de 1,5:1), e
          mantém-no. Sobretudo, não desloques o teu objetivo ou o teu stop a meio para «melhorar» o
          rácio exibido: estarias a mentir às tuas próprias estatísticas.
        </P>
        <KeyTakeaway>
          O rácio risco/retorno é um filtro, não uma garantia. Nunca se lê sem a tua taxa de acerto.
          Mede os dois no teu{" "}
          <A href="/ressources/journal-de-trading">diário de trading</A> para pilotar a tua verdadeira
          esperança.
        </KeyTakeaway>
      </ArticleSection>
    </>
  ),

  "pourquoi-tenir-un-journal-de-trading": (article) => (
    <>
      <Lead>
        Sem diário, fazes trading às cegas: acumulas trades sem nunca ver o que dizem de ti. Um diário
        de trading não é papelada — é o que separa o trader que progride daquele que repete os mesmos
        erros durante anos.
      </Lead>

      <Toc items={article.toc} />

      <ArticleSection id="aveugle" title="Fazer trading sem diário é fazer trading às cegas">
        <P>
          Podes executar cem trades e não tirar deles nenhuma lição se não os registares. A
          experiência sozinha não basta: sem registo escrito, cada trade apaga-se, e recomeças do zero
          em cada sessão. O diário dá uma memória à tua prática.
        </P>
      </ArticleSection>

      <ArticleSection id="revele" title="O que um diário revela de verdade">
        <P>Ao fim de algumas dezenas de trades, surgem evidências:</P>
        <UL>
          <LI>O setup que julgas bom mas que, números na mão, te custa dinheiro.</LI>
          <LI>A hora do dia em que tomas as tuas piores decisões.</LI>
          <LI>O instrumento em que tens desempenho superior — e o que devias evitar.</LI>
          <LI>O erro recorrente disfarçado: entrar cedo demais, sair depressa demais, deslocar o stop.</LI>
        </UL>
      </ArticleSection>

      <ArticleSection id="memoire" title="A memória mente, os dados não">
        <P>
          O cérebro de um trader é uma má testemunha: retém o último trade mais do que os cem
          anteriores (enviesamento de recência) e procura o que confirma o que já acredita
          (enviesamento de confirmação). O diário neutraliza estes enviesamentos opondo factos às tuas
          impressões. É desconfortável — e é exatamente por isso que é útil.
        </P>
        {article.leadMagnet && <LeadMagnetCTA magnet={article.leadMagnet} />}
      </ArticleSection>

      <ArticleSection id="commencer" title="Por onde começar">
        <P>
          Começa simples, podes enriquecer depois. O importante não é a ferramenta perfeita mas a
          regularidade. Aponta a cerca de trinta trades: é o limiar a partir do qual as tendências se
          tornam legíveis. O método passo a passo está detalhado em{" "}
          <A href="/ressources/journal-de-trading/comment-tenir-un-journal-de-trading">
            como manter um diário de trading
          </A>
          .
        </P>
        <KeyTakeaway>
          Um diário transforma trades dispersos em algumas lições claras. Não te dirá o que comprar —
          dir-te-á <strong>quem és</strong> perante o mercado. Isso é mais precioso.
        </KeyTakeaway>
      </ArticleSection>
    </>
  ),

  "comment-tenir-un-journal-de-trading": (article) => (
    <>
      <Lead>
        Manter um diário que serve mesmo resume-se a três coisas: registar os campos certos, fazê-lo a
        um ritmo sustentável, e sobretudo relê-lo para dele tirar decisões. Eis o método completo, do
        campo a preencher até à revisão semanal.
      </Lead>

      <Toc items={article.toc} />

      <ArticleSection id="champs" title="Os campos a registar (e os a esquecer)">
        <P>
          Um diário sobrecarregado não se mantém uma semana. Guarda duas famílias de campos: o
          factual, para as estatísticas, e o qualitativo, para o comportamento.
        </P>
        <UL>
          <LI><strong>Factual:</strong> data/hora, instrumento, sentido, entrada, stop, objetivo, tamanho, resultado expresso em R.</LI>
          <LI><strong>Qualitativo:</strong> o motivo de entrada (a razão real do trade) e a emoção sentida no momento de agir.</LI>
        </UL>
        <P>
          O resto — capturas em excesso, dez colunas de indicadores — é ruído que desmotiva a
          manutenção. Raciocinar em <A href="/ressources/gestion-du-risque">R em vez de euros</A> torna
          os teus trades comparáveis entre si.
        </P>
      </ArticleSection>

      <ArticleSection id="rituel" title="O ritual: quando e como registar">
        <P>
          Dois momentos, duas durações. Uma nota <strong>imediata</strong> logo após o trade, enquanto
          a decisão está fresca (30 segundos). Depois uma <strong>síntese semanal</strong>, com calma,
          onde olhas para o conjunto em vez de cada trade isolado.
        </P>
        {article.tool && <ToolCTA tool={article.tool} />}
      </ArticleSection>

      <ArticleSection id="revue" title="A revisão: transformar notas em decisões">
        <P>
          É a etapa que toda a gente salta, e é a única que faz progredir. Todas as semanas, procura{" "}
          <strong>um</strong> padrão: o erro mais caro, o setup mais fiável. Formula uma única regra
          para a semana seguinte, e verifica-a na revisão a seguir. Uma correção de cada vez.
        </P>
        <Callout variant="note" title="O teste da boa revisão">
          Se a tua revisão não terminar com uma decisão concreta para a semana que vem, não serviu de
          nada. Anota a decisão, não apenas a constatação.
        </Callout>
      </ArticleSection>

      <ArticleSection id="outils" title="Folha de cálculo, Notion ou aplicação dedicada">
        <P>
          Uma folha de cálculo ou um template Notion bastam largamente para começar e compreender a
          mecânica. Passarás a uma ferramenta dedicada quando o registo se tornar uma tarefa pesada e
          quiseres estatísticas e padrões calculados sem esforço — tipicamente quando o volume de
          trades aumenta.
        </P>
        {article.leadMagnet && <LeadMagnetCTA magnet={article.leadMagnet} />}
        <KeyTakeaway>
          Regista o essencial, imediatamente. Faz a tua revisão todas as semanas e aponta a{" "}
          <strong>uma decisão</strong>. Começa na folha de cálculo; passa a uma ferramenta dedicada
          quando o volume o justifica.
        </KeyTakeaway>
      </ArticleSection>
    </>
  ),
};

const ARTICLE_BODIES_BY_LOCALE: Record<Locale, Record<string, (article: Article) => ReactNode>> = {
  fr: ARTICLE_BODIES_FR,
  en: ARTICLE_BODIES_EN,
  pt: ARTICLE_BODIES_PT,
};

export function getArticleBody(
  locale: string,
  slug: string,
): ((article: Article) => ReactNode) | undefined {
  return ARTICLE_BODIES_BY_LOCALE[asLocale(locale)][slug];
}
