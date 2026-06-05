// Contenu long-form de l'Académie Meridian — registre par slug.
// PILLAR_BODIES : guides piliers. ARTICLE_BODIES : articles (reçoivent l'objet
// Article pour câbler Toc / ToolCTA / LeadMagnetCTA depuis la donnée unique).
// Voix Meridian : sobre, tutoiement, zéro promesse de gain (périmètre AMF).

import type { ReactNode } from "react";
import type { Article } from "@/lib/resources";
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

// ————————————————————————————————————————————————————————————————
// PILIERS
// ————————————————————————————————————————————————————————————————

export const PILLAR_BODIES: Record<string, ReactNode> = {
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

// ————————————————————————————————————————————————————————————————
// ARTICLES
// ————————————————————————————————————————————————————————————————

export const ARTICLE_BODIES: Record<string, (article: Article) => ReactNode> = {
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
