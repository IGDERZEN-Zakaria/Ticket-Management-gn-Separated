export interface Ticket {
    id: string;
    intitule: string;
    description: string;
    notes: string;
    delai : Date| null ;
    createdBy: any| null;

    etat :  string;

    remarques : string;
    filePath: string;
    treatedBy: any| null;

  }
