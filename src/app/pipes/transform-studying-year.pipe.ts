import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformStudyingYear'
})
export class TransformStudyingYearPipe implements PipeTransform {
  transformedValue: any;

  transform(value: any): any {
    if (typeof value === 'number') {
      this.transformedValue =
        value.toString() + '/' + (value + 1).toString().slice(2, 4);
    } else {
      this.transformedValue = value;
    }
    return this.transformedValue;
  }
}
