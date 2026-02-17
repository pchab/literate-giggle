export type CardAction = {
  type: 'physAtt' | 'physDef' | 'magAtt' | 'magDef' | 'heal';
  value: number;
  move: number;
}

export type Card = {
  id: number;
  name: string;
  action: CardAction;
}