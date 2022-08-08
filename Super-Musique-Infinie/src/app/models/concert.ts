export class Concert {
  constructor(
    public country: string,
    public location: string,
    public name: string,
    public center: google.maps.LatLngLiteral
  ) {}
}
