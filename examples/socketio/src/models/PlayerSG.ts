export class PlayerSG {

  /**
   *
   */
  public name: string;
  /**
   *
   */
  public isReady: boolean;
  /**
   *
   */
  private _score: number = 0;

  constructor(private _id: string) {
  }

  /**
   *
   * @returns {string}
   */
  get id(): string {
    return this._id;
  }

  /**
   *
   * @returns {number}
   */
  get score(): number {
    return this._score;
  }

  /**
   *
   */
  public scoreUp() {
    this._score++;
  }

  /**
   *
   */
  public toJSON = () => ({
    userId: this._id,
    name: this.name,
    score: this._score,
    isReady: this.isReady
  });
}