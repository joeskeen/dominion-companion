import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'description',
  pure: true
})
export class DescriptionPipe implements PipeTransform {
  transform(description: string) {
    return description
      .split(/<n>|<br>/g)
      .map(p => `<p>${p}</p>`)
      .join('')
      .replace('<line>', '<hr/>');
  }
}
