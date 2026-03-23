import {
  handleAICardIntent,
  type TargetResolver,
} from "@/modules/battle/helpers/ai.actions.helpers";
import type { EffectResolverParams } from "@/modules/battle/helpers/effects/effect.resolvers";
import { getSimulationState } from "@/modules/battle/helpers/simulation.helper";
import type { StoreGet, StoreSet } from "@/modules/battle/store/battle.store";
import { acidFlask } from "@/modules/figures/data/summons/acidFlask";
import type { AIBattleUnit } from "@/modules/figures/domain/figures.type";
import { isSummonId } from "@/modules/figures/helpers/figures.helpers";
import { cardId } from "../../helpers/cards.helper";
import { goblinCards } from "../monsters/goblinCards.data";

export const getStateScore = (fakeGet: StoreGet, realGet: StoreGet): number => {
  const { heroes: oldHeroes, monsters: oldMonsters } = realGet();
  const { heroes: newHeroes, monsters: newMonsters } = fakeGet();

  let score = 0;

  // 1. Reward damaging heroes
  for (const oldHero of oldHeroes) {
    const newHero = newHeroes.find((h) => h.id === oldHero.id);
    if (newHero) {
      const hpDiff = oldHero.currentHp - Math.max(0, newHero.currentHp);
      score += hpDiff * 10;
    }
  }

  // 2. Penalize friendly fire (hitting his own goblins because of LoS)
  for (const oldMonster of oldMonsters) {
    const newMonster = newMonsters.find((m) => m.id === oldMonster.id);
    if (newMonster) {
      const hpDiff = oldMonster.currentHp - Math.max(0, newMonster.currentHp);
      score -= hpDiff * 15;
    }
  }

  return score;
};

export const volatileTransmutation =
  <C extends AIBattleUnit>(
    get: StoreGet,
    set: StoreSet,
    isSimulation = false,
  ) =>
    async ({ caster }: EffectResolverParams<C>) => {
      const { summons, heroes } = get();
      const volatileBoltCard = goblinCards[cardId("volatile_bolt")];

      const availableFlasks = summons.filter(
        (s) => s.name === acidFlask.name && s.currentHp > 0,
      );

      if (availableFlasks.length > 0) {
        // --- SHADOW STATE: SCORING THE FLASKS ---
        const bestTarget = (
          await Promise.all(
            [...availableFlasks, ...heroes].map(async (target) => {
              const { fakeGet, fakeSet } = getSimulationState(get);
              const shadowTarget: TargetResolver = () => ({
                reachableTarget: target,
                moveDest: caster.gridPosition,
                canHit: true,
              });
              await handleAICardIntent(
                fakeGet,
                fakeSet,
                true,
              )({
                attackerId: caster.id,
                card: volatileBoltCard,
                getTarget: shadowTarget,
              });
              const bonusScore = isSummonId(target.id) ? 20 : 0;
              const score = getStateScore(fakeGet, get) + bonusScore;
              return {
                target,
                score,
              };
            }),
          )
        ).sort(({ score: scoreA }, { score: scoreB }) => scoreB - scoreA)[0]
          .target;

        // --- EXECUTION VIA ADAPTER ---
        const targetFlask: TargetResolver = () => ({
          reachableTarget: bestTarget,
          moveDest: caster.gridPosition,
          canHit: true,
        });

        await handleAICardIntent(
          get,
          set,
          isSimulation,
        )({
          attackerId: caster.id,
          card: volatileBoltCard,
          getTarget: targetFlask,
        });
      } else {
        await handleAICardIntent(
          get,
          set,
          isSimulation,
        )({ attackerId: caster.id, card: volatileBoltCard });
      }
    };
