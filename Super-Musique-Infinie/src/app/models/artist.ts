export class Artist {
  constructor(
    public uid: string,
    public name: string,
    public image: string,
    public followers: number,
    public popularity: number,
    public genres: Array<string>
  ) {}
}
