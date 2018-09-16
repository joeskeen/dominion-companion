import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'description',
  pure: true
})
export class DescriptionPipe implements PipeTransform {
    transform(description: string){
        return description
            .replace('<line>','<hr/>')
            .replace('<n>', '<br/>')
            .replace('<br>','<br/>');
    }
}
