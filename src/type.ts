export type Output = 
{
  characters: Array<{
    /** キャラクターの名前 */
    name: string;
    /** キャラクターの年齢 */
    age: number;
    /** キャラクターの属性 */
    attributes: Array<string>;
    /** キャラクターの性格 */
    personality: string;
    /** キャラクターの能力値を3-18で */
    stats: {
      /** 筋力 */
      strength: number;
      /** 知力 */
      intelligence: number;
      /** 器用さ */
      dexterity: number;
      /** 素早さ */
      agility: number;
      /** 運 */
      luck: number;
    };
    /** 生い立ち */
    background: string;
    /** 使える魔法 */
    magic: string | null;
  }>
}
