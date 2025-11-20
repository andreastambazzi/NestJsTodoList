/**
 * ############################################################################
 * 
 *  
 * 
 */
export class InfoDto {
  public info: string;

  constructor(info?: string) {
    this.info = info != undefined ? info : 'N.D.';
  }
}
