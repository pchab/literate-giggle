import type { PushEffect } from "@/modules/cards/domain/cards.type";
import type { BattleUnit } from "@/modules/figures/domain/figures.type";
import type { StoreGet, StoreSet } from "../../store/battle.store";
import { isTileInBounds } from "../grid.helpers";
import { updateBattleUnitState } from "../state.helpers";
import { applyDamageToEntity, resolveTargets } from "./effect.helpers";
import type { EffectResolverParams } from "./effect.resolvers";
import { moveBattleUnit } from "../move.helpers";

export const resolvePushEffect =
    (get: StoreGet, set: StoreSet) =>
    (effect: PushEffect) =>
    async <C extends BattleUnit>({
        anchorTarget,
        caster,
        patternCells,
    }: EffectResolverParams<C>) => {
        const { heroes, monsters, summons } = get();
        const draftFigures = [...heroes, ...monsters, ...summons];
        const targets = resolveTargets<BattleUnit>(
            effect.target,
            anchorTarget,
            caster,
            draftFigures,
            patternCells,
        );
        const { col: cX, row: cY } = caster.gridPosition;

        const anchorPos = anchorTarget && typeof anchorTarget === 'object' && 'col' in anchorTarget 
            ? anchorTarget 
            : caster.gridPosition;
            
        const { col: aX, row: aY } = anchorPos;

        const chargeDx = Math.sign(aX - cX);
        const chargeDy = Math.sign(aY - cY);

        const processPush = async <U extends BattleUnit>(entity: U) => {
            const { col: tX, row: tY } = entity.gridPosition;
            let dx = 0;
            let dy = 0;

            if (effect.pushDirection === "sideways") {
                dx = -chargeDy;
                dy = chargeDx;
            } else if (effect.pushDirection === "towards") {
                dx = -Math.sign(tX - cX);
                dy = -Math.sign(tY - cY);
            } else {
                dx = Math.sign(tX - cX);
                dy = Math.sign(tY - cY);
            }

            if (dx === 0 && dy === 0) return entity;

            let currentX = tX;
            let currentY = tY;
            let collided = false;
            const pushPath: { col: number; row: number }[] = [];

            for (let i = 0; i < effect.distance; i++) {
                const nextX = currentX + dx;
                const nextY = currentY + dy;
                const nextPos = { col: nextX, row: nextY };

                const isOccupied = draftFigures.some(
                    (f) =>
                        f.gridPosition.col === nextPos.col &&
                        f.gridPosition.row === nextPos.row &&
                        f.id !== entity.id,
                );

                if (!isTileInBounds(nextPos) || isOccupied) {
                    if (effect.pushDirection === "sideways") {
                        const altDx = -dx;
                        const altDy = -dy;
                        const altNextPos = { col: currentX + altDx, row: currentY + altDy };

                        const altOccupied = draftFigures.some(
                            (f) =>
                                f.gridPosition.col === altNextPos.col &&
                                f.gridPosition.row === altNextPos.row &&
                                f.id !== entity.id,
                        );

                        if (!isTileInBounds(altNextPos) || altOccupied) {
                            collided = true;
                            break; 
                        } else {
                            dx = altDx;
                            dy = altDy;
                            currentX = altNextPos.col;
                            currentY = altNextPos.row;
                            pushPath.push({ col: currentX, row: currentY });
                            continue;
                        }
                    } else {
                        collided = true;
                        break;
                    }
                }

                currentX = nextX;
                currentY = nextY;
                pushPath.push({ col: currentX, row: currentY });
            }

            if (pushPath.length === 0 && !collided) return entity;

            let updatedEntity = await moveBattleUnit(get, set)({
                movingUnit: entity,
                path: pushPath,
                stepDelayMs: 100,
            });

            if (collided && effect.collisionDamage > 0 && updatedEntity.currentHp > 0) {
                const expectedEnd = pushPath.length > 0 ? pushPath[pushPath.length - 1] : entity.gridPosition;
                if (updatedEntity.gridPosition.col === expectedEnd.col && updatedEntity.gridPosition.row === expectedEnd.row) {
                    updatedEntity = applyDamageToEntity(
                        updatedEntity,
                        effect.collisionDamage,
                    );
                    updateBattleUnitState(set)(updatedEntity);
                }
            }

            return updatedEntity;
        };

        await Promise.all(
            targets
                .map((targetId) => draftFigures.find((f) => f.id === targetId))
                .filter((f) => f !== undefined)
                .map(processPush)
        );
    };