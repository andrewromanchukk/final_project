export class ChartColor {
  private colors = [
    'green',
    'red',
    'orange',
    'blue',
    'purple',
    'mediumslateblue',
    'lightcoral',
    'mediumvioletred',
    'steelblue'
  ];
  private count = -1;

  getColor() {
    if (this.count === this.colors.length - 1) {
      this.count = -1;
    }
    this.count++;
    return this.colors[this.count];
  }
}
