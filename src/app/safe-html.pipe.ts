import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  transform(value: any): any {
    //return value.split('&lt;').join('<').split('&gt;').join('>');
    return value.replace(/<.*?>/g, '').replace(/&nbsp;/g, " "); 
  }

}
